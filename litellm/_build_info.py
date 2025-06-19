import os
import subprocess
import functools


@functools.lru_cache(1)
def get_commit_hash():
    # GIT_COMMIT env var is available for Docker build
    if "GIT_COMMIT" in os.environ:
        return os.environ["GIT_COMMIT"]

    try:
        # git is available for local development
        return subprocess.check_output(["git", "rev-parse", "--short", "HEAD"]).decode().strip()
    except Exception:
        return "UNKNOWN"
