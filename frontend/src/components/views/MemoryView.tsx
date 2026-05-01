'use client'
import { useState, useEffect } from 'react'
import { Bot, RefreshCw, Lightbulb } from 'lucide-react'
import { getMemoryGraph, MemoryGraphData } from '@/lib/api'

const NODE_COLORS: Record<string, string> = {
  property: '#3a5f8b',
  guest: '#4a7c59',
  cleaner: '#8b6914',
  issue: '#8b3a3a',
  event: '#5e4a8b',
}

const NODE_EMOJI: Record<string, string> = {
  property: '🏠',
  guest: '👤',
  cleaner: '🧹',
  issue: '⚠️',
  event: '📌',
}

const EDGE_COLORS: Record<string, string> = {
  STAYED_AT: '#4a7c59',
  COMPLAINED_AT: '#8b3a3a',
  HAS_ISSUE: '#7a4a1e',
  SERVICES: '#3a5f8b',
  DELAYS_SERVICE_AT: '#8b6914',
  TRIGGERED: '#5e4a8b',
  EXPERIENCED: '#8c7b6e',
}

export default function MemoryView() {
  const [data, setData] = useState<MemoryGraphData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('all')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const d = await getMemoryGraph()
      setData(d)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load memory graph')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filteredNodes = data?.nodes.filter(n => filter === 'all' || n.type === filter) ?? []
  const nodeTypes = ['all', 'property', 'guest', 'cleaner', 'issue', 'event']

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold  flex items-center gap-2">
            <Bot size={22} style={{ color: '#3a5f8b' }} /> Ops Memory Graph
          </h1>
          <p style={{ color: '#8c7b6e' }} className="text-sm mt-1">
            Your system's long-term intelligence — guests, properties, cleaners, issues, patterns
          </p>
        </div>
        <button className="btn-ghost flex items-center gap-2" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg" style={{ background: '#f7eeee', border: '1px solid rgba(139,58,58,0.2)', color: '#8b3a3a' }}>
          {error}
        </div>
      )}

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-5 gap-3">
          {['property', 'guest', 'cleaner', 'issue', 'event'].map(type => {
            const count = data.nodes.filter(n => n.type === type).length
            return (
              <div key={type} className="metric-card text-center cursor-pointer" onClick={() => setFilter(filter === type ? 'all' : type)}
                style={{ borderColor: filter === type ? `${NODE_COLORS[type]}60` : undefined, background: filter === type ? `${NODE_COLORS[type]}10` : undefined }}>
                <div className="text-2xl mb-1">{NODE_EMOJI[type]}</div>
                <div className="text-xl font-bold" style={{ color: NODE_COLORS[type] }}>{count}</div>
                <div className="text-xs capitalize" style={{ color: '#8c7b6e' }}>{type}s</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Insights */}
      {data && data.insights.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} style={{ color: '#8b6914' }} />
            <span className="font-semibold  text-sm">AI Memory Insights</span>
          </div>
          <div className="space-y-2">
            {data.insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'rgba(255,209,102,0.05)', border: '1px solid rgba(255,209,102,0.15)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5" style={{ background: 'rgba(139,105,20,0.2)', color: '#8b6914' }}>{i + 1}</div>
                <span className="text-sm" style={{ color: '#4a3f38' }}>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Node grid */}
      {loading && !data && (
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-24 rounded-lg" />)}
        </div>
      )}

      {data && (
        <>
          <div className="flex gap-2 flex-wrap">
            {nodeTypes.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize"
                style={{
                  background: filter === t ? `${NODE_COLORS[t] || '#3a5f8b'}18` : 'transparent',
                  color: filter === t ? (NODE_COLORS[t] || '#3a5f8b') : '#8c7b6e',
                  borderColor: filter === t ? `${NODE_COLORS[t] || '#3a5f8b'}50` : '#ddd5c4',
                }}>
                {t === 'all' ? `All (${data.nodes.length})` : `${NODE_EMOJI[t]} ${t}s (${data.nodes.filter(n => n.type === t).length})`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {filteredNodes.map(node => {
              const color = NODE_COLORS[node.type] || '#8c7b6e'
              const edgesFrom = data.edges.filter(e => e.source === node.id || e.target === node.id)
              return (
                <div key={node.id} className="glass-card p-4" style={{ borderLeft: `3px solid ${color}50` }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{NODE_EMOJI[node.type]}</span>
                      <div>
                        <div className="text-sm font-medium ">{node.label}</div>
                        <div className="text-xs" style={{ color }}>{node.type}</div>
                      </div>
                    </div>
                    <div className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${color}18`, color }}>
                      {edgesFrom.length} links
                    </div>
                  </div>
                  {/* Show relationships */}
                  <div className="mt-2 space-y-1">
                    {edgesFrom.slice(0, 3).map((edge, i) => {
                      const relColor = EDGE_COLORS[edge.relationship] || '#8c7b6e'
                      const other = edge.source === node.id ? edge.target : edge.source
                      return (
                        <div key={i} className="flex items-center gap-1.5 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: relColor }}></div>
                          <span style={{ color: relColor }} className="font-medium truncate">{edge.relationship}</span>
                          <span style={{ color: '#a89585' }} className="truncate">→ {other.split(':')[1]}</span>
                        </div>
                      )
                    })}
                    {edgesFrom.length > 3 && <div className="text-xs" style={{ color: '#a89585' }}>+{edgesFrom.length - 3} more links</div>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Edges legend */}
          <div className="glass-card p-4">
            <div className="text-xs font-semibold mb-3" style={{ color: '#8c7b6e' }}>RELATIONSHIP TYPES</div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(EDGE_COLORS).map(([rel, color]) => (
                <div key={rel} className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded" style={{ background: color }}></div>
                  <span className="text-xs" style={{ color: '#8c7b6e' }}>{rel}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
