'use client'
import { useState } from 'react'
import {
  Brain, Inbox, Activity, Building2, Wrench, TrendingUp,
  MessageSquareWarning, Zap, FileText, Bot, BarChart3, ChevronRight
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview', label: 'Command Center', icon: Brain, color: '#8b5e3c' },
  { id: 'inbox', label: 'AI Inbox', icon: Inbox, color: '#4a7c59' },
  { id: 'simulation', label: 'Digital Twin', icon: Activity, color: '#5e4a8b' },
  { id: 'health', label: 'Property Health', icon: Building2, color: '#8b6914' },
  { id: 'memory', label: 'Memory Graph', icon: Bot, color: '#3a5f8b' },
  { id: 'debrief', label: 'Stay Debrief', icon: FileText, color: '#7a4a1e' },
  { id: 'maintenance', label: 'Maintenance AI', icon: Wrench, color: '#8b3a3a' },
  { id: 'auditor', label: 'AI Auditor', icon: MessageSquareWarning, color: '#5e4a8b' },
  { id: 'listing', label: 'Listing Optimizer', icon: BarChart3, color: '#4a7c59' },
  { id: 'demand', label: 'Demand Spiker', icon: TrendingUp, color: '#8b6914' },
  { id: 'complaints', label: 'Complaint Miner', icon: Zap, color: '#8b3a3a' },
]

interface SidebarProps {
  active: string
  onChange: (id: string) => void
}

const ACTIVE_BG: Record<string, string> = {
  '#8b5e3c': 'rgba(139,94,60,0.1)',
  '#4a7c59': 'rgba(74,124,89,0.1)',
  '#5e4a8b': 'rgba(94,74,139,0.1)',
  '#8b6914': 'rgba(139,105,20,0.1)',
  '#3a5f8b': 'rgba(58,95,139,0.1)',
  '#7a4a1e': 'rgba(122,74,30,0.1)',
  '#8b3a3a': 'rgba(139,58,58,0.1)',
}

export default function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="w-60 min-h-screen flex flex-col" style={{
      background: '#f0ebe1',
      borderRight: '1px solid #ddd5c4',
    }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid #ddd5c4' }}>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#8b5e3c' }}>
            <Brain size={16} color="#faf7f2" />
          </div>
          <div>
            <div className="font-semibold tracking-tight" style={{ color: '#2c2420', fontFamily: "'DM Serif Display', serif", fontSize: 18 }}>STRIX</div>
            <div className="text-xs" style={{ color: '#8c7b6e' }}>Hospitality OS</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="status-dot green"></div>
          <span className="text-xs" style={{ color: '#4a7c59' }}>All systems live</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const isActive = active === item.id
          const activeBg = ACTIVE_BG[item.color] || 'rgba(139,94,60,0.08)'
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150"
              style={{
                background: isActive ? activeBg : 'transparent',
                border: isActive ? `1px solid rgba(0,0,0,0.07)` : '1px solid transparent',
                color: isActive ? item.color : '#8c7b6e',
              }}
            >
              <Icon size={15} style={{ color: isActive ? item.color : '#a89585', flexShrink: 0 }} />
              <span className="text-sm flex-1" style={{ fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              {isActive && <ChevronRight size={11} style={{ color: item.color, opacity: 0.7 }} />}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid #ddd5c4' }}>
        <div className="text-xs" style={{ color: '#8c7b6e' }}>
          <div className="font-semibold mb-2" style={{ color: '#4a3f38', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Portfolio</div>
          <div className="flex justify-between py-1"><span>Properties</span><span style={{ color: '#8b5e3c', fontWeight: 600 }}>5</span></div>
          <div className="flex justify-between py-1"><span>Active Bookings</span><span style={{ color: '#4a7c59', fontWeight: 600 }}>8</span></div>
          <div className="flex justify-between py-1"><span>Pending Alerts</span><span style={{ color: '#8b3a3a', fontWeight: 600 }}>3</span></div>
        </div>
      </div>
    </aside>
  )
}
