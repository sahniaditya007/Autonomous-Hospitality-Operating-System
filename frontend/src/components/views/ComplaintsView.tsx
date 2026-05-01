'use client'
import { useState, useEffect } from 'react'
import { Zap, RefreshCw, Star, DollarSign } from 'lucide-react'
import { getComplaintPatterns, ComplaintPattern } from '@/lib/api'

export default function ComplaintsView() {
  const [patterns, setPatterns] = useState<ComplaintPattern[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try { setPatterns(await getComplaintPatterns()) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold  flex items-center gap-2">
            <Zap size={22} style={{ color: '#8b3a3a' }} /> Silent Complaint Miner
          </h1>
          <p style={{ color: '#8c7b6e' }} className="text-sm mt-1">Hidden dissatisfaction patterns extracted from reviews</p>
        </div>
        <button className="btn-ghost flex items-center gap-2" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && <div className="p-4 rounded-lg" style={{ background: '#f7eeee', border: '1px solid rgba(139,58,58,0.2)', color: '#8b3a3a' }}>{error}</div>}
      {loading && !patterns.length && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-lg" />)}</div>}

      <div className="space-y-4">
        {patterns.map((p, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{ background: '#f7eeee', color: '#8b3a3a' }}>{i + 1}</div>
                <div>
                  <div className="font-semibold ">{p.pattern}</div>
                  <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: '#8c7b6e' }}>
                    <span>Appears in {p.frequency} reviews</span>
                    <span>·</span>
                    <span>{p.affected_properties.join(', ')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1" style={{ color: '#8b3a3a' }}>
                  <Star size={13} />
                  <span className="text-sm font-bold">{p.star_impact.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,59,92,0.05)', border: '1px solid rgba(255,59,92,0.2)' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: '#8b3a3a' }}>ROOT CAUSE</div>
                <div className="text-sm" style={{ color: '#4a3f38' }}>{p.root_cause}</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(0,229,122,0.05)', border: '1px solid rgba(74,124,89,0.2)' }}>
                <div className="text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: '#4a7c59' }}>
                  <DollarSign size={10} /> FIX
                </div>
                <div className="text-sm" style={{ color: '#4a3f38' }}>{p.fix_description}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#ddd5c4' }}>
              <div className="flex items-center gap-1 text-sm">
                <span style={{ color: '#8c7b6e' }}>Fix cost estimate:</span>
                <span className="font-semibold" style={{ color: '#8b6914' }}>
                  {p.fix_cost_estimate === 0 ? 'Free ✓' : `₹${p.fix_cost_estimate.toLocaleString()}`}
                </span>
              </div>
              <div className="flex gap-1">
                {p.affected_properties.map(prop => (
                  <span key={prop} className="badge badge-accent">{prop}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
