#!/usr/bin/env python3
import questionary
import subprocess, sys

def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True).stdout.strip()

def main():
    changed = run(["git", "diff", "--name-only", "HEAD", "--", "content/"]).splitlines()
    untracked = run(["git", "ls-files", "--others", "--exclude-standard", "content/"]).splitlines()
    files = changed + [f for f in untracked if f not in changed]

    if not files:
        print("Nothing to push in content/")
        sys.exit(0)

    selected = questionary.checkbox("Select files to commit:", choices=files).ask()
    if not selected:
        sys.exit(0)

    titles = [f.split("/")[-1].replace(".typ", "").replace("-", " ").title() for f in selected]
    msg = "Publish: " + ", ".join(titles)

    subprocess.run(["git", "add"] + selected, check=True)
    subprocess.run(["git", "commit", "-m", msg], check=True)
    subprocess.run(["git", "push"], check=True)

if __name__ == "__main__":
    main()
