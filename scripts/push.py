#!/usr/bin/env python3
import questionary
import subprocess, sys

def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True).stdout.strip()

def main():
    changed = run(["git", "diff", "--name-only", "HEAD", "--", "content/articles/"]).splitlines()
    untracked = run(["git", "ls-files", "--others", "--exclude-standard", "content/articles/"]).splitlines()
    files = changed + [f for f in untracked if f not in changed]

    if not files:
        print("Nothing to push in content/articles/")
        sys.exit(0)

    selected = questionary.checkbox("Select files to commit:", choices=files).ask()
    if not selected:
        sys.exit(0)

    titles = []
    for f in selected:
        name = f.split("/")[-1].replace(".typ", "")
        if "." in name:
            name = name.split(".", 1)[1]
        titles.append(name.replace("-", " ").title())
    msg = "Publish: " + ", ".join(titles)

    subprocess.run(["git", "add"] + selected, check=True)
    subprocess.run(["git", "commit", "-m", msg], check=True)
    subprocess.run(["git", "push"], check=True)

if __name__ == "__main__":
    main()
