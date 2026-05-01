'use client'
import { useState, useEffect } from 'react'
import { FileText, RefreshCw, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getDebriefs, StayDebrief } from '@/lib/api'

const SENTIMENT_ICON = (s: string) => {
  if (s === 'positive') return <TrendingUp size={12} style={{ color: '#4a7c59' }} />
  if (s === 'negative') return <TrendingDown size={12} style={{ color: '#8b3a3a' }} />
  return <Minus size={12} style={{ color: '#8c7b6e' }} />
}
const SENTIMENT_COLOR = (s: string) => s === 'positive' ? '#4a7c59' : s === 'negative' ? '#8b3a3a' : '#8c7b6e'

export default function DebriefView() {
  const [debriefs, setDebriefs] = useState<StayDebrief[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<StayDebrief | null>(null)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getDebriefs()
      setDebriefs(data)
      if (data.length > 0) setSelected(data[0])
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const starColor = (s: number) => s >= 4 ? '#4a7c59' : s >= 3 ? '#8b6914' : '#8b3a3a'

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold  flex items-center gap-2">
            <FileText size={22} style={{ color: '#7a4a1e' }} /> Stay Debrief Agent
          </h1>
          <p style={{ color: '#8c7b6e' }} className="text-sm mt-1">Post-checkout AI analysis — hidden insights from every stay</p>
        </div>
        <button className="btn-ghost flex items-center gap-2" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && <div className="p-4 rounded-lg" style={{ background: '#f7eeee', border: '1px solid rgba(139,58,58,0.2)', color: '#8b3a3a' }}>{error}</div>}
      {loading && !debriefs.length && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-lg" />)}</div>}

      <div className="grid grid-cols-3 gap-6">
        {/* List */}
        <div className="space-y-2">
          {debriefs.map(d => (
            <div
              key={d.booking_id}
              onClick={() => setSelected(d)}
              className="glass-card p-4 cursor-pointer transition-all"
              style={{ borderLeft: selected?.booking_id === d.booking_id ? '3px solid #ff7a3b' : '3px solid transparent' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium  text-sm">{d.guest_name}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#8c7b6e' }}>{d.property_id}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#a89585' }}>{d.check_in} → {d.check_out}</div>
                </div>
                <div className="flex items-center gap-1" style={{ color: starColor(d.star_prediction) }}>
                  <Star size={12} fill="currentColor" />
                  <span className="text-sm font-bold">{d.star_prediction.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="col-span-2">
          {selected ? (
            <div className="space-y-4">
              <div className="glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-lg font-bold ">{selected.guest_name}</div>
                    <div className="text-sm" style={{ color: '#8c7b6e' }}>{selected.booking_id} · {selected.property_id}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end" style={{ color: starColor(selected.star_prediction) }}>
                      <Star size={16} fill="currentColor" />
                      <span className="text-xl font-bold">{selected.star_prediction.toFixed(1)}</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#8c7b6e' }}>predicted rating</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg text-sm" style={{ background: '#ede8df', color: '#4a3f38' }}>
                  {selected.summary}
                </div>
              </div>

              {/* Sentiment arc */}
              {selected.sentiment_arc.length > 0 && (
                <div className="glass-card p-5">
                  <div className="text-xs font-semibold mb-3" style={{ color: '#8c7b6e' }}>SENTIMENT ARC</div>
                  <div className="flex gap-3">
                    {selected.sentiment_arc.map((arc, i) => (
                      <div key={i} className="flex-1 p-3 rounded-lg text-center" style={{ background: `${SENTIMENT_COLOR(arc.sentiment)}10`, border: `1px solid ${SENTIMENT_COLOR(arc.sentiment)}30` }}>
                        <div className="flex justify-center mb-1">{SENTIMENT_ICON(arc.sentiment)}</div>
                        <div className="text-xs font-medium capitalize" style={{ color: SENTIMENT_COLOR(arc.sentiment) }}>{arc.phase}</div>
                        <div className="text-xs mt-1" style={{ color: '#8c7b6e' }}>{arc.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Hidden insights */}
                <div className="glass-card p-4">
                  <div className="text-xs font-semibold mb-2" style={{ color: '#8b6914' }}>💡 HIDDEN INSIGHTS</div>
                  <div className="space-y-2">
                    {selected.hidden_insights.length > 0 ? selected.hidden_insights.map((ins, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#8b6914' }} />
                        <span style={{ color: '#4a3f38' }}>{ins}</span>
                      </div>
                    )) : <div className="text-sm" style={{ color: '#8c7b6e' }}>No hidden insights detected</div>}
                  </div>
                </div>

                {/* Actions */}
                <div className="glass-card p-4">
                  <div className="text-xs font-semibold mb-2" style={{ color: '#4a7c59' }}>✅ RECOMMENDED ACTIONS</div>
                  <div className="space-y-2">
                    {selected.recommended_actions.length > 0 ? selected.recommended_actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#4a7c59' }} />
                        <span style={{ color: '#4a3f38' }}>{action}</span>
                      </div>
                    )) : <div className="text-sm" style={{ color: '#8c7b6e' }}>No actions needed</div>}
                  </div>
                </div>
              </div>

              {/* Issues + Cleaner */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <div className="text-xs font-semibold mb-2" style={{ color: '#8b3a3a' }}>⚠️ ISSUES RAISED</div>
                  {selected.issues_raised.length > 0 ? selected.issues_raised.map((issue, i) => (
                    <div key={i} className="text-sm mb-1" style={{ color: '#4a3f38' }}>• {issue}</div>
                  )) : <div className="text-sm" style={{ color: '#8c7b6e' }}>No issues raised</div>}
                </div>
                <div className="glass-card p-4">
                  <div className="text-xs font-semibold mb-2" style={{ color: '#3a5f8b' }}>🧹 CLEANER PERFORMANCE</div>
                  <div className="text-sm" style={{ color: '#4a3f38' }}>{selected.cleaner_performance}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card h-64 flex items-center justify-center">
              <div className="text-center">
                <FileText size={32} style={{ color: '#ddd5c4', margin: '0 auto 12px' }} />
                <div className="text-sm" style={{ color: '#8c7b6e' }}>Select a stay to view debrief</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
