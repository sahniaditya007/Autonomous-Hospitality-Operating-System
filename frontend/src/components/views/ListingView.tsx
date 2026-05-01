'use client'
import { useState } from 'react'
import { BarChart3, Play, RefreshCw, ArrowRight, TrendingUp } from 'lucide-react'
import { optimizeListing, ListingOptimization } from '@/lib/api'

const PROPERTIES = [
  { id: 'PROP-001', name: 'Marina Bay Suite' },
  { id: 'PROP-002', name: 'Bandra Studio Loft' },
  { id: 'PROP-003', name: 'Colaba Heritage Home' },
  { id: 'PROP-004', name: 'Koramangala Workspace' },
  { id: 'PROP-005', name: 'Indiranagar Penthouse' },
]

export default function ListingView() {
  const [propertyId, setPropertyId] = useState('PROP-001')
  const [result, setResult] = useState<ListingOptimization | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    setLoading(true)
    setError('')
    try { setResult(await optimizeListing(propertyId)) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold  flex items-center gap-2">
          <BarChart3 size={22} style={{ color: '#4a7c59' }} /> Listing Auto-Optimizer
        </h1>
        <p style={{ color: '#8c7b6e' }} className="text-sm mt-1">AI rewrites titles, descriptions, photo order, pricing — direct revenue impact</p>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="text-xs font-medium mb-2 block" style={{ color: '#8c7b6e' }}>SELECT PROPERTY</label>
            <div className="grid grid-cols-5 gap-2">
              {PROPERTIES.map(p => (
                <button key={p.id} onClick={() => setPropertyId(p.id)}
                  className="p-2.5 rounded-lg text-xs font-medium text-center transition-all border"
                  style={{
                    background: propertyId === p.id ? 'rgba(74,124,89,0.1)' : '#f0ebe1',
                    borderColor: propertyId === p.id ? 'rgba(0,229,122,0.5)' : '#ddd5c4',
                    color: propertyId === p.id ? '#4a7c59' : '#8c7b6e',
                  }}>
                  <div className="mb-1">🏠</div>{p.name.split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2 whitespace-nowrap" onClick={run} disabled={loading}>
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
            {loading ? 'Optimizing...' : 'Optimize Listing'}
          </button>
        </div>
      </div>

      {error && <div className="p-4 rounded-lg" style={{ background: '#f7eeee', border: '1px solid rgba(139,58,58,0.2)', color: '#8b3a3a' }}>{error}</div>}

      {loading && (
        <div className="glass-card p-8 text-center">
          <BarChart3 size={36} style={{ color: '#4a7c59', margin: '0 auto 12px' }} className="animate-pulse" />
          <div className=" font-semibold">Analyzing listing and generating optimizations...</div>
          <div className="text-sm mt-1" style={{ color: '#8c7b6e' }}>Reviewing reviews · Competitor analysis · Rewriting copy</div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Lift metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="metric-card flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#edf4ef', border: '2px solid rgba(74,124,89,0.25)' }}>
                <TrendingUp size={22} style={{ color: '#4a7c59' }} />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: '#4a7c59' }}>+{result.projected_ctr_lift.toFixed(0)}%</div>
                <div className="text-sm" style={{ color: '#8c7b6e' }}>Projected CTR Lift</div>
              </div>
            </div>
            <div className="metric-card flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(58,95,139,0.08)', border: '2px solid rgba(0,212,255,0.3)' }}>
                <TrendingUp size={22} style={{ color: '#3a5f8b' }} />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: '#3a5f8b' }}>+{result.projected_conversion_lift.toFixed(0)}%</div>
                <div className="text-sm" style={{ color: '#8c7b6e' }}>Projected Conversion Lift</div>
              </div>
            </div>
          </div>

          {/* Title comparison */}
          <div className="glass-card p-5">
            <div className="text-xs font-semibold mb-3" style={{ color: '#8c7b6e' }}>LISTING TITLE</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,59,92,0.05)', border: '1px solid rgba(255,59,92,0.2)' }}>
                <div className="text-xs font-medium mb-1" style={{ color: '#8b3a3a' }}>CURRENT</div>
                <div className="text-sm ">{result.current_title}</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(0,229,122,0.05)', border: '1px solid rgba(74,124,89,0.2)' }}>
                <div className="text-xs font-medium mb-1" style={{ color: '#4a7c59' }}>OPTIMIZED</div>
                <div className="text-sm  font-medium">{result.optimized_title}</div>
              </div>
            </div>
            {result.ab_test_variant && (
              <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div className="text-xs font-medium mb-1" style={{ color: '#5e4a8b' }}>A/B TEST VARIANT</div>
                <div className="text-sm ">{result.ab_test_variant}</div>
              </div>
            )}
          </div>

          {/* Description comparison */}
          <div className="glass-card p-5">
            <div className="text-xs font-semibold mb-3" style={{ color: '#8c7b6e' }}>LISTING DESCRIPTION</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium mb-2" style={{ color: '#8b3a3a' }}>CURRENT</div>
                <div className="p-3 rounded-lg text-sm" style={{ background: '#ede8df', color: '#8c7b6e' }}>
                  {result.current_description}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: '#4a7c59' }}>
                  OPTIMIZED <ArrowRight size={10} />
                </div>
                <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(0,229,122,0.05)', border: '1px solid rgba(74,124,89,0.2)', color: '#2c2420' }}>
                  {result.optimized_description}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Photo changes */}
            <div className="glass-card p-4">
              <div className="text-xs font-semibold mb-3" style={{ color: '#8b6914' }}>📸 PHOTO ORDER CHANGES</div>
              <div className="space-y-2">
                {result.photo_order_changes.map((change, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold flex-shrink-0" style={{ color: '#8b6914' }}>{i + 1}.</span>
                    <span style={{ color: '#4a3f38' }}>{change}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing suggestions */}
            <div className="glass-card p-4">
              <div className="text-xs font-semibold mb-3" style={{ color: '#3a5f8b' }}>💰 PRICING SUGGESTIONS</div>
              <div className="space-y-2">
                {result.pricing_suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold flex-shrink-0" style={{ color: '#3a5f8b' }}>{i + 1}.</span>
                    <span style={{ color: '#4a3f38' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
