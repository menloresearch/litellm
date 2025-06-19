import os
import subprocess
import functools


@functools.lru_cache(1)
def get_commit_hash():
    # GIT_COMMIT env var is available for Docker build
    val = os.environ.get("GIT_COMMIT", "").strip()
    if val:
        return val

    try:
        # git is available for local development
        return subprocess.check_output(["git", "rev-parse", "--short", "HEAD"]).decode().strip()
    except Exception:
        return "UNKNOWN"
