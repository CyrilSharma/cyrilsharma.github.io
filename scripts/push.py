#!/usr/bin/env python3
import argparse
import questionary
import subprocess, sys

def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True).stdout.strip()

def main():
    parser = argparse.ArgumentParser(description="Commit and push selected files.")
    parser.add_argument("files", nargs="*", help="Paths to publish; defaults to interactive article selection.")
    parser.add_argument("-m", "--message", help="Commit message.")
    args = parser.parse_args()
    paths = args.files or ["content/articles/"]
    changed = run(["git", "diff", "--name-only", "HEAD", "--", *paths]).splitlines()
    untracked = run(["git", "ls-files", "--others", "--exclude-standard", "--", *paths]).splitlines()
    files = changed + [f for f in untracked if f not in changed]

    if not files:
        print("Nothing to push in " + ", ".join(paths))
        sys.exit(0)

    selected = files if args.files else questionary.checkbox("Select files to commit:", choices=files).ask()
    if not selected:
        sys.exit(0)

    titles = []
    for f in selected:
        name = f.split("/")[-1].replace(".typ", "")
        if "." in name:
            name = name.split(".", 1)[1]
        titles.append(name.replace("-", " ").title())
    msg = args.message or "Publish: " + ", ".join(titles)

    subprocess.run(["git", "add", "--"] + selected, check=True)
    subprocess.run(["git", "commit", "-m", msg], check=True)
    subprocess.run(["git", "push"], check=True)

if __name__ == "__main__":
    main()
