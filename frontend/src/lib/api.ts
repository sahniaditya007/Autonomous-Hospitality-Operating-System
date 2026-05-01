import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: API_URL, timeout: 120000 })

export interface Message {
  id: string
  guest_name: string
  guest_id: string
  property_id: string
  channel: string
  content: string
  timestamp: string
  booking_id?: string
}

export interface AnalyzedMessage {
  message_id: string
  guest_name: string
  property_id: string
  channel: string
  content: string
  intent: string
  emotion: string
  urgency_score: number
  ai_reply?: string
  decision: string
  decision_details: string
  autonomous: boolean
  timestamp: string
}

export interface InboxResult {
  total_messages: number
  autonomous_handled: number
  escalated: number
  decisions: AnalyzedMessage[]
  summary: string
}

export interface SimulationEvent {
  time_offset_hours: number
  event_type: string
  affected_unit: string
  description: string
  severity: string
  ai_response: string
  resolved: boolean
}

export interface SimulationResult {
  scenario: string
  property_count: number
  events: SimulationEvent[]
  breakdown_probability: number
  revenue_impact: number
  ai_fix_summary: string
  ops_score_before: number
  ops_score_after: number
}

export interface PropertyHealthScore {
  property_id: string
  property_name: string
  overall_score: number
  complaint_rate: number
  cleaner_reliability: number
  maintenance_index: number
  guest_satisfaction: number
  revenue_performance: number
  explanation: string
  issues: string[]
  recommendations: string[]
}

export interface MemoryGraphData {
  nodes: { id: string; type: string; label: string; properties: Record<string, unknown> }[]
  edges: { source: string; target: string; relationship: string; weight: number }[]
  insights: string[]
}

export interface StayDebrief {
  booking_id: string
  guest_name: string
  property_id: string
  check_in: string
  check_out: string
  summary: string
  hidden_insights: string[]
  sentiment_arc: { phase: string; sentiment: string; note: string }[]
  issues_raised: string[]
  cleaner_performance: string
  recommended_actions: string[]
  star_prediction: number
}

export interface MaintenancePrediction {
  property_id: string
  item: string
  failure_probability: number
  estimated_weeks_to_failure: number
  last_service: string
  cost_estimate: number
  priority: string
  reasoning: string
}

export interface DemandSpike {
  event_name: string
  event_date: string
  location: string
  event_type: string
  demand_multiplier: number
  recommended_price: number
  recommended_min_stay: number
  confidence: number
}

export interface ComplaintPattern {
  pattern: string
  frequency: number
  affected_properties: string[]
  star_impact: number
  root_cause: string
  fix_cost_estimate: number
  fix_description: string
}

export interface AuditorFeedback {
  property_id: string
  persona: string
  would_book: boolean
  rating: number
  brutal_feedback: string[]
  positives: string[]
  deal_breakers: string[]
  listing_suggestions: string[]
}

export interface ListingOptimization {
  property_id: string
  current_title: string
  optimized_title: string
  current_description: string
  optimized_description: string
  photo_order_changes: string[]
  pricing_suggestions: string[]
  ab_test_variant: string
  projected_ctr_lift: number
  projected_conversion_lift: number
}

export interface Property {
  id: string
  name: string
  location: string
  type: string
  bedrooms: number
  base_price: number
}

// API calls
export const processInbox = (useSimulated = true): Promise<InboxResult> =>
  api.post('/inbox/process', { use_simulated: useSimulated }).then(r => r.data)

export const getSimulatedMessages = (): Promise<{ messages: Message[]; count: number }> =>
  api.get('/inbox/messages').then(r => r.data)

export const runSimulation = (scenario: string, intensity = 1.0): Promise<SimulationResult> =>
  api.post('/simulation/run', { scenario, intensity }).then(r => r.data)

export const getScenarios = () =>
  api.get('/simulation/scenarios').then(r => r.data)

export const getProperties = (): Promise<{ properties: Property[] }> =>
  api.get('/properties/').then(r => r.data)

export const getHealthScores = (): Promise<PropertyHealthScore[]> =>
  api.get('/properties/health').then(r => r.data)

export const getPropertyHealth = (id: string): Promise<PropertyHealthScore> =>
  api.get(`/properties/${id}/health`).then(r => r.data)

export const runAudit = (propertyId: string, persona: string): Promise<AuditorFeedback> =>
  api.post(`/properties/${propertyId}/audit?persona=${persona}`).then(r => r.data)

export const runFullAudit = (propertyId: string): Promise<AuditorFeedback[]> =>
  api.get(`/properties/${propertyId}/audit/full`).then(r => r.data)

export const optimizeListing = (propertyId: string): Promise<ListingOptimization> =>
  api.get(`/properties/${propertyId}/listing`).then(r => r.data)

export const getMemoryGraph = (): Promise<MemoryGraphData> =>
  api.get('/intelligence/memory-graph').then(r => r.data)

export const getDebriefs = (): Promise<StayDebrief[]> =>
  api.get('/intelligence/debriefs').then(r => r.data)

export const getDebrief = (bookingId: string): Promise<StayDebrief> =>
  api.get(`/intelligence/debriefs/${bookingId}`).then(r => r.data)

export const getMaintenance = (): Promise<MaintenancePrediction[]> =>
  api.get('/intelligence/maintenance').then(r => r.data)

export const getDemandSpikes = (): Promise<DemandSpike[]> =>
  api.get('/intelligence/demand-spikes').then(r => r.data)

export const getComplaintPatterns = (): Promise<ComplaintPattern[]> =>
  api.get('/intelligence/complaint-patterns').then(r => r.data)
