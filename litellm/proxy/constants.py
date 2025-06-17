import os

PROXY_BASE_URL = os.environ.get("PROXY_BASE_URL", "http://localhost:4000")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
COOKIE_DOMAIN = os.environ.get("COOKIE_DOMAIN", None)
