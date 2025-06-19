import subprocess
from pathlib import Path

def get_commit_hash():
    try:
        return subprocess.check_output(["git", "rev-parse", "--short", "HEAD"]).decode().strip()
    except Exception:
        return "UNKNOWN"

if __name__ == "__main__":
    commit = get_commit_hash()
    build_info_path = Path(__file__).parent.parent / "litellm/_build_info.py"
    with open(build_info_path, "w") as f:
        f.write(f'GIT_COMMIT = "{commit}"\n')
