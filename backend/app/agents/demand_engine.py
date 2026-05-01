from app.models.schemas import DemandSpike
from app.core.gemini_client import call_gemini_json
from app.data.simulated_data import DEMAND_EVENTS, PROPERTIES


def _build_demand_prompt(events: list, properties: list) -> str:
    events_text = "\n".join(
        f"- {e['event_name']} on {e['date']} in {e['location']} (type: {e['type']}, demand_multiplier: {e['demand_multiplier']}x)"
        for e in events
    )
    props_text = ", ".join(f"{p['name']} in {p['location']} (₹{p['base_price']}/night)" for p in properties)
    return f"""You are STRIX Demand Intelligence Engine. Analyze upcoming events and suggest revenue optimization.

UPCOMING EVENTS:
{events_text}

PORTFOLIO:
{props_text}

For each event, provide pricing and strategy recommendations.

Return ONLY a JSON array, one object per event (same order as input):
[
  {{
    "event_name": "...",
    "event_date": "YYYY-MM-DD",
    "location": "...",
    "event_type": "...",
    "demand_multiplier": number,
    "recommended_price": number in INR for affected property (highest demand property),
    "recommended_min_stay": number of nights minimum,
    "confidence": number 0-1
  }},
  ...
]"""


def get_demand_spikes() -> list[DemandSpike]:
    try:
        prompt = _build_demand_prompt(DEMAND_EVENTS, PROPERTIES)
        ai_results = call_gemini_json(prompt)
        if isinstance(ai_results, list) and len(ai_results) == len(DEMAND_EVENTS):
            results = []
            for i, ev in enumerate(DEMAND_EVENTS):
                ai = ai_results[i] if i < len(ai_results) else {}
                base_price = max(p["base_price"] for p in PROPERTIES if p["location"] in [ev["location"], "Pan India"] or ev["location"] == "Pan India")
                results.append(DemandSpike(
                    event_name=ev["event_name"],
                    event_date=ev["date"],
                    location=ev["location"],
                    event_type=ev["type"],
                    demand_multiplier=float(ai.get("demand_multiplier", ev["demand_multiplier"])),
                    recommended_price=float(ai.get("recommended_price", base_price * ev["demand_multiplier"])),
                    recommended_min_stay=int(ai.get("recommended_min_stay", 2)),
                    confidence=float(ai.get("confidence", 0.82)),
                ))
            return results
    except Exception:
        pass

    return _fallback_demand_spikes()


def _fallback_demand_spikes() -> list[DemandSpike]:
    results = []
    for ev in DEMAND_EVENTS:
        relevant_props = [p for p in PROPERTIES if p["location"] == ev["location"] or ev["location"] == "Pan India"]
        if not relevant_props:
            relevant_props = PROPERTIES

        base_price = max(p["base_price"] for p in relevant_props)
        recommended_price = base_price * ev["demand_multiplier"]
        min_stay = 3 if ev["demand_multiplier"] >= 2.5 else 2

        results.append(DemandSpike(
            event_name=ev["event_name"],
            event_date=ev["date"],
            location=ev["location"],
            event_type=ev["type"],
            demand_multiplier=ev["demand_multiplier"],
            recommended_price=round(recommended_price),
            recommended_min_stay=min_stay,
            confidence=0.85,
        ))
    return results
