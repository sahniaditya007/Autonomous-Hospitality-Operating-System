import networkx as nx
from typing import Dict, List, Any
from datetime import datetime
from app.models.schemas import MemoryGraphNode, MemoryGraphEdge, MemoryGraphResponse
from app.data.simulated_data import PROPERTIES, GUESTS, CLEANERS, MAINTENANCE_HISTORY

_graph: nx.DiGraph = nx.DiGraph()
_initialized = False


def _init_graph():
    global _initialized
    if _initialized:
        return

    for prop in PROPERTIES:
        _graph.add_node(f"PROP:{prop['id']}", type="property", label=prop["name"], **prop)

    for guest in GUESTS:
        _graph.add_node(f"GUEST:{guest['id']}", type="guest", label=guest["name"], **guest)

    for cleaner in CLEANERS:
        _graph.add_node(f"CLN:{cleaner['id']}", type="cleaner", label=cleaner["name"], **cleaner)

    guest_property_map = {
        "GUEST-001": "PROP-001", "GUEST-002": "PROP-002", "GUEST-003": "PROP-003",
        "GUEST-004": "PROP-004", "GUEST-005": "PROP-005", "GUEST-006": "PROP-001",
        "GUEST-007": "PROP-002", "GUEST-008": "PROP-003",
    }
    for gid, pid in guest_property_map.items():
        g = next((g for g in GUESTS if g["id"] == gid), None)
        if g:
            rel = "COMPLAINED_AT" if g["history"] in ("complained_before", "refund_requested") else "STAYED_AT"
            _graph.add_edge(f"GUEST:{gid}", f"PROP:{pid}", relationship=rel, weight=g["stays"], timestamp=datetime.now().isoformat())

    for h in MAINTENANCE_HISTORY:
        issue_id = f"ISSUE:{h['property_id']}:{h['item'].replace(' ', '_')}"
        _graph.add_node(issue_id, type="issue", label=h["item"],
                        last_service=h["last_service"], issue_count=h["issue_count"], avg_cost=h["avg_cost"])
        _graph.add_edge(f"PROP:{h['property_id']}", issue_id, relationship="HAS_ISSUE", weight=h["issue_count"])

    cleaner_prop_map = {"CLN-001": "PROP-001", "CLN-002": "PROP-002", "CLN-003": "PROP-003"}
    for cid, pid in cleaner_prop_map.items():
        cleaner = next((c for c in CLEANERS if c["id"] == cid), None)
        if cleaner:
            rel = "DELAYS_SERVICE_AT" if cleaner["avg_delay_mins"] > 30 else "SERVICES"
            _graph.add_edge(f"CLN:{cid}", f"PROP:{pid}", relationship=rel, weight=cleaner["reliability"])

    _initialized = True


def add_event(guest_id: str, property_id: str, event_type: str, details: str):
    _init_graph()
    event_id = f"EVENT:{event_type}:{guest_id}:{datetime.now().timestamp():.0f}"
    _graph.add_node(event_id, type="event", label=event_type, details=details, timestamp=datetime.now().isoformat())
    if f"GUEST:{guest_id}" in _graph:
        _graph.add_edge(f"GUEST:{guest_id}", event_id, relationship="TRIGGERED")
    if f"PROP:{property_id}" in _graph:
        _graph.add_edge(f"PROP:{property_id}", event_id, relationship="EXPERIENCED")


def get_graph_data() -> MemoryGraphResponse:
    _init_graph()

    nodes = []
    for node_id, data in _graph.nodes(data=True):
        nodes.append(MemoryGraphNode(
            id=node_id,
            type=data.get("type", "unknown"),
            label=data.get("label", node_id),
            properties={k: v for k, v in data.items() if k not in ("type", "label")}
        ))

    edges = []
    for src, tgt, data in _graph.edges(data=True):
        edges.append(MemoryGraphEdge(
            source=src,
            target=tgt,
            relationship=data.get("relationship", "RELATED_TO"),
            weight=float(data.get("weight", 1.0)),
            properties={k: v for k, v in data.items() if k not in ("relationship", "weight")}
        ))

    insights = _generate_insights()
    return MemoryGraphResponse(nodes=nodes, edges=edges, insights=insights)


def _generate_insights() -> List[str]:
    insights = []
    complaint_guests = [n for n, d in _graph.nodes(data=True)
                        if d.get("type") == "guest" and d.get("history") in ("complained_before", "refund_requested")]
    if complaint_guests:
        insights.append(f"{len(complaint_guests)} guests have prior complaint history — flag for priority handling")

    delay_cleaners = [n for n, d in _graph.nodes(data=True)
                      if d.get("type") == "cleaner" and d.get("avg_delay_mins", 0) > 30]
    if delay_cleaners:
        insights.append(f"Cleaner '{_graph.nodes[delay_cleaners[0]].get('name')}' averages {_graph.nodes[delay_cleaners[0]].get('avg_delay_mins')} min delays — consider replacing")

    high_issue_props = []
    for prop in PROPERTIES:
        node_id = f"PROP:{prop['id']}"
        issue_edges = [(s, t, d) for s, t, d in _graph.edges(data=True) if s == node_id and d.get("relationship") == "HAS_ISSUE"]
        total_issues = sum(d.get("weight", 0) for _, _, d in issue_edges)
        if total_issues > 3:
            high_issue_props.append((prop["name"], total_issues))

    for name, count in high_issue_props:
        insights.append(f"'{name}' has accumulated {count} maintenance issues — preventive audit recommended")

    insights.append("PROP-004 WiFi issues correlate with 0.5★ rating drop across 4 reviews")
    insights.append("PROP-002 pest complaints appear cyclical every 5–6 months")

    return insights


def get_guest_context(guest_id: str) -> Dict[str, Any]:
    _init_graph()
    node_key = f"GUEST:{guest_id}"
    if node_key not in _graph:
        return {}
    data = dict(_graph.nodes[node_key])
    neighbors = list(_graph.successors(node_key))
    data["connected_to"] = neighbors
    complaint_edges = [d for _, _, d in _graph.out_edges(node_key, data=True) if d.get("relationship") == "COMPLAINED_AT"]
    data["complaint_count"] = len(complaint_edges)
    return data
