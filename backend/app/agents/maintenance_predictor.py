from app.models.schemas import MaintenancePrediction
from app.core.gemini_client import call_gemini_json
from app.data.simulated_data import MAINTENANCE_HISTORY, PROPERTIES


def _service_age_to_weeks(last_service: str) -> int:
    mapping = {
        "1 month ago": 4, "2 months ago": 8, "3 months ago": 13,
        "6 months ago": 26, "8 months ago": 35, "14 months ago": 61,
        "18 months ago": 78, "24 months ago": 104,
    }
    return mapping.get(last_service, 20)


def _compute_failure_probability(item: str, age_weeks: int, issue_count: int) -> tuple[float, int]:
    base_lifespans = {
        "Air Conditioning Unit": 52,
        "Water Heater": 104,
        "Pest Control": 26,
        "Kitchen Plumbing": 78,
        "Electrical Wiring": 260,
        "WiFi Router/Mesh": 52,
        "Elevator": 156,
        "Terrace Waterproofing": 208,
    }
    lifespan = base_lifespans.get(item, 52)
    age_factor = min(age_weeks / lifespan, 1.5)
    issue_factor = min(issue_count * 0.15, 0.6)
    prob = min(age_factor * 0.5 + issue_factor + 0.05, 0.98)
    weeks_to_failure = max(1, int((lifespan - age_weeks) * (1 - issue_factor)))
    return round(prob, 2), weeks_to_failure


def _get_priority(prob: float) -> str:
    if prob >= 0.7:
        return "CRITICAL"
    elif prob >= 0.5:
        return "HIGH"
    elif prob >= 0.3:
        return "MEDIUM"
    return "LOW"


def _build_prediction_prompt(predictions: list) -> str:
    items_text = "\n".join(
        f"- {p['property']}: {p['item']} | age: {p['age_weeks']}w | issues: {p['issues']} | prob: {p['prob']}"
        for p in predictions
    )
    return f"""You are STRIX maintenance predictor. For each item below, provide a concise reasoning string explaining WHY failure is predicted and what specific service action should be taken.

ITEMS:
{items_text}

Return ONLY a JSON array, one object per item (same order):
[
  {{
    "item": "item name",
    "reasoning": "specific 1-2 sentence reasoning mentioning age, issue pattern, and recommended action"
  }},
  ...
]"""


def get_maintenance_predictions() -> list[MaintenancePrediction]:
    predictions_data = []
    for h in MAINTENANCE_HISTORY:
        prop = next((p for p in PROPERTIES if p["id"] == h["property_id"]), None)
        if not prop:
            continue
        age_weeks = _service_age_to_weeks(h["last_service"])
        prob, weeks_to_failure = _compute_failure_probability(h["item"], age_weeks, h["issue_count"])
        predictions_data.append({
            "property_id": h["property_id"],
            "property": prop["name"],
            "item": h["item"],
            "age_weeks": age_weeks,
            "issues": h["issue_count"],
            "prob": prob,
            "weeks_to_failure": weeks_to_failure,
            "avg_cost": h["avg_cost"],
            "last_service": h["last_service"],
        })

    reasonings = {}
    try:
        prompt = _build_prediction_prompt(predictions_data)
        ai_results = call_gemini_json(prompt)
        if isinstance(ai_results, list):
            for r in ai_results:
                if isinstance(r, dict) and "item" in r:
                    reasonings[r["item"]] = r.get("reasoning", "")
    except Exception:
        pass

    results = []
    for p in predictions_data:
        results.append(MaintenancePrediction(
            property_id=p["property_id"],
            item=p["item"],
            failure_probability=p["prob"],
            estimated_weeks_to_failure=p["weeks_to_failure"],
            last_service=p["last_service"],
            cost_estimate=p["avg_cost"] * 1.3 if p["avg_cost"] > 0 else 2000.0,
            priority=_get_priority(p["prob"]),
            reasoning=reasonings.get(p["item"], f"{p['item']} last serviced {p['last_service']} with {p['issues']} prior incidents — service recommended within {p['weeks_to_failure']} weeks."),
        ))

    results.sort(key=lambda x: x.failure_probability, reverse=True)
    return results
