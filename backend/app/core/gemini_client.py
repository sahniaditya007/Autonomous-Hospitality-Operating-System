from google import genai
from app.config import GEMINI_API_KEY, GEMINI_MODEL
import json
import re

_client = None


def get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def call_gemini(prompt: str, json_mode: bool = False) -> str:
    try:
        client = get_client()
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        text = response.text.strip()
        if json_mode:
            text = extract_json(text)
        return text
    except Exception as e:
        raise RuntimeError(f"Gemini API error: {str(e)}")


def extract_json(text: str) -> str:
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        return match.group(1).strip()
    brace_match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", text)
    if brace_match:
        return brace_match.group(1).strip()
    return text


def call_gemini_json(prompt: str) -> dict | list:
    raw = call_gemini(prompt, json_mode=True)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"error": "Failed to parse JSON", "raw": raw}
