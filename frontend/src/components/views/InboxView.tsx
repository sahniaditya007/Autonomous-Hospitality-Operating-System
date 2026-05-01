'use client'
import { useState } from 'react'
import { Inbox, Play, Brain, AlertTriangle, CheckCircle2, MessageSquare, RefreshCw } from 'lucide-react'
import { processInbox, InboxResult, AnalyzedMessage } from '@/lib/api'

const CHANNEL_ICONS: Record<string, string> = { airbnb: '🏠', whatsapp: '💬', email: '📧' }
const EMOTION_COLOR: Record<string, string> = {
  angry: '#8b3a3a', frustrated: '#7a4a1e', neutral: '#8c7b6e',
  happy: '#4a7c59', confused: '#8b6914', anxious: '#5e4a8b'
}
const DECISION_BADGE: Record<string, { label: string; cls: string }> = {
  auto_reply: { label: 'Auto Reply', cls: 'badge-green' },
  refund: { label: 'Refund', cls: 'badge-yellow' },
  reschedule_cleaning: { label: 'Reschedule', cls: 'badge-accent' },
  escalate: { label: 'Escalate', cls: 'badge-red' },
  ignore: { label: 'Ignore', cls: 'badge-purple' },
  maintenance_order: { label: 'Maintenance', cls: 'badge-orange' },
  offer_discount: { label: 'Discount', cls: 'badge-yellow' },
  send_checkin_guide: { label: 'Checkin Guide', cls: 'badge-accent' },
  send_guide: { label: 'Send Guide', cls: 'badge-accent' },
}

export default function InboxView() {
  const [result, setResult] = useState<InboxResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<AnalyzedMessage | null>(null)
  const [error, setError] = useState('')

  const run = async () => {
    setLoading(true)
    setError('')
    setSelected(null)
    try {
      const data = await processInbox(true)
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to process inbox')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl flex items-center gap-2" style={{ color: '#2c2420' }}>
            <Inbox size={20} style={{ color: '#4a7c59' }} /> AI Inbox
          </h1>
          <p style={{ color: '#8c7b6e' }} className="text-sm mt-1">15 simulated messages · Gemini-powered classification</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={run} disabled={loading}>
          {loading ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
          {loading ? 'Processing...' : 'Run STRIX AI'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg" style={{ background: '#f7eeee', border: '1px solid rgba(139,58,58,0.2)', color: '#8b3a3a' }}>
          {error}
        </div>
      )}

      {/* Pre-run state */}
      {!result && !loading && (
        <div className="glass-card p-8 text-center">
          <Brain size={44} style={{ color: '#8b5e3c', margin: '0 auto 16px' }} />
          <div className="font-semibold text-lg mb-2" style={{ color: '#2c2420' }}>Ready to process 15 messages</div>
          <p style={{ color: '#8c7b6e' }} className="text-sm mb-6 max-w-md mx-auto">
            STRIX will classify intent, detect emotion, generate replies, and output decisions for each message — autonomously handling ~80%.
          </p>
          <div className="flex justify-center gap-6 text-sm" style={{ color: '#8c7b6e' }}>
            {['Airbnb complaints', 'WhatsApp check-ins', 'Email inquiries', 'Refund demands', 'Praise messages'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b5e3c' }}></div>{t}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(139,94,60,0.08)', border: '2px solid rgba(139,94,60,0.25)' }}>
              <Brain size={32} style={{ color: '#8b5e3c' }} className="animate-pulse" />
            </div>
            <div>
              <div className="font-semibold" style={{ color: '#2c2420' }}>STRIX processing inbox...</div>
              <div className="text-sm mt-1" style={{ color: '#8c7b6e' }}>Classifying intents · Detecting emotions · Generating replies</div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Summary bar */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Messages', value: result.total_messages, color: '#3a5f8b' },
              { label: 'Autonomous', value: result.autonomous_handled, color: '#4a7c59' },
              { label: 'Escalated', value: result.escalated, color: '#8b3a3a' },
              { label: 'Autonomy Rate', value: `${Math.round(result.autonomous_handled / result.total_messages * 100)}%`, color: '#8b6914' },
            ].map((m, i) => (
              <div key={i} className="metric-card text-center">
                <div className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</div>
                <div className="text-sm mt-1" style={{ color: '#8c7b6e' }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(139,94,60,0.05)', border: '1px solid rgba(139,94,60,0.15)', color: '#4a3f38' }}>
            {result.summary}
          </div>

          {/* Messages list + detail */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b" style={{ borderColor: '#e8e0d4' }}>
                <span className="text-sm font-semibold" style={{ color: '#2c2420' }}>Messages</span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '520px' }}>
                {result.decisions.map((msg) => {
                  const badge = DECISION_BADGE[msg.decision] || { label: msg.decision, cls: 'badge-accent' }
                  const isSelected = selected?.message_id === msg.message_id
                  return (
                    <div
                      key={msg.message_id}
                      onClick={() => setSelected(msg)}
                      className="p-4 border-b cursor-pointer transition-all"
                      style={{
                        borderColor: '#e8e0d4',
                        background: isSelected ? 'rgba(139,94,60,0.05)' : 'transparent',
                        borderLeft: isSelected ? '3px solid #8b5e3c' : '3px solid transparent',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span>{CHANNEL_ICONS[msg.channel] || '💬'}</span>
                          <span className="text-sm font-medium" style={{ color: '#2c2420' }}>{msg.guest_name}</span>
                        </div>
                        <span className={`badge ${badge.cls}`}>{badge.label}</span>
                      </div>
                      <div className="text-xs truncate mb-2" style={{ color: '#8c7b6e' }}>{msg.content}</div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${EMOTION_COLOR[msg.emotion] || '#64748b'}12` }}></div>
                          <span className="text-xs capitalize" style={{ color: EMOTION_COLOR[msg.emotion] || '#64748b' }}>{msg.emotion}</span>
                        </div>
                        <span className="text-xs" style={{ color: '#a89585' }}>urgency {msg.urgency_score.toFixed(1)}/10</span>
                        {msg.autonomous
                          ? <CheckCircle2 size={12} style={{ color: '#4a7c59', marginLeft: 'auto' }} />
                          : <AlertTriangle size={12} style={{ color: '#786C3B', marginLeft: 'auto' }} />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Detail panel */}
            <div className="glass-card">
              {selected ? (
                <div className="p-5 h-full flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold" style={{ color: '#2c2420' }}>{selected.guest_name}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#8c7b6e' }}>{selected.property_id} · {selected.channel}</div>
                    </div>
                    {(() => { const b = DECISION_BADGE[selected.decision] || { label: selected.decision, cls: 'badge-accent' }; return <span className={`badge ${b.cls}`}>{b.label}</span> })()}
                  </div>

                  <div className="p-3 rounded-lg text-sm" style={{ background: '#f0ebe1', color: '#4a3f38', border: '1px solid #ddd5c4' }}>
                    "{selected.content}"
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Intent', value: selected.intent, color: '#8b5e3c' },
                      { label: 'Emotion', value: selected.emotion, color: EMOTION_COLOR[selected.emotion] || '#8c7b6e' },
                      { label: 'Urgency', value: `${selected.urgency_score.toFixed(1)}/10`, color: selected.urgency_score > 7 ? '#8b3a3a' : '#8b6914' },
                      { label: 'Handled By', value: selected.autonomous ? 'STRIX AI' : 'Human', color: selected.autonomous ? '#4a7c59' : '#8b3a3a' },
                    ].map((m, i) => (
                      <div key={i} className="p-2.5 rounded-lg" style={{ background: '#f0ebe1', border: '1px solid #e8e0d4' }}>
                        <div className="text-xs mb-1" style={{ color: '#8c7b6e' }}>{m.label}</div>
                        <div className="text-sm font-medium capitalize" style={{ color: m.color }}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="text-xs font-medium mb-2" style={{ color: '#64748b' }}>DECISION RATIONALE</div>
                    <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(139,105,20,0.06)', border: '1px solid rgba(139,105,20,0.2)', color: '#8b6914' }}>
                      {selected.decision_details}
                    </div>
                  </div>

                  {selected.ai_reply && (
                    <div className="flex-1">
                      <div className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: '#8c7b6e' }}>
                        <MessageSquare size={11} /> AI GENERATED REPLY
                      </div>
                      <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(74,124,89,0.06)', border: '1px solid rgba(74,124,89,0.2)', color: '#2c2420' }}>
                        {selected.ai_reply}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-8">
                  <div>
                    <MessageSquare size={32} style={{ color: '#ddd5c4', margin: '0 auto 12px' }} />
                    <div className="text-sm" style={{ color: '#8c7b6e' }}>Select a message to see AI analysis</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
