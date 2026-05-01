from app.models.schemas import AuditorFeedback, AuditorPersona
from app.core.gemini_client import call_gemini_json
from app.data.simulated_data import PROPERTIES, PROPERTY_REVIEWS

PERSONA_PROFILES = {
    AuditorPersona.BUSINESS_TRAVELER: {
        "name": "Business Traveler",
        "needs": ["Fast WiFi (100+ Mbps)", "Dedicated workspace", "Iron/ironing board", "Early check-in flexibility", "Blackout curtains"],
        "deal_breakers": ["Slow internet", "No workspace", "Noisy neighborhood", "Unreliable AC"],
    },
    AuditorPersona.COUPLE: {
        "name": "Couple",
        "needs": ["Privacy", "Romantic ambiance", "Good views", "Quality bedding", "Netflix/streaming"],
        "deal_breakers": ["Thin walls", "No hot water", "Street noise", "Lack of privacy"],
    },
    AuditorPersona.FAMILY: {
        "name": "Family",
        "needs": ["Multiple bedrooms", "Kitchen access", "Safe neighborhood", "Parking", "Crib/high chair availability"],
        "deal_breakers": ["No kitchen", "Stairs without gates", "Pest sightings", "Insufficient beds"],
    },
    AuditorPersona.DIGITAL_NOMAD: {
        "name": "Digital Nomad",
        "needs": ["Ultra-fast WiFi", "Multiple power outlets", "Standing desk", "Good lighting", "Monthly discount"],
        "deal_breakers": ["WiFi < 50 Mbps", "No power backup", "Loud environment during work hours"],
    },
    AuditorPersona.PARTY_GROUP: {
        "name": "Party Group",
        "needs": ["Common area", "Music-friendly space", "Proximity to nightlife", "No noise complaints from host"],
        "deal_breakers": ["Strict quiet hours", "Thin walls in shared complex", "No outdoor space"],
    },
}


def _build_auditor_prompt(prop: dict, reviews: list, persona: AuditorPersona) -> str:
    profile = PERSONA_PROFILES[persona]
    review_texts = [f'- "{r["text"]}" ({r["stars"]}★)' for r in reviews]
    return f"""You are STRIX AI Auditor. Simulate a {profile['name']} considering booking this property.

PROPERTY: {prop['name']} ({prop['id']})
Type: {prop['type']} | Location: {prop['location']} | Price: ₹{prop['base_price']}/night
Bedrooms: {prop['bedrooms']}

PERSONA — {profile['name']}:
Critical needs: {', '.join(profile['needs'])}
Deal breakers: {', '.join(profile['deal_breakers'])}

RECENT REVIEWS:
{chr(10).join(review_texts)}

Give BRUTAL, honest feedback as this persona. Do NOT sugarcoat.

Return ONLY valid JSON:
{{
  "would_book": true or false,
  "rating": number 1-10,
  "brutal_feedback": ["3-5 specific brutal honest criticisms from this persona's perspective"],
  "positives": ["2-4 genuine positives"],
  "deal_breakers": ["specific deal breakers identified for this persona at this property — empty if none"],
  "listing_suggestions": ["3-5 specific suggestions to improve listing to attract this persona"]
}}"""


def run_audit(property_id: str, persona: AuditorPersona) -> AuditorFeedback:
    prop = next((p for p in PROPERTIES if p["id"] == property_id), None)
    if not prop:
        raise ValueError(f"Property {property_id} not found")

    reviews = PROPERTY_REVIEWS.get(property_id, [])

    try:
        prompt = _build_auditor_prompt(prop, reviews, persona)
        ai_result = call_gemini_json(prompt)
        return AuditorFeedback(
            property_id=property_id,
            persona=persona,
            would_book=bool(ai_result.get("would_book", False)),
            rating=float(ai_result.get("rating", 5.0)),
            brutal_feedback=ai_result.get("brutal_feedback", []),
            positives=ai_result.get("positives", []),
            deal_breakers=ai_result.get("deal_breakers", []),
            listing_suggestions=ai_result.get("listing_suggestions", []),
        )
    except Exception:
        return AuditorFeedback(
            property_id=property_id,
            persona=persona,
            would_book=True,
            rating=6.5,
            brutal_feedback=["Unable to generate detailed feedback at this time."],
            positives=["Property data available for analysis"],
            deal_breakers=[],
            listing_suggestions=["Add more details to listing description"],
        )


def run_full_audit(property_id: str) -> list[AuditorFeedback]:
    results = []
    for persona in AuditorPersona:
        feedback = run_audit(property_id, persona)
        results.append(feedback)
    return results
