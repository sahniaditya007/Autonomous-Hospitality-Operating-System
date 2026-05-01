from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime


class MessageChannel(str, Enum):
    AIRBNB = "airbnb"
    WHATSAPP = "whatsapp"
    EMAIL = "email"


class MessageIntent(str, Enum):
    COMPLAINT = "complaint"
    CHECK_IN = "check_in"
    CHECK_OUT = "check_out"
    REFUND = "refund"
    INQUIRY = "inquiry"
    MAINTENANCE = "maintenance"
    LATE_CHECKOUT = "late_checkout"
    PRAISE = "praise"
    NOISE = "noise"
    CANCELLATION = "cancellation"


class MessageEmotion(str, Enum):
    ANGRY = "angry"
    FRUSTRATED = "frustrated"
    NEUTRAL = "neutral"
    HAPPY = "happy"
    CONFUSED = "confused"
    ANXIOUS = "anxious"


class DecisionType(str, Enum):
    AUTO_REPLY = "auto_reply"
    REFUND = "refund"
    RESCHEDULE_CLEANING = "reschedule_cleaning"
    ESCALATE = "escalate"
    IGNORE = "ignore"
    MAINTENANCE_ORDER = "maintenance_order"
    OFFER_DISCOUNT = "offer_discount"
    SEND_CHECKIN_GUIDE = "send_checkin_guide"


class GuestMessage(BaseModel):
    id: str
    guest_name: str
    guest_id: str
    property_id: str
    channel: MessageChannel
    content: str
    timestamp: datetime
    booking_id: Optional[str] = None


class AnalyzedMessage(BaseModel):
    message_id: str
    guest_name: str
    property_id: str
    channel: MessageChannel
    content: str
    intent: MessageIntent
    emotion: MessageEmotion
    urgency_score: float = Field(ge=0, le=10)
    ai_reply: Optional[str] = None
    decision: DecisionType
    decision_details: str
    autonomous: bool
    timestamp: datetime


class ProcessInboxRequest(BaseModel):
    messages: Optional[List[GuestMessage]] = None
    use_simulated: bool = True


class ProcessInboxResponse(BaseModel):
    total_messages: int
    autonomous_handled: int
    escalated: int
    decisions: List[AnalyzedMessage]
    summary: str


class SimulationScenario(str, Enum):
    CLEANER_CANCELLATION = "cleaner_cancellation"
    DEMAND_SPIKE = "demand_spike"
    MAINTENANCE_FAILURE = "maintenance_failure"
    MULTIPLE_COMPLAINTS = "multiple_complaints"
    OVERBOOKING = "overbooking"


class SimulationRequest(BaseModel):
    scenario: SimulationScenario
    property_ids: List[str] = []
    intensity: float = Field(default=1.0, ge=0.1, le=3.0)


class SimulationEvent(BaseModel):
    time_offset_hours: float
    event_type: str
    affected_unit: str
    description: str
    severity: str
    ai_response: str
    resolved: bool


class SimulationResult(BaseModel):
    scenario: str
    property_count: int
    events: List[SimulationEvent]
    breakdown_probability: float
    revenue_impact: float
    ai_fix_summary: str
    ops_score_before: float
    ops_score_after: float


class PropertyHealthScore(BaseModel):
    property_id: str
    property_name: str
    overall_score: float
    complaint_rate: float
    cleaner_reliability: float
    maintenance_index: float
    guest_satisfaction: float
    revenue_performance: float
    explanation: str
    issues: List[str]
    recommendations: List[str]


class MemoryGraphNode(BaseModel):
    id: str
    type: str
    label: str
    properties: Dict[str, Any]


class MemoryGraphEdge(BaseModel):
    source: str
    target: str
    relationship: str
    weight: float = 1.0
    properties: Dict[str, Any] = {}


class MemoryGraphResponse(BaseModel):
    nodes: List[MemoryGraphNode]
    edges: List[MemoryGraphEdge]
    insights: List[str]


class StayDebrief(BaseModel):
    booking_id: str
    guest_name: str
    property_id: str
    check_in: str
    check_out: str
    summary: str
    hidden_insights: List[str]
    sentiment_arc: List[Dict[str, Any]]
    issues_raised: List[str]
    cleaner_performance: str
    recommended_actions: List[str]
    star_prediction: float


class MaintenancePrediction(BaseModel):
    property_id: str
    item: str
    failure_probability: float
    estimated_weeks_to_failure: int
    last_service: str
    cost_estimate: float
    priority: str
    reasoning: str


class AuditorPersona(str, Enum):
    BUSINESS_TRAVELER = "business_traveler"
    COUPLE = "couple"
    FAMILY = "family"
    DIGITAL_NOMAD = "digital_nomad"
    PARTY_GROUP = "party_group"


class AuditorFeedback(BaseModel):
    property_id: str
    persona: AuditorPersona
    would_book: bool
    rating: float
    brutal_feedback: List[str]
    positives: List[str]
    deal_breakers: List[str]
    listing_suggestions: List[str]


class ListingOptimization(BaseModel):
    property_id: str
    current_title: str
    optimized_title: str
    current_description: str
    optimized_description: str
    photo_order_changes: List[str]
    pricing_suggestions: List[str]
    ab_test_variant: str
    projected_ctr_lift: float
    projected_conversion_lift: float


class DemandSpike(BaseModel):
    event_name: str
    event_date: str
    location: str
    event_type: str
    demand_multiplier: float
    recommended_price: float
    recommended_min_stay: int
    confidence: float


class ComplaintPattern(BaseModel):
    pattern: str
    frequency: int
    affected_properties: List[str]
    star_impact: float
    root_cause: str
    fix_cost_estimate: float
    fix_description: str
