'use client'
import { useState, useEffect } from 'react'
import { TrendingUp, RefreshCw, Calendar, MapPin } from 'lucide-react'
import { getDemandSpikes, DemandSpike } from '@/lib/api'

export default function DemandView() {
  const [spikes, setSpikes] = useState<DemandSpike[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try { setSpikes(await getDemandSpikes()) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const EVENT_ICONS: Record<string, string> = {
    'Sports': '🏃', 'Music Festival': '🎵', 'Conference': '💼',
    'Holiday': '🎉', 'Cultural': '🎭', 'default': '📅'
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold  flex items-center gap-2">
            <TrendingUp size={22} style={{ color: '#8b6914' }} /> Demand Spiker Engine
          </h1>
          <p style={{ color: '#8c7b6e' }} className="text-sm mt-1">Upcoming events · pricing intelligence · revenue opportunities</p>
        </div>
        <button className="btn-ghost flex items-center gap-2" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && <div className="p-4 rounded-lg" style={{ background: '#f7eeee', border: '1px solid rgba(139,58,58,0.2)', color: '#8b3a3a' }}>{error}</div>}
      {loading && !spikes.length && <div className="grid grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="skeleton h-40 rounded-lg" />)}</div>}

      <div className="grid grid-cols-2 gap-4">
        {spikes.map((spike, i) => {
          const multiplier = spike.demand_multiplier
          const intensity = multiplier >= 3 ? '#8b3a3a' : multiplier >= 2 ? '#7a4a1e' : multiplier >= 1.5 ? '#8b6914' : '#4a7c59'
          const icon = EVENT_ICONS[spike.event_type] || EVENT_ICONS['default']
          return (
            <div key={i} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <div className="font-semibold ">{spike.event_name}</div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#8c7b6e' }}>
                        <Calendar size={10} /> {spike.event_date}
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#8c7b6e' }}>
                        <MapPin size={10} /> {spike.location}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: intensity }}>{spike.demand_multiplier}x</div>
                  <div className="text-xs" style={{ color: '#8c7b6e' }}>demand</div>
                </div>
              </div>

              <div className="progress-bar mb-1">
                <div className="progress-bar-fill" style={{ width: `${Math.min((multiplier / 3.5) * 100, 100)}%`, background: intensity }} />
              </div>
              <div className="text-xs mb-4" style={{ color: '#a89585' }}>{spike.event_type}</div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg text-center" style={{ background: '#ede8df' }}>
                  <div className="text-xs mb-1" style={{ color: '#8c7b6e' }}>Rec. Price</div>
                  <div className="font-bold text-sm" style={{ color: '#4a7c59' }}>₹{spike.recommended_price.toLocaleString()}</div>
                </div>
                <div className="p-2.5 rounded-lg text-center" style={{ background: '#ede8df' }}>
                  <div className="text-xs mb-1" style={{ color: '#8c7b6e' }}>Min Stay</div>
                  <div className="font-bold text-sm ">{spike.recommended_min_stay}N</div>
                </div>
                <div className="p-2.5 rounded-lg text-center" style={{ background: '#ede8df' }}>
                  <div className="text-xs mb-1" style={{ color: '#8c7b6e' }}>Confidence</div>
                  <div className="font-bold text-sm" style={{ color: '#3a5f8b' }}>{Math.round(spike.confidence * 100)}%</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
