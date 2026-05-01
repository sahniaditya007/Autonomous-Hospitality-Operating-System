from app.models.schemas import StayDebrief
from app.core.gemini_client import call_gemini_json

SAMPLE_STAYS = [
    {
        "booking_id": "BK-2341",
        "guest_name": "Arjun Mehta",
        "property_id": "PROP-001",
        "property_name": "Marina Bay Suite",
        "check_in": "2025-04-28",
        "check_out": "2025-05-01",
        "messages": [
            "The AC is not working and it's extremely hot. I need this fixed immediately.",
            "I've been waiting for 2 hours. Nobody has come to fix the AC.",
        ],
        "cleaner_notes": "Unit clean but AC filter looked clogged. Reported it in handoff log.",
        "issues": ["AC failure", "Slow response time"],
        "review_text": "Great view but AC broke down for half a day. Management was slow initially but eventually resolved.",
        "review_stars": 3.0,
    },
    {
        "booking_id": "BK-2342",
        "guest_name": "Priya Sharma",
        "property_id": "PROP-002",
        "property_name": "Bandra Studio Loft",
        "check_in": "2025-04-30",
        "check_out": "2025-05-02",
        "messages": [
            "Just wanted to confirm my check-in time tomorrow. I'll be arriving around 3 PM.",
            "Also, is there a good restaurant nearby you'd recommend?",
        ],
        "cleaner_notes": "Unit was in excellent condition. Guest left everything tidy.",
        "issues": [],
        "review_text": "Amazing stay! Will definitely be back.",
        "review_stars": 5.0,
    },
    {
        "booking_id": "BK-2347",
        "guest_name": "Deepak Joshi",
        "property_id": "PROP-002",
        "property_name": "Bandra Studio Loft",
        "check_in": "2025-04-29",
        "check_out": "2025-05-01",
        "messages": [
            "There are cockroaches in the kitchen. I found two this morning. This is absolutely disgusting.",
            "I have documented this with photos. If I don't receive ₹2000 refund by end of day, I will post this review publicly.",
        ],
        "cleaner_notes": "Kitchen had some food debris near the stove. Pest sighting noted.",
        "issues": ["Pest sighting", "Refund demand", "Review threat"],
        "review_text": "Cockroach sighting in kitchen, not acceptable for the price paid.",
        "review_stars": 1.5,
    },
]


def _build_debrief_prompt(stay: dict) -> str:
    return f"""You are STRIX, an AI conducting a post-stay debrief for a short-term rental.

STAY DETAILS:
- Guest: {stay['guest_name']}
- Property: {stay['property_name']} ({stay['property_id']})
- Period: {stay['check_in']} to {stay['check_out']}

GUEST MESSAGES (chronological):
{chr(10).join(f'{i+1}. "{m}"' for i, m in enumerate(stay['messages']))}

CLEANER NOTES: {stay['cleaner_notes']}

ISSUES REPORTED: {', '.join(stay['issues']) if stay['issues'] else 'None'}

REVIEW: "{stay['review_text']}" — {stay['review_stars']} stars

Analyze and return ONLY valid JSON:
{{
  "summary": "2-3 sentence narrative of this stay from start to finish",
  "hidden_insights": ["non-obvious patterns or insights from this stay that wouldn't be obvious from the review alone"],
  "sentiment_arc": [
    {{"phase": "arrival", "sentiment": "positive/neutral/negative", "note": "brief note"}},
    {{"phase": "mid-stay", "sentiment": "...", "note": "..."}},
    {{"phase": "checkout", "sentiment": "...", "note": "..."}}
  ],
  "issues_raised": ["list of specific issues raised"],
  "cleaner_performance": "brief assessment of cleaner performance",
  "recommended_actions": ["specific actionable items for the host to act on before next booking"],
  "star_prediction": number between 1 and 5
}}"""


def get_all_debriefs() -> list[StayDebrief]:
    results = []
    for stay in SAMPLE_STAYS:
        debrief = get_debrief(stay["booking_id"])
        results.append(debrief)
    return results


def get_debrief(booking_id: str) -> StayDebrief:
    stay = next((s for s in SAMPLE_STAYS if s["booking_id"] == booking_id), None)
    if not stay:
        raise ValueError(f"Booking {booking_id} not found")

    try:
        prompt = _build_debrief_prompt(stay)
        ai_result = call_gemini_json(prompt)
        return StayDebrief(
            booking_id=stay["booking_id"],
            guest_name=stay["guest_name"],
            property_id=stay["property_id"],
            check_in=stay["check_in"],
            check_out=stay["check_out"],
            summary=ai_result.get("summary", "Stay completed."),
            hidden_insights=ai_result.get("hidden_insights", []),
            sentiment_arc=ai_result.get("sentiment_arc", []),
            issues_raised=ai_result.get("issues_raised", stay["issues"]),
            cleaner_performance=ai_result.get("cleaner_performance", "Not assessed"),
            recommended_actions=ai_result.get("recommended_actions", []),
            star_prediction=float(ai_result.get("star_prediction", stay["review_stars"])),
        )
    except Exception:
        return StayDebrief(
            booking_id=stay["booking_id"],
            guest_name=stay["guest_name"],
            property_id=stay["property_id"],
            check_in=stay["check_in"],
            check_out=stay["check_out"],
            summary=f"Stay by {stay['guest_name']} at {stay['property_name']}. Issues: {', '.join(stay['issues']) or 'none'}.",
            hidden_insights=[],
            sentiment_arc=[],
            issues_raised=stay["issues"],
            cleaner_performance="Data unavailable",
            recommended_actions=[],
            star_prediction=stay["review_stars"],
        )
