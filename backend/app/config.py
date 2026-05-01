import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./strix.db")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
USE_MOCK_AI = os.getenv("USE_MOCK_AI", "false").lower() == "true"
GEMINI_MODEL = "gemini-1.5-flash"
