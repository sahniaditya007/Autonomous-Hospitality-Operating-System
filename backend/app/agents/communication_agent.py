from datetime import datetime
from typing import List
from app.models.schemas import (
    AnalyzedMessage, ProcessInboxResponse,
    MessageIntent, MessageEmotion, DecisionType, MessageChannel
)
from app.core.gemini_client import call_gemini_json
from app.core.memory_graph import get_guest_context, add_event
from app.data.simulated_data import SIMULATED_INBOX

PROPERTY_KNOWLEDGE = {
    "PROP-001": {"wifi": "MBSuite2024#", "parking": "B2 level, slot 14A", "checkin": "3 PM", "checkout": "11 AM"},
    "PROP-002": {"wifi": "BandraLoft@88", "parking": "Street parking on Hill Road", "checkin": "2 PM", "checkout": "10 AM"},
    "PROP-003": {"wifi": "ColabaCH2024", "parking": "Private compound, gate code: 4521", "checkin": "3 PM", "checkout": "11 AM"},
    "PROP-004": {"wifi": "KWork#2024", "parking": "Basement P1", "checkin": "1 PM", "checkout": "10 AM"},
    "PROP-005": {"wifi": "PH_Indiranagar!", "parking": "Covered parking, remote in key box", "checkin": "3 PM", "checkout": "11 AM"},
}


def _build_analysis_prompt(message: dict, guest_context: dict, prop_info: dict) -> str:
    return f"""You are STRIX, an autonomous AI operating system for short-term rental properties in India.

Analyze this guest message and return a JSON response.

GUEST MESSAGE:
- Guest: {message['guest_name']}
- Property: {message['property_id']}
- Channel: {message['channel']}
- Message: "{message['content']}"

GUEST HISTORY:
- Prior stays: {guest_context.get('stays', 'unknown')}
- History: {guest_context.get('history', 'new')}
- Prior complaints: {guest_context.get('complaint_count', 0)}
- Avg rating given: {guest_context.get('avg_rating_given', 'N/A')}

PROPERTY KNOWLEDGE:
- WiFi: {prop_info.get('wifi', 'N/A')}
- Parking: {prop_info.get('parking', 'N/A')}
- Check-in: {prop_info.get('checkin', '3 PM')}
- Check-out: {prop_info.get('checkout', '11 AM')}

Return ONLY valid JSON with this exact structure:
{{
  "intent": one of [complaint, check_in, check_out, refund, inquiry, maintenance, late_checkout, praise, noise, cancellation],
  "emotion": one of [angry, frustrated, neutral, happy, confused, anxious],
  "urgency_score": number 0-10,
  "autonomous": true or false,
  "decision": one of [auto_reply, refund, reschedule_cleaning, escalate, ignore, maintenance_order, offer_discount, send_checkin_guide],
  "decision_details": "concise 1-sentence explanation of the decision",
  "ai_reply": "the actual reply message to send to the guest (warm, professional, solution-focused, max 3 sentences)"
}}

Rules:
- If urgency > 7 AND prior complaints exist AND complaint: escalate
- If refund demanded AND pest/major issue: escalate
- If simple inquiry (WiFi/parking/amenities): auto_reply
- If late checkout request: offer if next booking allows, auto_reply
- If praise: auto_reply warmly
- If maintenance needed: maintenance_order
- Keep ai_reply concise and human-sounding in a warm Indian hospitality tone"""


def analyze_single_message(message: dict) -> AnalyzedMessage:
    guest_context = get_guest_context(message["guest_id"])
    prop_info = PROPERTY_KNOWLEDGE.get(message["property_id"], {})
    prompt = _build_analysis_prompt(message, guest_context, prop_info)
    result = call_gemini_json(prompt)

    if isinstance(result, dict) and "error" not in result:
        intent_str = result.get("intent", "inquiry")
        emotion_str = result.get("emotion", "neutral")
        decision_str = result.get("decision", "auto_reply")

        try:
            intent = MessageIntent(intent_str)
        except ValueError:
            intent = MessageIntent.INQUIRY
        try:
            emotion = MessageEmotion(emotion_str)
        except ValueError:
            emotion = MessageEmotion.NEUTRAL
        try:
            decision = DecisionType(decision_str)
        except ValueError:
            decision = DecisionType.AUTO_REPLY

        add_event(message["guest_id"], message["property_id"], intent_str, message["content"][:100])

        return AnalyzedMessage(
            message_id=message["id"],
            guest_name=message["guest_name"],
            property_id=message["property_id"],
            channel=MessageChannel(message["channel"]),
            content=message["content"],
            intent=intent,
            emotion=emotion,
            urgency_score=float(result.get("urgency_score", 5)),
            ai_reply=result.get("ai_reply"),
            decision=decision,
            decision_details=result.get("decision_details", "AI decision"),
            autonomous=bool(result.get("autonomous", True)),
            timestamp=datetime.fromisoformat(message["timestamp"])
        )
    else:
        return _fallback_analysis(message)


def _fallback_analysis(message: dict) -> AnalyzedMessage:
    content_lower = message["content"].lower()
    if any(w in content_lower for w in ["refund", "compensation", "cockroach", "pest", "broken"]):
        intent, emotion, decision, urgency = MessageIntent.COMPLAINT, MessageEmotion.ANGRY, DecisionType.ESCALATE, 8.5
    elif any(w in content_lower for w in ["wifi", "password", "parking", "checkin", "check-in"]):
        intent, emotion, decision, urgency = MessageIntent.INQUIRY, MessageEmotion.NEUTRAL, DecisionType.AUTO_REPLY, 3.0
    elif any(w in content_lower for w in ["late checkout", "check out late", "1 pm", "12 pm"]):
        intent, emotion, decision, urgency = MessageIntent.LATE_CHECKOUT, MessageEmotion.NEUTRAL, DecisionType.AUTO_REPLY, 2.0
    elif any(w in content_lower for w in ["amazing", "perfect", "great", "love"]):
        intent, emotion, decision, urgency = MessageIntent.PRAISE, MessageEmotion.HAPPY, DecisionType.AUTO_REPLY, 1.0
    else:
        intent, emotion, decision, urgency = MessageIntent.INQUIRY, MessageEmotion.NEUTRAL, DecisionType.AUTO_REPLY, 4.0

    return AnalyzedMessage(
        message_id=message["id"],
        guest_name=message["guest_name"],
        property_id=message["property_id"],
        channel=MessageChannel(message["channel"]),
        content=message["content"],
        intent=intent,
        emotion=emotion,
        urgency_score=urgency,
        ai_reply="Thank you for reaching out! Our team will assist you shortly.",
        decision=decision,
        decision_details="Fallback classification applied",
        autonomous=decision != DecisionType.ESCALATE,
        timestamp=datetime.fromisoformat(message["timestamp"])
    )


def process_inbox(messages: List[dict] = None) -> ProcessInboxResponse:
    if messages is None:
        messages = SIMULATED_INBOX

    analyzed = []
    for msg in messages:
        result = analyze_single_message(msg)
        analyzed.append(result)

    autonomous_count = sum(1 for a in analyzed if a.autonomous)
    escalated_count = sum(1 for a in analyzed if a.decision == DecisionType.ESCALATE)

    decision_counts = {}
    for a in analyzed:
        k = a.decision.value
        decision_counts[k] = decision_counts.get(k, 0) + 1

    summary_parts = [f"{v} {k.replace('_', ' ')}" for k, v in decision_counts.items()]
    summary = (
        f"STRIX processed {len(analyzed)} messages. "
        f"Handled autonomously: {autonomous_count} ({round(autonomous_count/len(analyzed)*100)}%). "
        f"Decisions: {', '.join(summary_parts)}."
    )

    return ProcessInboxResponse(
        total_messages=len(analyzed),
        autonomous_handled=autonomous_count,
        escalated=escalated_count,
        decisions=analyzed,
        summary=summary
    )
