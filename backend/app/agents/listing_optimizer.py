from app.models.schemas import ListingOptimization
from app.core.gemini_client import call_gemini_json
from app.data.simulated_data import PROPERTIES, PROPERTY_REVIEWS

CURRENT_LISTINGS = {
    "PROP-001": {
        "title": "2BR Apartment in Mumbai with Sea View",
        "description": "A comfortable 2-bedroom apartment in Mumbai with sea view. Has AC, WiFi, kitchen. Near tourist spots. Good for families.",
        "photo_order": ["Living room", "Bedroom", "Bathroom", "Kitchen", "View"],
    },
    "PROP-002": {
        "title": "Studio in Bandra Mumbai",
        "description": "Cozy studio apartment in Bandra. WiFi available. Good location near restaurants and nightlife.",
        "photo_order": ["Bedroom", "Bathroom", "Kitchen", "Street view"],
    },
    "PROP-003": {
        "title": "3BHK Heritage Home in Colaba",
        "description": "Spacious 3-bedroom heritage bungalow in Colaba. Great for families. Traditional architecture with modern amenities.",
        "photo_order": ["Living room", "Bedroom 1", "Bedroom 2", "Bedroom 3", "Garden"],
    },
    "PROP-004": {
        "title": "1BHK Apartment in Koramangala Bangalore",
        "description": "Work-friendly apartment in Koramangala with good WiFi. Suitable for business travelers.",
        "photo_order": ["Bedroom", "Workspace", "Bathroom", "Kitchen"],
    },
    "PROP-005": {
        "title": "Luxury Penthouse in Indiranagar",
        "description": "3-bedroom penthouse in Indiranagar with terrace and panoramic views. Premium finishes throughout.",
        "photo_order": ["Living room", "Terrace", "Master Bedroom", "Kitchen", "View"],
    },
}


def _build_optimizer_prompt(prop: dict, listing: dict, reviews: list) -> str:
    review_texts = "\n".join(f'- "{r["text"]}" ({r["stars"]}★)' for r in reviews[:4])
    return f"""You are STRIX Listing Optimizer. Rewrite this short-term rental listing to maximize bookings.

PROPERTY: {prop['name']} ({prop['id']})
Type: {prop['type']} | Location: {prop['location']} | Bedrooms: {prop['bedrooms']} | Price: ₹{prop['base_price']}/night

CURRENT TITLE: "{listing['title']}"
CURRENT DESCRIPTION: "{listing['description']}"
CURRENT PHOTO ORDER: {listing['photo_order']}

RECENT GUEST REVIEWS:
{review_texts}

RULES:
- Title must be under 50 chars, attention-grabbing, SEO optimized for Airbnb
- Description: 3-4 sentences, highlight unique selling points, mention the best features first
- Photo order: what should be shown FIRST to maximize click-through
- Pricing suggestions based on property type and market

Return ONLY valid JSON:
{{
  "optimized_title": "new title under 50 chars",
  "optimized_description": "new compelling description 3-4 sentences",
  "photo_order_changes": ["describe what changes to photo order and why, e.g., 'Move sea view photo to #1 — view is the top booking trigger'"],
  "pricing_suggestions": ["2-3 specific pricing tactics e.g., 'Reduce ₹200 for weeknights to fill gaps'"],
  "ab_test_variant": "one alternative title to A/B test",
  "projected_ctr_lift": number between 0 and 100 (percentage improvement),
  "projected_conversion_lift": number between 0 and 100 (percentage improvement)
}}"""


def optimize_listing(property_id: str) -> ListingOptimization:
    prop = next((p for p in PROPERTIES if p["id"] == property_id), None)
    if not prop:
        raise ValueError(f"Property {property_id} not found")

    listing = CURRENT_LISTINGS.get(property_id, {
        "title": prop["name"], "description": "A great property.", "photo_order": []
    })
    reviews = PROPERTY_REVIEWS.get(property_id, [])

    try:
        prompt = _build_optimizer_prompt(prop, listing, reviews)
        ai_result = call_gemini_json(prompt)
        return ListingOptimization(
            property_id=property_id,
            current_title=listing["title"],
            optimized_title=ai_result.get("optimized_title", listing["title"]),
            current_description=listing["description"],
            optimized_description=ai_result.get("optimized_description", listing["description"]),
            photo_order_changes=ai_result.get("photo_order_changes", []),
            pricing_suggestions=ai_result.get("pricing_suggestions", []),
            ab_test_variant=ai_result.get("ab_test_variant", ""),
            projected_ctr_lift=float(ai_result.get("projected_ctr_lift", 15)),
            projected_conversion_lift=float(ai_result.get("projected_conversion_lift", 10)),
        )
    except Exception:
        return ListingOptimization(
            property_id=property_id,
            current_title=listing["title"],
            optimized_title=listing["title"],
            current_description=listing["description"],
            optimized_description=listing["description"],
            photo_order_changes=[],
            pricing_suggestions=[],
            ab_test_variant="",
            projected_ctr_lift=0,
            projected_conversion_lift=0,
        )


def optimize_all_listings() -> list[ListingOptimization]:
    return [optimize_listing(p["id"]) for p in PROPERTIES]
