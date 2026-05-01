'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import OverviewView from '@/components/views/OverviewView'
import InboxView from '@/components/views/InboxView'
import SimulationView from '@/components/views/SimulationView'
import HealthView from '@/components/views/HealthView'
import MemoryView from '@/components/views/MemoryView'
import DebriefView from '@/components/views/DebriefView'
import MaintenanceView from '@/components/views/MaintenanceView'
import AuditorView from '@/components/views/AuditorView'
import ListingView from '@/components/views/ListingView'
import DemandView from '@/components/views/DemandView'
import ComplaintsView from '@/components/views/ComplaintsView'

const VIEWS: Record<string, React.ComponentType> = {
  overview: OverviewView,
  inbox: InboxView,
  simulation: SimulationView,
  health: HealthView,
  memory: MemoryView,
  debrief: DebriefView,
  maintenance: MaintenanceView,
  auditor: AuditorView,
  listing: ListingView,
  demand: DemandView,
  complaints: ComplaintsView,
}

export default function Home() {
  const [activeView, setActiveView] = useState('overview')
  const ActiveComponent = VIEWS[activeView] || OverviewView

  return (
    <div className="flex min-h-screen" style={{ background: '#f5f0e8' }}>
      <Sidebar active={activeView} onChange={setActiveView} />
      <main className="flex-1 overflow-y-auto p-8" style={{ maxHeight: '100vh' }}>
        <ActiveComponent />
      </main>
    </div>
  )
}
