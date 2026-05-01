from app.models.schemas import ComplaintPattern
from app.core.gemini_client import call_gemini_json
from app.data.simulated_data import PROPERTIES, PROPERTY_REVIEWS


def _build_mining_prompt(all_reviews: dict) -> str:
    review_lines = []
    for prop_id, reviews in all_reviews.items():
        prop_name = next((p["name"] for p in PROPERTIES if p["id"] == prop_id), prop_id)
        for r in reviews:
            review_lines.append(f"[{prop_name}] ({r['stars']}★): \"{r['text']}\"")

    return f"""You are STRIX Silent Complaint Miner. Analyze these short-term rental reviews to detect HIDDEN dissatisfaction patterns that are not obvious from star ratings alone.

REVIEWS ({len(review_lines)} total):
{chr(10).join(review_lines)}

Find patterns where:
- Recurring issues appear across multiple reviews but are mentioned casually
- Small problems that correlate with star rating drops
- Things guests mention in passing that signal bigger underlying issues
- Patterns tied to time (e.g., weekends, specific months) or property type

Return ONLY a JSON array of patterns found:
[
  {{
    "pattern": "concise name of the pattern detected",
    "frequency": number of reviews this appears in,
    "affected_properties": ["PROP-XXX", ...],
    "star_impact": negative number showing star rating drop (e.g., -0.3),
    "root_cause": "the underlying operational issue causing this",
    "fix_cost_estimate": estimated cost in INR to fix,
    "fix_description": "specific actionable fix"
  }},
  ...
]

Find at least 4-5 patterns. Be specific and insightful."""


def mine_complaints() -> list[ComplaintPattern]:
    try:
        prompt = _build_mining_prompt(PROPERTY_REVIEWS)
        ai_results = call_gemini_json(prompt)
        if isinstance(ai_results, list):
            patterns = []
            for r in ai_results:
                if isinstance(r, dict):
                    patterns.append(ComplaintPattern(
                        pattern=r.get("pattern", "Unknown pattern"),
                        frequency=int(r.get("frequency", 1)),
                        affected_properties=r.get("affected_properties", []),
                        star_impact=float(r.get("star_impact", -0.2)),
                        root_cause=r.get("root_cause", "Operational gap"),
                        fix_cost_estimate=float(r.get("fix_cost_estimate", 1000)),
                        fix_description=r.get("fix_description", "Operational improvement needed"),
                    ))
            return patterns
    except Exception:
        pass

    return _fallback_patterns()


def _fallback_patterns() -> list[ComplaintPattern]:
    return [
        ComplaintPattern(
            pattern="WiFi Reliability Issues",
            frequency=4,
            affected_properties=["PROP-004"],
            star_impact=-0.5,
            root_cause="Single router covering large apartment — dead zones on upper floor",
            fix_cost_estimate=3500,
            fix_description="Install mesh WiFi system (TP-Link Deco M9) — 2 nodes — estimated ₹3,500. Projected 0.5★ rating improvement.",
        ),
        ComplaintPattern(
            pattern="Pest Sightings in Kitchen",
            frequency=3,
            affected_properties=["PROP-002"],
            star_impact=-1.2,
            root_cause="Cyclical pest issue — last treatment 6 months ago, kitchen food debris attracts cockroaches",
            fix_cost_estimate=1500,
            fix_description="Quarterly pest control (every 3 months instead of 6). Add sealed food containers to kitchen. Expected ROI: 5x in rating improvement.",
        ),
        ComplaintPattern(
            pattern="AC Inconsistency in Warm Months",
            frequency=2,
            affected_properties=["PROP-001"],
            star_impact=-0.8,
            root_cause="Aging AC unit (8 months since last service) — loses cooling efficiency above 35°C outdoor temp",
            fix_cost_estimate=3500,
            fix_description="Schedule AC service before April (peak heat). Replace filter. Check refrigerant. Cost: ₹3,500. Prevents 0.8★ drop.",
        ),
        ComplaintPattern(
            pattern="Parking Information Gap",
            frequency=2,
            affected_properties=["PROP-003"],
            star_impact=-0.3,
            root_cause="Listing doesn't clearly describe parking — guests arrive confused and stressed",
            fix_cost_estimate=0,
            fix_description="Add detailed parking section to listing with photos and map pin. Include in check-in message. Zero-cost fix.",
        ),
        ComplaintPattern(
            pattern="Hot Water Delay on Arrival",
            frequency=2,
            affected_properties=["PROP-001"],
            star_impact=-0.2,
            root_cause="Water heater takes 5+ minutes to warm up — guests expect instant hot water",
            fix_cost_estimate=500,
            fix_description="Add note in check-in guide: 'Hot water takes 3-5 min — we recommend running it before showering.' Manage expectations proactively.",
        ),
    ]
