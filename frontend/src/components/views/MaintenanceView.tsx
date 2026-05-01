'use client'
import { useState, useEffect } from 'react'
import { Wrench, RefreshCw, AlertTriangle, Clock } from 'lucide-react'
import { getMaintenance, MaintenancePrediction } from '@/lib/api'

const PRIORITY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  CRITICAL: { color: '#8b3a3a', bg: '#f7eeee', border: 'rgba(139,58,58,0.2)' },
  HIGH: { color: '#7a4a1e', bg: 'rgba(255,122,59,0.1)', border: 'rgba(255,122,59,0.3)' },
  MEDIUM: { color: '#8b6914', bg: 'rgba(255,209,102,0.1)', border: 'rgba(255,209,102,0.3)' },
  LOW: { color: '#4a7c59', bg: '#edf4ef', border: 'rgba(74,124,89,0.25)' },
}

export default function MaintenanceView() {
  const [items, setItems] = useState<MaintenancePrediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try { setItems(await getMaintenance()) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold  flex items-center gap-2">
            <Wrench size={22} style={{ color: '#8b3a3a' }} /> Maintenance Time Machine
          </h1>
          <p style={{ color: '#8c7b6e' }} className="text-sm mt-1">AI predicts failures before they happen</p>
        </div>
        <button className="btn-ghost flex items-center gap-2" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && <div className="p-4 rounded-lg" style={{ background: '#f7eeee', border: '1px solid rgba(139,58,58,0.2)', color: '#8b3a3a' }}>{error}</div>}

      {loading && !items.length && <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-lg" />)}</div>}

      <div className="space-y-3">
        {items.map((item, i) => {
          const p = PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.LOW
          const pct = Math.round(item.failure_probability * 100)
          return (
            <div key={i} className="glass-card p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: p.bg, border: `2px solid ${p.border}` }}>
                  <span className="text-sm font-bold" style={{ color: p.color }}>{pct}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className=" font-semibold">{item.item}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#8c7b6e' }}>{item.property_id} · Last serviced: {item.last_service}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="badge" style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>{item.priority}</span>
                    </div>
                  </div>

                  <div className="progress-bar mb-2">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: p.color }} />
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="p-2.5 rounded-lg" style={{ background: '#f0ebe1' }}>
                      <div className="text-xs mb-1" style={{ color: '#8c7b6e' }}>Failure Risk</div>
                      <div className="font-bold" style={{ color: p.color }}>{pct}%</div>
                    </div>
                    <div className="p-2.5 rounded-lg" style={{ background: '#f0ebe1' }}>
                      <div className="text-xs mb-1 flex items-center gap-1" style={{ color: '#8c7b6e' }}><Clock size={10} /> Est. Weeks Left</div>
                      <div className="font-bold ">{item.estimated_weeks_to_failure}w</div>
                    </div>
                    <div className="p-2.5 rounded-lg" style={{ background: '#f0ebe1' }}>
                      <div className="text-xs mb-1" style={{ color: '#8c7b6e' }}>Repair Cost Est.</div>
                      <div className="font-bold" style={{ color: '#8b6914' }}>₹{item.cost_estimate.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-lg text-sm flex items-start gap-2" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', color: '#4a3f38' }}>
                    <AlertTriangle size={13} style={{ color: '#3a5f8b', flexShrink: 0, marginTop: 1 }} />
                    {item.reasoning}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
