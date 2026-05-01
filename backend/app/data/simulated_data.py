from datetime import datetime, timedelta

PROPERTIES = [
    {"id": "PROP-001", "name": "Marina Bay Suite", "location": "Mumbai", "type": "Luxury Apartment", "bedrooms": 2, "base_price": 4500},
    {"id": "PROP-002", "name": "Bandra Studio Loft", "location": "Mumbai", "type": "Studio", "bedrooms": 1, "base_price": 2800},
    {"id": "PROP-003", "name": "Colaba Heritage Home", "location": "Mumbai", "type": "Heritage Villa", "bedrooms": 3, "base_price": 7200},
    {"id": "PROP-004", "name": "Koramangala Workspace", "location": "Bengaluru", "type": "Work-friendly Apartment", "bedrooms": 1, "base_price": 2200},
    {"id": "PROP-005", "name": "Indiranagar Penthouse", "location": "Bengaluru", "type": "Penthouse", "bedrooms": 3, "base_price": 8500},
]

GUESTS = [
    {"id": "GUEST-001", "name": "Arjun Mehta", "history": "complained_before", "stays": 3, "avg_rating_given": 3.5},
    {"id": "GUEST-002", "name": "Priya Sharma", "history": "loyal", "stays": 8, "avg_rating_given": 4.8},
    {"id": "GUEST-003", "name": "Raj Kapoor", "history": "new", "stays": 1, "avg_rating_given": None},
    {"id": "GUEST-004", "name": "Sunita Rao", "history": "refund_requested", "stays": 2, "avg_rating_given": 2.1},
    {"id": "GUEST-005", "name": "Vikram Singh", "history": "new", "stays": 1, "avg_rating_given": None},
    {"id": "GUEST-006", "name": "Meera Nair", "history": "loyal", "stays": 5, "avg_rating_given": 4.6},
    {"id": "GUEST-007", "name": "Deepak Joshi", "history": "complained_before", "stays": 4, "avg_rating_given": 3.2},
    {"id": "GUEST-008", "name": "Ananya Patel", "history": "new", "stays": 1, "avg_rating_given": None},
]

CLEANERS = [
    {"id": "CLN-001", "name": "Ramesh Services", "reliability": 0.95, "avg_delay_mins": 5},
    {"id": "CLN-002", "name": "Sunita Cleaners", "reliability": 0.72, "avg_delay_mins": 45},
    {"id": "CLN-003", "name": "QuickClean Pro", "reliability": 0.88, "avg_delay_mins": 15},
]

SIMULATED_INBOX = [
    {
        "id": "MSG-001", "guest_id": "GUEST-001", "guest_name": "Arjun Mehta",
        "property_id": "PROP-001", "channel": "airbnb", "booking_id": "BK-2341",
        "content": "The AC is not working and it's extremely hot. This is unacceptable! I need this fixed immediately or I want a full refund. This is the second time I'm having issues with your property.",
        "timestamp": (datetime.now() - timedelta(hours=2)).isoformat()
    },
    {
        "id": "MSG-002", "guest_id": "GUEST-002", "guest_name": "Priya Sharma",
        "property_id": "PROP-002", "channel": "whatsapp", "booking_id": "BK-2342",
        "content": "Hi! Just wanted to confirm my check-in time tomorrow. I'll be arriving around 3 PM. Is that okay?",
        "timestamp": (datetime.now() - timedelta(hours=1, minutes=30)).isoformat()
    },
    {
        "id": "MSG-003", "guest_id": "GUEST-003", "guest_name": "Raj Kapoor",
        "property_id": "PROP-003", "channel": "email", "booking_id": "BK-2343",
        "content": "Hello, where exactly is the parking? I couldn't find it in the listing. Also, is there a gym nearby?",
        "timestamp": (datetime.now() - timedelta(hours=1)).isoformat()
    },
    {
        "id": "MSG-004", "guest_id": "GUEST-004", "guest_name": "Sunita Rao",
        "property_id": "PROP-004", "channel": "airbnb", "booking_id": "BK-2344",
        "content": "The WiFi password you gave me is not working. I have an urgent work meeting in 30 minutes and I cannot connect. Please help ASAP!!!",
        "timestamp": (datetime.now() - timedelta(minutes=45)).isoformat()
    },
    {
        "id": "MSG-005", "guest_id": "GUEST-005", "guest_name": "Vikram Singh",
        "property_id": "PROP-005", "channel": "whatsapp", "booking_id": "BK-2345",
        "content": "Can I check out at 1 PM instead of 11 AM? We're having such a great time here!",
        "timestamp": (datetime.now() - timedelta(minutes=40)).isoformat()
    },
    {
        "id": "MSG-006", "guest_id": "GUEST-006", "guest_name": "Meera Nair",
        "property_id": "PROP-001", "channel": "airbnb", "booking_id": "BK-2346",
        "content": "Just checked in and everything is perfect! The view is absolutely stunning. Thank you so much!",
        "timestamp": (datetime.now() - timedelta(minutes=35)).isoformat()
    },
    {
        "id": "MSG-007", "guest_id": "GUEST-007", "guest_name": "Deepak Joshi",
        "property_id": "PROP-002", "channel": "email", "booking_id": "BK-2347",
        "content": "There are cockroaches in the kitchen. I found two this morning. This is absolutely disgusting and I'm considering leaving early. I demand compensation.",
        "timestamp": (datetime.now() - timedelta(minutes=30)).isoformat()
    },
    {
        "id": "MSG-008", "guest_id": "GUEST-008", "guest_name": "Ananya Patel",
        "property_id": "PROP-003", "channel": "whatsapp", "booking_id": "BK-2348",
        "content": "Hi! What's the WiFi password please?",
        "timestamp": (datetime.now() - timedelta(minutes=25)).isoformat()
    },
    {
        "id": "MSG-009", "guest_id": "GUEST-001", "guest_name": "Arjun Mehta",
        "property_id": "PROP-001", "channel": "airbnb", "booking_id": "BK-2341",
        "content": "I've been waiting for 2 hours. Nobody has come to fix the AC. I'm calling Airbnb support right now if I don't hear back in 10 minutes.",
        "timestamp": (datetime.now() - timedelta(minutes=20)).isoformat()
    },
    {
        "id": "MSG-010", "guest_id": "GUEST-003", "guest_name": "Raj Kapoor",
        "property_id": "PROP-003", "channel": "email", "booking_id": "BK-2343",
        "content": "Also, do you have an iron and ironing board? I have a business meeting tomorrow.",
        "timestamp": (datetime.now() - timedelta(minutes=18)).isoformat()
    },
    {
        "id": "MSG-011", "guest_id": "GUEST-005", "guest_name": "Vikram Singh",
        "property_id": "PROP-005", "channel": "whatsapp", "booking_id": "BK-2345",
        "content": "Also wanted to ask - can we have 2 extra guests join for dinner tonight? They won't be staying overnight.",
        "timestamp": (datetime.now() - timedelta(minutes=15)).isoformat()
    },
    {
        "id": "MSG-012", "guest_id": "GUEST-004", "guest_name": "Sunita Rao",
        "property_id": "PROP-004", "channel": "airbnb", "booking_id": "BK-2344",
        "content": "STILL no WiFi. My meeting already started without me. I need a partial refund for this inconvenience. This is completely unprofessional.",
        "timestamp": (datetime.now() - timedelta(minutes=10)).isoformat()
    },
    {
        "id": "MSG-013", "guest_id": "GUEST-002", "guest_name": "Priya Sharma",
        "property_id": "PROP-002", "channel": "whatsapp", "booking_id": "BK-2342",
        "content": "Great! Also, is there a good restaurant nearby you'd recommend?",
        "timestamp": (datetime.now() - timedelta(minutes=8)).isoformat()
    },
    {
        "id": "MSG-014", "guest_id": "GUEST-006", "guest_name": "Meera Nair",
        "property_id": "PROP-001", "channel": "airbnb", "booking_id": "BK-2346",
        "content": "One small thing - the hot water in the shower takes about 5 minutes to heat up. Not a big deal but worth knowing!",
        "timestamp": (datetime.now() - timedelta(minutes=5)).isoformat()
    },
    {
        "id": "MSG-015", "guest_id": "GUEST-007", "guest_name": "Deepak Joshi",
        "property_id": "PROP-002", "channel": "email", "booking_id": "BK-2347",
        "content": "I have documented this with photos. If I don't receive ₹2000 refund by end of day, I will post this review publicly.",
        "timestamp": (datetime.now() - timedelta(minutes=2)).isoformat()
    },
]

PROPERTY_REVIEWS = {
    "PROP-001": [
        {"text": "Great view but AC was inconsistent", "stars": 3.5},
        {"text": "Beautiful property, hot water took time", "stars": 4.0},
        {"text": "Amazing stay! Would come back", "stars": 5.0},
        {"text": "AC broke down for half a day, management was slow to respond", "stars": 2.5},
        {"text": "Perfect location, minor maintenance issues", "stars": 4.0},
    ],
    "PROP-002": [
        {"text": "Good location but had pest issues", "stars": 2.0},
        {"text": "Cozy studio, WiFi was great", "stars": 4.5},
        {"text": "Cockroach sighting in kitchen, not acceptable", "stars": 1.5},
        {"text": "Nice vibe but cleanliness could improve", "stars": 3.5},
        {"text": "Loved the ambiance, had some kitchen issues", "stars": 3.8},
    ],
    "PROP-003": [
        {"text": "Stunning heritage property, loved it", "stars": 5.0},
        {"text": "Parking instructions not clear", "stars": 3.5},
        {"text": "Beautiful but no clear house manual", "stars": 4.0},
        {"text": "Perfect for families, very spacious", "stars": 4.8},
    ],
    "PROP-004": [
        {"text": "WiFi dropped multiple times during work calls", "stars": 3.0},
        {"text": "Great for remote work except WiFi reliability", "stars": 3.5},
        {"text": "Decent place, WiFi issues on upper floors", "stars": 3.2},
        {"text": "Good location, internet was spotty", "stars": 3.8},
    ],
    "PROP-005": [
        {"text": "Incredible penthouse, worth every rupee", "stars": 5.0},
        {"text": "Stunning views, impeccable service", "stars": 4.9},
        {"text": "Best stay ever, will recommend", "stars": 5.0},
    ],
}

MAINTENANCE_HISTORY = [
    {"property_id": "PROP-001", "item": "Air Conditioning Unit", "last_service": "8 months ago", "issue_count": 4, "avg_cost": 3500},
    {"property_id": "PROP-001", "item": "Water Heater", "last_service": "14 months ago", "issue_count": 2, "avg_cost": 2000},
    {"property_id": "PROP-002", "item": "Pest Control", "last_service": "6 months ago", "issue_count": 3, "avg_cost": 1500},
    {"property_id": "PROP-002", "item": "Kitchen Plumbing", "last_service": "3 months ago", "issue_count": 1, "avg_cost": 800},
    {"property_id": "PROP-003", "item": "Electrical Wiring", "last_service": "18 months ago", "issue_count": 1, "avg_cost": 5000},
    {"property_id": "PROP-004", "item": "WiFi Router/Mesh", "last_service": "2 months ago", "issue_count": 6, "avg_cost": 300},
    {"property_id": "PROP-005", "item": "Elevator", "last_service": "1 month ago", "issue_count": 0, "avg_cost": 0},
    {"property_id": "PROP-005", "item": "Terrace Waterproofing", "last_service": "24 months ago", "issue_count": 0, "avg_cost": 0},
]

DEMAND_EVENTS = [
    {"event_name": "Mumbai Marathon 2025", "date": "2025-01-19", "location": "Mumbai", "type": "Sports", "demand_multiplier": 2.1},
    {"event_name": "Sunburn Festival", "date": "2025-12-27", "location": "Mumbai", "type": "Music Festival", "demand_multiplier": 2.8},
    {"event_name": "Bengaluru Tech Summit", "date": "2025-09-15", "location": "Bengaluru", "type": "Conference", "demand_multiplier": 1.8},
    {"event_name": "New Year's Eve", "date": "2025-12-31", "location": "Pan India", "type": "Holiday", "demand_multiplier": 3.2},
    {"event_name": "IPL Season Opener", "date": "2025-03-22", "location": "Mumbai", "type": "Sports", "demand_multiplier": 1.6},
    {"event_name": "Kala Ghoda Festival", "date": "2025-02-01", "location": "Mumbai", "type": "Cultural", "demand_multiplier": 1.4},
]


def get_simulated_messages() -> list:
    return SIMULATED_INBOX


def get_property_by_id(property_id: str) -> dict:
    return next((p for p in PROPERTIES if p["id"] == property_id), None)


def get_guest_by_id(guest_id: str) -> dict:
    return next((g for g in GUESTS if g["id"] == guest_id), None)
