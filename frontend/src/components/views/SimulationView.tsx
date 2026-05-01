'use client'
import { useState } from 'react'
import { Activity, Play, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, RefreshCw, Zap } from 'lucide-react'
import { runSimulation, SimulationResult, SimulationEvent } from '@/lib/api'

const SCENARIOS = [
  { id: 'cleaner_cancellation', label: '3 Cleaners Cancel', icon: '🧹', color: '#7a4a1e', desc: '3 cleaners drop out same morning' },
  { id: 'demand_spike', label: 'NYE Demand Surge', icon: '🚀', color: '#3a5f8b', desc: '3x demand spike — NYE weekend' },
  { id: 'maintenance_failure', label: 'AC Failure', icon: '❄️', color: '#5e4a8b', desc: 'AC breaks during heatwave' },
  { id: 'multiple_complaints', label: 'Complaint Storm', icon: '⚡', color: '#8b3a3a', desc: 'Weekend complaint cascade' },
  { id: 'overbooking', label: 'Double Booking', icon: '🔴', color: '#8b6914', desc: 'Calendar conflict crisis' },
]

const SEVERITY_STYLES: Record<string, { color: string; bg: string }> = {
  CRITICAL: { color: '#8b3a3a', bg: '#f7eeee' },
  HIGH: { color: '#7a4a1e', bg: '#fef3ec' },
  MEDIUM: { color: '#8b6914', bg: '#fdf5e0' },
  LOW: { color: '#4a7c59', bg: '#edf4ef' },
}

export default function SimulationView() {
  const [scenario, setScenario] = useState('cleaner_cancellation')
  const [intensity, setIntensity] = useState(1.0)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await runSimulation(scenario, intensity)
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Simulation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl flex items-center gap-2" style={{ color: '#2c2420' }}>
          <Activity size={20} style={{ color: '#5e4a8b' }} /> Digital Twin Simulator
        </h1>
        <p style={{ color: '#8c7b6e' }} className="text-sm mt-1">Mirror your operations and simulate failure scenarios</p>
      </div>

      {/* Scenario picker */}
      <div className="glass-card p-5">
        <div className="text-sm font-semibold mb-4" style={{ color: '#2c2420' }}>Select Scenario</div>
        <div className="grid grid-cols-5 gap-3 mb-5">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              className="p-3 rounded-lg text-center transition-all border"
              style={{
                background: scenario === s.id ? `${s.color}12` : '#f0ebe1',
                borderColor: scenario === s.id ? `${s.color}50` : '#ddd5c4',
              }}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xs font-medium" style={{ color: scenario === s.id ? s.color : '#8c7b6e' }}>{s.label}</div>
              <div className="text-xs mt-0.5" style={{ color: '#a89585' }}>{s.desc}</div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-xs" style={{ color: '#8c7b6e' }}>Scenario Intensity</span>
              <span className="text-xs font-medium" style={{ color: '#3a5f8b' }}>{intensity.toFixed(1)}x</span>
            </div>
            <input
              type="range" min="0.5" max="3" step="0.1" value={intensity}
              onChange={e => setIntensity(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #964B00 ${((intensity - 0.5) / 2.5) * 100}%, #ddd5c4 ${((intensity - 0.5) / 2.5) * 100}%)` }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: '#a89585' }}>
              <span>0.5x mild</span><span>1x normal</span><span>3x extreme</span>
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2 whitespace-nowrap" onClick={run} disabled={loading}>
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
            {loading ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg" style={{ background: '#f7eeee', border: '1px solid rgba(139,58,58,0.2)', color: '#8b3a3a' }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(94,74,139,0.08)', border: '2px solid rgba(94,74,139,0.25)' }}>
              <Activity size={32} style={{ color: '#5e4a8b' }} className="animate-pulse" />
            </div>
            <div>
              <div className="font-semibold" style={{ color: '#2c2420' }}>Running digital twin simulation...</div>
              <div className="text-sm mt-1" style={{ color: '#8c7b6e' }}>Modeling events · Calculating impact · Generating AI responses</div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <>
          {/* Metrics row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="metric-card">
              <div className="text-xs mb-1" style={{ color: '#8c7b6e' }}>Scenario</div>
              <div className="text-sm font-semibold" style={{ color: '#2c2420' }}>{result.scenario}</div>
            </div>
            <div className="metric-card">
              <div className="text-xs mb-1" style={{ color: '#8c7b6e' }}>Breakdown Risk</div>
              <div className="text-2xl font-bold" style={{ color: result.breakdown_probability > 0.6 ? '#8b3a3a' : '#8b6914' }}>
                {Math.round(result.breakdown_probability * 100)}%
              </div>
            </div>
            <div className="metric-card">
              <div className="text-xs mb-1" style={{ color: '#8c7b6e' }}>Revenue Impact</div>
              <div className="text-2xl font-bold flex items-center gap-1" style={{ color: result.revenue_impact >= 0 ? '#4a7c59' : '#8b3a3a' }}>
                {result.revenue_impact >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                ₹{Math.abs(result.revenue_impact).toLocaleString()}
              </div>
            </div>
            <div className="metric-card">
              <div className="text-xs mb-2" style={{ color: '#8c7b6e' }}>Ops Score</div>
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xs" style={{ color: '#8b3a3a' }}>Before</div>
                  <div className="font-bold" style={{ color: '#8b3a3a' }}>{result.ops_score_before}</div>
                </div>
                <div style={{ color: '#a89585' }}>→</div>
                <div>
                  <div className="text-xs" style={{ color: '#4a7c59' }}>After AI</div>
                  <div className="font-bold" style={{ color: '#4a7c59' }}>{result.ops_score_after}</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Fix Summary */}
          <div className="p-4 rounded-lg" style={{ background: '#edf4ef', border: '1px solid rgba(74,124,89,0.25)' }}>
            <div className="flex items-start gap-2">
              <Zap size={15} style={{ color: '#4a7c59', marginTop: 2, flexShrink: 0 }} />
              <div>
                <div className="text-xs font-semibold mb-1" style={{ color: '#4a7c59' }}>STRIX AI FIX SUMMARY</div>
                <div className="text-sm" style={{ color: '#4a3f38' }}>{result.ai_fix_summary}</div>
              </div>
            </div>
          </div>

          {/* Event timeline */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b" style={{ borderColor: '#e8e0d4' }}>
              <span className="text-sm font-semibold" style={{ color: '#2c2420' }}>Event Timeline</span>
            </div>
            <div className="divide-y" style={{ borderColor: '#e8e0d4' }}>
              {result.events.map((ev: SimulationEvent, i: number) => {
                const sev = SEVERITY_STYLES[ev.severity] || SEVERITY_STYLES.LOW
                return (
                  <div key={i} className="p-4 flex items-start gap-4">
                    <div className="flex flex-col items-center flex-shrink-0 w-12">
                      <div className="text-xs font-mono font-bold" style={{ color: '#3a5f8b' }}>
                        T+{ev.time_offset_hours.toFixed(1)}h
                      </div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: sev.color }}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="text-sm" style={{ color: '#2c2420' }}>{ev.description}</div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: sev.bg, color: sev.color }}>{ev.severity}</span>
                          {ev.resolved
                            ? <CheckCircle2 size={14} style={{ color: '#00e57a' }} />
                            : <AlertTriangle size={14} style={{ color: '#8b3a3a' }} />}
                        </div>
                      </div>
                      <div className="text-xs p-2 rounded mt-1" style={{ background: '#f0ebe1', color: '#8c7b6e', border: '1px solid #e8e0d4' }}>
                        🤖 {ev.ai_response}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
