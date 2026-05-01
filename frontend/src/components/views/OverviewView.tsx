'use client'
import { Brain, Zap, TrendingUp, AlertTriangle, CheckCircle2, Clock, DollarSign, Star } from 'lucide-react'

const STATS = [
  { label: 'Messages Handled', value: '80%', sub: 'autonomously', color: '#4a7c59', icon: Brain },
  { label: 'Active Escalations', value: '3', sub: 'require human', color: '#8b3a3a', icon: AlertTriangle },
  { label: 'Avg Response Time', value: '8 min', sub: 'vs 4hr industry avg', color: '#3a5f8b', icon: Clock },
  { label: 'Portfolio Revenue', value: '₹1.74L', sub: 'this weekend (AI-optimized)', color: '#8b6914', icon: DollarSign },
  { label: 'Ops Health Score', value: '8.1', sub: 'across 5 properties', color: '#5e4a8b', icon: Star },
  { label: 'Issues Auto-Resolved', value: '12', sub: 'last 7 days', color: '#4a7c59', icon: CheckCircle2 },
]

const RECENT_DECISIONS = [
  { time: '2 min ago', action: '₹1,200 partial refund issued', property: 'PROP-001', type: 'refund', color: '#8b6914' },
  { time: '8 min ago', action: 'Emergency cleaner dispatched', property: 'PROP-002', type: 'ops', color: '#7a4a1e' },
  { time: '15 min ago', action: 'Escalation triggered → Host notified', property: 'PROP-002', type: 'escalate', color: '#8b3a3a' },
  { time: '22 min ago', action: 'WiFi guide auto-sent to guest', property: 'PROP-004', type: 'reply', color: '#4a7c59' },
  { time: '35 min ago', action: 'Late checkout approved + ₹0 cost', property: 'PROP-005', type: 'reply', color: '#4a7c59' },
  { time: '1 hr ago', action: 'Listing repriced +180% for NYE', property: 'ALL', type: 'pricing', color: '#3a5f8b' },
]

const SYSTEM_STATUS = [
  { module: 'Autonomous Inbox', status: 'live', color: '#4a7c59' },
  { module: 'Decision Engine', status: 'live', color: '#4a7c59' },
  { module: 'Digital Twin', status: 'live', color: '#4a7c59' },
  { module: 'Memory Graph', status: 'live', color: '#4a7c59' },
  { module: 'Maintenance Predictor', status: 'live', color: '#4a7c59' },
  { module: 'Demand Engine', status: 'live', color: '#4a7c59' },
  { module: 'Complaint Miner', status: 'live', color: '#4a7c59' },
  { module: 'AI Auditor', status: 'live', color: '#4a7c59' },
]

export default function OverviewView() {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl" style={{ color: '#2c2420' }}>Command Center</h1>
          <p style={{ color: '#8c7b6e' }} className="text-sm mt-1">
            STRIX AI is actively managing your portfolio. Last updated: just now
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(74,124,89,0.08)', border: '1px solid rgba(74,124,89,0.25)' }}>
          <div className="status-dot green"></div>
          <span className="text-sm font-medium" style={{ color: '#4a7c59' }}>AI ACTIVE</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="metric-card">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}12`, border: `1px solid ${s.color}30` }}>
                  <Icon size={17} style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#2c2420' }}>{s.value}</div>
              <div className="text-xs mt-1 font-medium" style={{ color: s.color }}>{s.sub}</div>
              <div className="text-sm mt-0.5" style={{ color: '#8c7b6e' }}>{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent decisions */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={15} style={{ color: '#8b5e3c' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#2c2420' }}>Recent AI Decisions</h3>
          </div>
          <div className="space-y-3">
            {RECENT_DECISIONS.map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: d.color }}></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm" style={{ color: '#2c2420' }}>{d.action}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs" style={{ color: '#8c7b6e' }}>{d.time}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${d.color}12`, color: d.color, border: `1px solid ${d.color}25` }}>{d.property}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System status */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} style={{ color: '#8b5e3c' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#2c2420' }}>System Status</h3>
          </div>
          <div className="space-y-2.5">
            {SYSTEM_STATUS.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: '#e8e0d4' }}>
                <span className="text-sm" style={{ color: '#4a3f38' }}>{s.module}</span>
                <div className="flex items-center gap-1.5">
                  <div className="status-dot green"></div>
                  <span className="text-xs font-semibold uppercase" style={{ color: '#4a7c59', letterSpacing: '0.4px' }}>live</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(139,94,60,0.06)', border: '1px solid rgba(139,94,60,0.18)' }}>
            <div className="text-xs" style={{ color: '#8b5e3c' }}>
              <span className="font-semibold">STRIX autonomy rate: 80%</span>
              <div style={{ color: '#8c7b6e' }} className="mt-0.5">
                Only 3 messages required human intervention out of 15 processed today.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
