from app.models.schemas import PropertyHealthScore
from app.core.gemini_client import call_gemini_json
from app.data.simulated_data import PROPERTIES, PROPERTY_REVIEWS, MAINTENANCE_HISTORY


def _compute_scores(prop_id: str) -> dict:
    reviews = PROPERTY_REVIEWS.get(prop_id, [])
    avg_stars = sum(r["stars"] for r in reviews) / len(reviews) if reviews else 4.0
    complaint_mentions = sum(1 for r in reviews if any(
        w in r["text"].lower() for w in ["issue", "problem", "broken", "dirty", "cockroach", "bad", "worst"]
    ))
    complaint_rate = complaint_mentions / max(len(reviews), 1)

    maintenance = [h for h in MAINTENANCE_HISTORY if h["property_id"] == prop_id]
    total_issues = sum(h["issue_count"] for h in maintenance)
    maintenance_index = max(0, 10 - total_issues * 1.2)

    guest_satisfaction = avg_stars * 2

    base_prices = {"PROP-001": 4500, "PROP-002": 2800, "PROP-003": 7200, "PROP-004": 2200, "PROP-005": 8500}
    occupancy = {"PROP-001": 0.78, "PROP-002": 0.65, "PROP-003": 0.82, "PROP-004": 0.71, "PROP-005": 0.91}
    price = base_prices.get(prop_id, 3000)
    occ = occupancy.get(prop_id, 0.70)
    revenue_performance = min(10, (price * occ) / 500)

    cleaner_map = {"PROP-001": 9.0, "PROP-002": 6.5, "PROP-003": 8.5, "PROP-004": 8.0, "PROP-005": 9.5}
    cleaner_reliability = cleaner_map.get(prop_id, 8.0)

    overall = (
        (1 - complaint_rate) * 2.5 +
        maintenance_index * 0.2 +
        guest_satisfaction * 0.3 +
        revenue_performance * 0.15 +
        cleaner_reliability * 0.2
    )
    overall = min(10, max(0, overall))

    return {
        "avg_stars": avg_stars,
        "complaint_rate": round(complaint_rate, 2),
        "maintenance_index": round(maintenance_index, 1),
        "guest_satisfaction": round(guest_satisfaction, 1),
        "revenue_performance": round(revenue_performance, 1),
        "cleaner_reliability": cleaner_reliability,
        "overall": round(overall, 1),
        "total_issues": total_issues,
        "reviews": reviews,
        "maintenance": maintenance,
    }


def _build_health_prompt(prop: dict, scores: dict) -> str:
    review_texts = [r["text"] for r in scores["reviews"]]
    return f"""You are STRIX, an AI system analyzing short-term rental property health.

Property: {prop['name']} ({prop['id']}) — {prop['location']}
Type: {prop['type']} | Base Price: ₹{prop['base_price']}/night

COMPUTED METRICS:
- Overall Score: {scores['overall']}/10
- Guest Satisfaction: {scores['avg_stars']}/5 stars (avg)
- Complaint Rate: {scores['complaint_rate'] * 100:.0f}%
- Maintenance Issues (total): {scores['total_issues']}
- Maintenance Index: {scores['maintenance_index']}/10
- Revenue Performance: {scores['revenue_performance']}/10
- Cleaner Reliability: {scores['cleaner_reliability']}/10

RECENT REVIEW SNIPPETS:
{chr(10).join(f'- "{r}"' for r in review_texts[:5])}

MAINTENANCE HISTORY:
{chr(10).join(f'- {h["item"]}: {h["issue_count"]} incidents, last serviced {h["last_service"]} ago' for h in scores["maintenance"])}

Return ONLY valid JSON:
{{
  "explanation": "2-3 sentence plain English explanation of WHY this property scores what it does, be specific and actionable",
  "issues": ["list", "of", "up to 5 specific issues detected"],
  "recommendations": ["list", "of", "up to 5 concrete actionable recommendations with estimated impact"]
}}"""


def get_all_health_scores() -> list[PropertyHealthScore]:
    results = []
    for prop in PROPERTIES:
        scores = _compute_scores(prop["id"])
        try:
            prompt = _build_health_prompt(prop, scores)
            ai_result = call_gemini_json(prompt)
            explanation = ai_result.get("explanation", "Score based on review sentiment, maintenance, and revenue data.")
            issues = ai_result.get("issues", [])
            recommendations = ai_result.get("recommendations", [])
        except Exception:
            explanation = f"{prop['name']} scored {scores['overall']}/10 based on historical data."
            issues = []
            recommendations = []

        results.append(PropertyHealthScore(
            property_id=prop["id"],
            property_name=prop["name"],
            overall_score=scores["overall"],
            complaint_rate=scores["complaint_rate"],
            cleaner_reliability=scores["cleaner_reliability"],
            maintenance_index=scores["maintenance_index"],
            guest_satisfaction=scores["guest_satisfaction"],
            revenue_performance=scores["revenue_performance"],
            explanation=explanation,
            issues=issues,
            recommendations=recommendations,
        ))
    return results


def get_health_score(property_id: str) -> PropertyHealthScore:
    prop = next((p for p in PROPERTIES if p["id"] == property_id), None)
    if not prop:
        raise ValueError(f"Property {property_id} not found")

    scores = _compute_scores(property_id)
    try:
        prompt = _build_health_prompt(prop, scores)
        ai_result = call_gemini_json(prompt)
        explanation = ai_result.get("explanation", "Score based on review sentiment, maintenance, and revenue data.")
        issues = ai_result.get("issues", [])
        recommendations = ai_result.get("recommendations", [])
    except Exception:
        explanation = f"{prop['name']} scored {scores['overall']}/10 based on historical data."
        issues = []
        recommendations = []

    return PropertyHealthScore(
        property_id=prop["id"],
        property_name=prop["name"],
        overall_score=scores["overall"],
        complaint_rate=scores["complaint_rate"],
        cleaner_reliability=scores["cleaner_reliability"],
        maintenance_index=scores["maintenance_index"],
        guest_satisfaction=scores["guest_satisfaction"],
        revenue_performance=scores["revenue_performance"],
        explanation=explanation,
        issues=issues,
        recommendations=recommendations,
    )
