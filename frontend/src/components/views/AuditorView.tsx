'use client'
import { useState } from 'react'
import { MessageSquareWarning, Play, RefreshCw, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react'
import { runFullAudit, AuditorFeedback } from '@/lib/api'

const PROPERTIES = [
  { id: 'PROP-001', name: 'Marina Bay Suite' },
  { id: 'PROP-002', name: 'Bandra Studio Loft' },
  { id: 'PROP-003', name: 'Colaba Heritage Home' },
  { id: 'PROP-004', name: 'Koramangala Workspace' },
  { id: 'PROP-005', name: 'Indiranagar Penthouse' },
]

const PERSONA_EMOJI: Record<string, string> = {
  business_traveler: '💼', couple: '💑', family: '👨‍👩‍👧', digital_nomad: '💻', party_group: '🎉'
}
const PERSONA_LABEL: Record<string, string> = {
  business_traveler: 'Business Traveler', couple: 'Couple', family: 'Family',
  digital_nomad: 'Digital Nomad', party_group: 'Party Group'
}

export default function AuditorView() {
  const [propertyId, setPropertyId] = useState('PROP-001')
  const [results, setResults] = useState<AuditorFeedback[]>([])
  const [selected, setSelected] = useState<AuditorFeedback | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    setLoading(true)
    setError('')
    setSelected(null)
    try {
      const data = await runFullAudit(propertyId)
      setResults(data)
      if (data.length > 0) setSelected(data[0])
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Audit failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold  flex items-center gap-2">
          <MessageSquareWarning size={22} style={{ color: '#5e4a8b' }} /> AI Auditor — "Would I Stay Here?"
        </h1>
        <p style={{ color: '#8c7b6e' }} className="text-sm mt-1">Simulates 5 guest personas — brutal, honest feedback before real guests arrive</p>
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
                    background: propertyId === p.id ? 'rgba(94,74,139,0.1)' : '#f0ebe1',
                    borderColor: propertyId === p.id ? 'rgba(94,74,139,0.4)' : '#ddd5c4',
                    color: propertyId === p.id ? '#5e4a8b' : '#8c7b6e',
                  }}>
                  <div className="mb-1">🏠</div>{p.name.split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2 whitespace-nowrap" onClick={run} disabled={loading}>
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
            {loading ? 'Auditing...' : 'Run Full Audit'}
          </button>
        </div>
      </div>

      {error && <div className="p-4 rounded-lg" style={{ background: '#f7eeee', border: '1px solid rgba(139,58,58,0.2)', color: '#8b3a3a' }}>{error}</div>}

      {loading && (
        <div className="glass-card p-8 text-center">
          <MessageSquareWarning size={36} style={{ color: '#5e4a8b', margin: '0 auto 12px' }} className="animate-pulse" />
          <div className=" font-semibold">Running 5 persona audits...</div>
          <div className="text-sm mt-1" style={{ color: '#8c7b6e' }}>Simulating Business Traveler · Couple · Family · Digital Nomad · Party Group</div>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {/* Persona list */}
          <div className="space-y-2">
            {results.map(r => (
              <div key={r.persona}
                onClick={() => setSelected(r)}
                className="glass-card p-4 cursor-pointer transition-all"
                style={{ borderLeft: selected?.persona === r.persona ? '3px solid #a78bfa' : '3px solid transparent' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{PERSONA_EMOJI[r.persona]}</span>
                    <div>
                      <div className="text-sm font-medium ">{PERSONA_LABEL[r.persona]}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {r.would_book
                          ? <><ThumbsUp size={10} style={{ color: '#4a7c59' }} /><span className="text-xs" style={{ color: '#4a7c59' }}>Would book</span></>
                          : <><ThumbsDown size={10} style={{ color: '#8b3a3a' }} /><span className="text-xs" style={{ color: '#8b3a3a' }}>Would skip</span></>}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold" style={{ color: r.rating >= 7 ? '#4a7c59' : r.rating >= 5 ? '#8b6914' : '#8b3a3a' }}>
                    {r.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="col-span-2">
            {selected && (
              <div className="space-y-4">
                <div className="glass-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{PERSONA_EMOJI[selected.persona]}</span>
                    <div>
                      <div className="text-lg font-bold ">{PERSONA_LABEL[selected.persona]}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="text-2xl font-bold" style={{ color: selected.rating >= 7 ? '#4a7c59' : selected.rating >= 5 ? '#8b6914' : '#8b3a3a' }}>
                          {selected.rating.toFixed(1)}/10
                        </div>
                        {selected.would_book
                          ? <span className="badge badge-green"><ThumbsUp size={10} /> Would Book</span>
                          : <span className="badge badge-red"><ThumbsDown size={10} /> Would Skip</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4">
                    <div className="text-xs font-semibold mb-2" style={{ color: '#8b3a3a' }}>💢 BRUTAL FEEDBACK</div>
                    <div className="space-y-2">
                      {selected.brutal_feedback.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#8b3a3a' }} />
                          <span style={{ color: '#4a3f38' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="text-xs font-semibold mb-2" style={{ color: '#4a7c59' }}>✅ POSITIVES</div>
                    <div className="space-y-2">
                      {selected.positives.map((p, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#4a7c59' }} />
                          <span style={{ color: '#4a3f38' }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selected.deal_breakers.length > 0 && (
                  <div className="glass-card p-4" style={{ borderColor: 'rgba(139,58,58,0.2)' }}>
                    <div className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#8b3a3a' }}>
                      <AlertTriangle size={11} /> DEAL BREAKERS
                    </div>
                    <div className="space-y-1">
                      {selected.deal_breakers.map((db, i) => (
                        <div key={i} className="text-sm" style={{ color: '#4a3f38' }}>• {db}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="glass-card p-4">
                  <div className="text-xs font-semibold mb-2" style={{ color: '#5e4a8b' }}>📝 LISTING SUGGESTIONS</div>
                  <div className="space-y-2">
                    {selected.listing_suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="font-bold flex-shrink-0" style={{ color: '#5e4a8b' }}>{i + 1}.</span>
                        <span style={{ color: '#4a3f38' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
