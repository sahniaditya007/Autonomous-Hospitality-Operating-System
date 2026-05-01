'use client'
import { useState, useEffect } from 'react'
import { Building2, RefreshCw, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { getHealthScores, PropertyHealthScore } from '@/lib/api'

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="progress-bar w-full">
      <div className="progress-bar-fill" style={{ width: `${value * 10}%`, background: color }} />
    </div>
  )
}

function ScoreColor(score: number) {
  if (score >= 8) return '#4a7c59'
  if (score >= 6) return '#8b6914'
  return '#8b3a3a'
}

export default function HealthView() {
  const [scores, setScores] = useState<PropertyHealthScore[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getHealthScores()
      setScores(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load health scores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl flex items-center gap-2" style={{ color: '#2c2420' }}>
            <Building2 size={20} style={{ color: '#8b6914' }} /> Property Health Score
          </h1>
          <p style={{ color: '#8c7b6e' }} className="text-sm mt-1">Explainable AI scores — not just numbers, reasons</p>
        </div>
        <button className="btn-ghost flex items-center gap-2" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg" style={{ background: '#f7eeee', border: '1px solid rgba(139,58,58,0.2)', color: '#8b3a3a' }}>
          {error}
        </div>
      )}

      {loading && scores.length === 0 && (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-20 rounded-lg" />)}
        </div>
      )}

      <div className="space-y-3">
        {scores.map(prop => {
          const isOpen = expanded === prop.property_id
          const color = ScoreColor(prop.overall_score)
          return (
            <div key={prop.property_id} className="glass-card overflow-hidden">
              <div
                className="p-5 cursor-pointer flex items-center gap-4"
                onClick={() => setExpanded(isOpen ? null : prop.property_id)}
              >
                {/* Score circle */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15`, border: `2px solid ${color}50` }}>
                  <span className="text-xl font-bold" style={{ color }}>{prop.overall_score.toFixed(1)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold" style={{ color: '#2c2420' }}>{prop.property_name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>{prop.property_id}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3 mt-2">
                    {[
                      { label: 'Guest Satisfaction', val: prop.guest_satisfaction },
                      { label: 'Cleaner Reliability', val: prop.cleaner_reliability },
                      { label: 'Maintenance Index', val: prop.maintenance_index },
                      { label: 'Revenue Perf', val: prop.revenue_performance },
                      { label: 'Complaint Rate', val: (1 - prop.complaint_rate) * 10 },
                    ].map((m, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs" style={{ color: '#8c7b6e' }}>{m.label}</span>
                          <span className="text-xs font-medium" style={{ color: ScoreColor(m.val) }}>{m.val.toFixed(1)}</span>
                        </div>
                        <ScoreBar value={m.val} color={ScoreColor(m.val)} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isOpen ? <ChevronUp size={16} style={{ color: '#a89585' }} /> : <ChevronDown size={16} style={{ color: '#a89585' }} />}
                </div>
              </div>

              {isOpen && (
                <div className="border-t px-5 pb-5 pt-4 space-y-4" style={{ borderColor: '#e8e0d4' }}>
                  <div className="p-3 rounded-lg text-sm" style={{ background: '#f0ebe1', border: '1px solid #ddd5c4', color: '#4a3f38' }}>
                    {prop.explanation}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#8b3a3a' }}>
                        <AlertCircle size={11} /> ISSUES DETECTED
                      </div>
                      <div className="space-y-1.5">
                        {prop.issues.length > 0 ? prop.issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#8b3a3a' }} />
                            <span style={{ color: '#4a3f38' }}>{issue}</span>
                          </div>
                        )) : <span className="text-sm" style={{ color: '#8c7b6e' }}>No critical issues detected</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#4a7c59' }}>
                        <CheckCircle2 size={11} /> RECOMMENDATIONS
                      </div>
                      <div className="space-y-1.5">
                        {prop.recommendations.length > 0 ? prop.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#4a7c59' }} />
                            <span style={{ color: '#4a3f38' }}>{rec}</span>
                          </div>
                        )) : <span className="text-sm" style={{ color: '#8c7b6e' }}>Property performing well</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
