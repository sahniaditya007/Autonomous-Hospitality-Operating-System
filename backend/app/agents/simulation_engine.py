from app.models.schemas import (
    SimulationRequest, SimulationResult, SimulationEvent, SimulationScenario
)
from app.data.simulated_data import PROPERTIES


SCENARIO_TEMPLATES = {
    SimulationScenario.CLEANER_CANCELLATION: {
        "title": "3 Cleaners Cancel Day-Of",
        "base_events": [
            {"time": 0.5, "type": "CLEANER_DROPOUT", "severity": "HIGH", "unit": "PROP-002"},
            {"time": 0.7, "type": "CLEANER_DROPOUT", "severity": "HIGH", "unit": "PROP-001"},
            {"time": 1.0, "type": "CLEANER_DROPOUT", "severity": "CRITICAL", "unit": "PROP-003"},
            {"time": 1.5, "type": "CHECK_IN_BLOCKED", "severity": "CRITICAL", "unit": "PROP-002"},
            {"time": 2.0, "type": "GUEST_COMPLAINT", "severity": "HIGH", "unit": "PROP-001"},
            {"time": 2.5, "type": "EMERGENCY_CLEANER_DISPATCHED", "severity": "MEDIUM", "unit": "PROP-002"},
            {"time": 3.0, "type": "LATE_CHECK_IN_APPROVED", "severity": "LOW", "unit": "PROP-001"},
        ],
        "breakdown_probability": 0.73,
        "revenue_impact": -18500,
        "ops_before": 8.2,
        "ops_after": 6.1,
    },
    SimulationScenario.DEMAND_SPIKE: {
        "title": "NYE Demand 3x Surge",
        "base_events": [
            {"time": 0, "type": "DEMAND_SURGE_DETECTED", "severity": "MEDIUM", "unit": "ALL"},
            {"time": 0.5, "type": "PRICING_ENGINE_ACTIVATED", "severity": "LOW", "unit": "ALL"},
            {"time": 1.0, "type": "MIN_STAY_RULE_UPDATED", "severity": "LOW", "unit": "PROP-005"},
            {"time": 1.5, "type": "LISTING_UPDATED", "severity": "LOW", "unit": "PROP-001"},
            {"time": 2.0, "type": "REVENUE_PROJECTION_UPDATED", "severity": "LOW", "unit": "ALL"},
        ],
        "breakdown_probability": 0.12,
        "revenue_impact": 67000,
        "ops_before": 7.8,
        "ops_after": 9.2,
    },
    SimulationScenario.MAINTENANCE_FAILURE: {
        "title": "PROP-001 AC Failure During Heatwave",
        "base_events": [
            {"time": 0, "type": "AC_SYSTEM_FAILURE", "severity": "CRITICAL", "unit": "PROP-001"},
            {"time": 0.5, "type": "GUEST_COMPLAINT_RECEIVED", "severity": "HIGH", "unit": "PROP-001"},
            {"time": 1.0, "type": "VENDOR_CONTACTED", "severity": "MEDIUM", "unit": "PROP-001"},
            {"time": 1.5, "type": "TEMPORARY_FIX_OFFERED", "severity": "MEDIUM", "unit": "PROP-001"},
            {"time": 3.0, "type": "REFUND_ISSUED", "severity": "MEDIUM", "unit": "PROP-001"},
            {"time": 5.0, "type": "VENDOR_ARRIVAL", "severity": "LOW", "unit": "PROP-001"},
            {"time": 7.0, "type": "SYSTEM_RESTORED", "severity": "LOW", "unit": "PROP-001"},
        ],
        "breakdown_probability": 0.89,
        "revenue_impact": -8200,
        "ops_before": 7.5,
        "ops_after": 5.8,
    },
    SimulationScenario.MULTIPLE_COMPLAINTS: {
        "title": "Weekend Complaint Storm",
        "base_events": [
            {"time": 0, "type": "COMPLAINT_RECEIVED", "severity": "HIGH", "unit": "PROP-002"},
            {"time": 0.3, "type": "COMPLAINT_RECEIVED", "severity": "HIGH", "unit": "PROP-004"},
            {"time": 0.6, "type": "COMPLAINT_RECEIVED", "severity": "CRITICAL", "unit": "PROP-002"},
            {"time": 1.0, "type": "ESCALATION_TRIGGERED", "severity": "CRITICAL", "unit": "PROP-002"},
            {"time": 1.5, "type": "HOST_NOTIFIED", "severity": "HIGH", "unit": "PROP-002"},
            {"time": 2.0, "type": "REFUND_PROCESSING", "severity": "MEDIUM", "unit": "PROP-002"},
            {"time": 3.0, "type": "MAINTENANCE_ORDER_PLACED", "severity": "MEDIUM", "unit": "PROP-002"},
        ],
        "breakdown_probability": 0.61,
        "revenue_impact": -12000,
        "ops_before": 7.0,
        "ops_after": 5.2,
    },
    SimulationScenario.OVERBOOKING: {
        "title": "Double Booking Crisis — PROP-003",
        "base_events": [
            {"time": 0, "type": "DOUBLE_BOOKING_DETECTED", "severity": "CRITICAL", "unit": "PROP-003"},
            {"time": 0.2, "type": "CALENDAR_LOCK_INITIATED", "severity": "HIGH", "unit": "PROP-003"},
            {"time": 0.5, "type": "GUEST_CONTACTED", "severity": "HIGH", "unit": "PROP-003"},
            {"time": 1.0, "type": "ALTERNATIVE_PROPERTY_OFFERED", "severity": "MEDIUM", "unit": "PROP-001"},
            {"time": 1.5, "type": "GUEST_RELOCATED", "severity": "MEDIUM", "unit": "PROP-001"},
            {"time": 2.0, "type": "COMPENSATION_ISSUED", "severity": "MEDIUM", "unit": "PROP-003"},
        ],
        "breakdown_probability": 0.45,
        "revenue_impact": -5500,
        "ops_before": 8.0,
        "ops_after": 7.1,
    },
}

AI_RESPONSES = {
    "CLEANER_DROPOUT": "STRIX detected cleaner dropout → activated backup vendor pool → dispatching QuickClean Pro",
    "CHECK_IN_BLOCKED": "STRIX sent proactive delay notification to guest → offered ₹300 credit → rescheduled to 4 PM",
    "GUEST_COMPLAINT": "STRIX auto-classified complaint → sent empathetic reply → escalated to host with full context",
    "EMERGENCY_CLEANER_DISPATCHED": "STRIX sourced emergency cleaner via vendor network → confirmed ETA 45 mins",
    "LATE_CHECK_IN_APPROVED": "STRIX approved late check-in with compensation → guest satisfaction maintained",
    "DEMAND_SURGE_DETECTED": "STRIX detected NYE demand spike → recommended price increase of 280% → updated all listings",
    "PRICING_ENGINE_ACTIVATED": "STRIX dynamic pricing activated → average rate lifted from ₹4,500 to ₹12,600 per night",
    "MIN_STAY_RULE_UPDATED": "STRIX enforced 3-night minimum stay for peak period → rejecting single-night bookings",
    "LISTING_UPDATED": "STRIX rewrote listing titles/descriptions for peak event → CTR improvement projected at +34%",
    "REVENUE_PROJECTION_UPDATED": "STRIX projects ₹67,000 additional revenue across portfolio this weekend",
    "AC_SYSTEM_FAILURE": "STRIX detected AC failure from guest message pattern → immediately created maintenance ticket",
    "GUEST_COMPLAINT_RECEIVED": "STRIX classified as HIGH urgency complaint → sent empathy reply + ETA update",
    "VENDOR_CONTACTED": "STRIX auto-contacted 3 HVAC vendors → fastest response: 2 hours",
    "TEMPORARY_FIX_OFFERED": "STRIX offered portable AC unit + ₹500 credit while repair is pending",
    "REFUND_ISSUED": "STRIX calculated fair partial refund of ₹1,200 → processed automatically",
    "VENDOR_ARRIVAL": "Vendor arrived — STRIX logged arrival time for SLA tracking",
    "SYSTEM_RESTORED": "AC restored → STRIX sent confirmation to guest + logged resolution to memory graph",
    "COMPLAINT_RECEIVED": "STRIX triaged complaint → classified intent, emotion, urgency → routed to resolution engine",
    "ESCALATION_TRIGGERED": "STRIX escalated to human host — guest has prior complaint history, high churn risk",
    "HOST_NOTIFIED": "Host notified via WhatsApp with full context, guest transcript, and recommended action",
    "REFUND_PROCESSING": "STRIX initiated partial refund workflow — ₹1,500 compensation approved",
    "MAINTENANCE_ORDER_PLACED": "STRIX placed pest control order → scheduled for next morning 8 AM",
    "DOUBLE_BOOKING_DETECTED": "STRIX detected calendar conflict → immediately locked property calendar across all channels",
    "CALENDAR_LOCK_INITIATED": "STRIX synced cancellation across Airbnb, direct booking site, and internal calendar",
    "GUEST_CONTACTED": "STRIX proactively messaged both guests before they arrived → explained situation professionally",
    "ALTERNATIVE_PROPERTY_OFFERED": "STRIX found available PROP-001 (same city, similar specs) → offered with ₹500 discount",
    "GUEST_RELOCATED": "Guest accepted relocation — STRIX updated all booking records and notified cleaning team",
    "COMPENSATION_ISSUED": "STRIX issued ₹1,000 goodwill credit to affected guest",
}

SEVERITY_DESCRIPTIONS = {
    "CRITICAL": "Operations severely impacted — immediate AI intervention",
    "HIGH": "Significant risk — STRIX autonomously handling",
    "MEDIUM": "Moderate disruption — STRIX monitoring and resolving",
    "LOW": "Minor impact — STRIX optimizing automatically",
}


def run_simulation(request: SimulationRequest) -> SimulationResult:
    template = SCENARIO_TEMPLATES.get(request.scenario)
    if not template:
        raise ValueError(f"Unknown scenario: {request.scenario}")

    intensity = request.intensity
    events = []

    for ev in template["base_events"]:
        unit = ev["unit"]
        if unit == "ALL":
            unit = "All Properties"

        description = _get_event_description(ev["type"], ev["unit"], request.scenario)
        ai_response = AI_RESPONSES.get(ev["type"], "STRIX is processing this event autonomously")
        resolved = ev["severity"] in ("LOW", "MEDIUM") or ev["type"] in (
            "LATE_CHECK_IN_APPROVED", "SYSTEM_RESTORED", "GUEST_RELOCATED", "REFUND_ISSUED"
        )

        events.append(SimulationEvent(
            time_offset_hours=ev["time"] * intensity,
            event_type=ev["type"],
            affected_unit=unit,
            description=description,
            severity=ev["severity"],
            ai_response=ai_response,
            resolved=resolved
        ))

    revenue_impact = template["revenue_impact"] * intensity
    ai_fix_summary = _generate_fix_summary(request.scenario, template, revenue_impact)

    return SimulationResult(
        scenario=template["title"],
        property_count=len(PROPERTIES),
        events=events,
        breakdown_probability=min(template["breakdown_probability"] * intensity, 0.99),
        revenue_impact=revenue_impact,
        ai_fix_summary=ai_fix_summary,
        ops_score_before=template["ops_before"],
        ops_score_after=template["ops_after"]
    )


def _get_event_description(event_type: str, unit: str, scenario: SimulationScenario) -> str:
    descriptions = {
        "CLEANER_DROPOUT": f"Cleaner for {unit} cancelled with 2-hour notice — 3 upcoming check-ins at risk",
        "CHECK_IN_BLOCKED": f"Guest check-in at {unit} blocked due to unavailable room — arriving in 1 hour",
        "GUEST_COMPLAINT": f"Angry guest message at {unit} — second complaint from same guest this stay",
        "EMERGENCY_CLEANER_DISPATCHED": f"Emergency cleaning team dispatched to {unit}",
        "LATE_CHECK_IN_APPROVED": f"Late check-in approved at {unit} with ₹300 credit compensation",
        "DEMAND_SURGE_DETECTED": "Search volume +340% vs last year — NYE bookings surging across Mumbai & Bengaluru",
        "PRICING_ENGINE_ACTIVATED": "Dynamic pricing engine activated — adjusting rates across all 5 properties",
        "MIN_STAY_RULE_UPDATED": f"Minimum stay updated to 3 nights for NYE period at {unit}",
        "LISTING_UPDATED": f"Listing title and photos reordered for peak demand at {unit}",
        "REVENUE_PROJECTION_UPDATED": "Projected portfolio revenue for weekend: ₹1,74,000 (up from ₹62,000)",
        "AC_SYSTEM_FAILURE": f"AC unit failure detected at {unit} during peak summer — guest impact: HIGH",
        "GUEST_COMPLAINT_RECEIVED": f"Guest complaint about AC at {unit} — urgency: 9/10",
        "VENDOR_CONTACTED": f"3 HVAC vendors contacted for {unit} — awaiting confirmation",
        "TEMPORARY_FIX_OFFERED": f"Portable AC ordered from nearby store for {unit}",
        "REFUND_ISSUED": f"Partial refund of ₹1,200 issued for inconvenience at {unit}",
        "VENDOR_ARRIVAL": f"Vendor arrived at {unit} for AC repair — estimated 2 hours",
        "SYSTEM_RESTORED": f"AC system fully restored at {unit} — guest informed",
        "COMPLAINT_RECEIVED": f"High-urgency complaint at {unit} — pest sighting reported by guest",
        "ESCALATION_TRIGGERED": f"Escalation triggered for {unit} — guest has prior complaint history",
        "HOST_NOTIFIED": f"Host notified for {unit} — full context, transcript, recommended action sent",
        "REFUND_PROCESSING": f"Partial refund processing for {unit} — ₹1,500 compensation",
        "MAINTENANCE_ORDER_PLACED": f"Pest control scheduled for {unit} — 8 AM tomorrow",
        "DOUBLE_BOOKING_DETECTED": f"Critical: Double booking detected for {unit} — two guests arriving same day",
        "CALENDAR_LOCK_INITIATED": f"Calendar locked across all channels for {unit}",
        "GUEST_CONTACTED": f"Both guests proactively messaged for {unit} — professional explanation sent",
        "ALTERNATIVE_PROPERTY_OFFERED": f"Alternative property {unit} offered to displaced guest",
        "GUEST_RELOCATED": f"Guest successfully relocated to {unit} — all records updated",
        "COMPENSATION_ISSUED": f"₹1,000 goodwill credit issued to affected guest at {unit}",
    }
    return descriptions.get(event_type, f"{event_type} occurred at {unit}")


def _generate_fix_summary(scenario: SimulationScenario, template: dict, revenue_impact: float) -> str:
    if revenue_impact < 0:
        impact_str = f"₹{abs(revenue_impact):,.0f} loss mitigated"
    else:
        impact_str = f"₹{revenue_impact:,.0f} additional revenue captured"

    summaries = {
        SimulationScenario.CLEANER_CANCELLATION: f"STRIX handled 3 simultaneous cleaner dropouts: sourced emergency vendors, proactively notified guests with ETA + compensation, and prevented check-in failures. {impact_str}. Without STRIX, estimated 3 negative reviews and ₹18,500 in lost revenue/refunds.",
        SimulationScenario.DEMAND_SPIKE: f"STRIX detected NYE demand surge and autonomously repriced all 5 properties, updated listings, and enforced minimum stay rules. {impact_str} vs baseline. Human ops team would have missed the 48-hour pricing window.",
        SimulationScenario.MAINTENANCE_FAILURE: f"STRIX detected AC failure from message sentiment before guest formally complained. Dispatched vendor, offered temporary solution, and processed fair partial refund. {impact_str}. Response time: 8 min vs industry avg 4 hours.",
        SimulationScenario.MULTIPLE_COMPLAINTS: f"STRIX triaged weekend complaint storm across 2 properties simultaneously. Escalated only 1 to human host (pest complaint with review threat). Resolved 6 of 7 issues autonomously. {impact_str}.",
        SimulationScenario.OVERBOOKING: f"STRIX detected double-booking within 12 minutes of calendar conflict. Proactively contacted guests before arrival, offered equivalent alternative with discount, and processed compensation. Guest churn prevented. {impact_str}.",
    }
    return summaries.get(scenario, f"STRIX autonomously handled scenario. {impact_str}.")
