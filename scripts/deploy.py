#!/usr/bin/env python3
import os
import shutil
import subprocess
import sys
import tempfile

import questionary

ARTICLE_DIR = "content/articles"
LIVE_BRANCH = "live"


def run(cmd, *, cwd=None, check=True):
    return subprocess.run(cmd, cwd=cwd, check=check, capture_output=True, text=True)


def output(cmd, *, cwd=None, check=True):
    return run(cmd, cwd=cwd, check=check).stdout.strip()


def ref_exists(ref):
    return run(["git", "rev-parse", "--verify", "--quiet", ref], check=False).returncode == 0


def ensure_live_branch(source_sha):
    if ref_exists(LIVE_BRANCH):
        return False

    fetched = run(["git", "fetch", "origin", f"{LIVE_BRANCH}:{LIVE_BRANCH}"], check=False)
    if fetched.returncode == 0 and ref_exists(LIVE_BRANCH):
        return False

    init = questionary.confirm(
        f"No local or remote '{LIVE_BRANCH}' branch found. Initialize it from current HEAD?",
        default=False,
    ).ask()
    if not init:
        sys.exit(0)

    run(["git", "branch", LIVE_BRANCH, source_sha])
    return True


def changed_article_files(source_sha):
    return output([
        "git",
        "diff",
        "--name-only",
        "--diff-filter=ACMRD",
        f"{LIVE_BRANCH}..{source_sha}",
        "--",
        ARTICLE_DIR,
    ]).splitlines()


def title_for(path):
    name = os.path.basename(path).removesuffix(".typ")
    if "." in name:
        name = name.split(".", 1)[1]
    return name.replace("-", " ").replace("_", " ").title()


def commit_selected_files(source_sha, selected):
    tmp_parent = tempfile.mkdtemp(prefix="blog-deploy-")
    worktree = os.path.join(tmp_parent, "live")
    try:
        run(["git", "worktree", "add", worktree, LIVE_BRANCH])

        for path in selected:
            exists_in_source = run(["git", "cat-file", "-e", f"{source_sha}:{path}"], check=False).returncode == 0
            target = os.path.join(worktree, path)
            if exists_in_source:
                os.makedirs(os.path.dirname(target), exist_ok=True)
                run(["git", "checkout", source_sha, "--", path], cwd=worktree)
            elif os.path.exists(target):
                os.remove(target)

        status = output(["git", "status", "--short", "--", ARTICLE_DIR], cwd=worktree)
        if not status:
            print("Selected files produced no deploy changes.")
            return False

        run(["git", "add", "--"] + selected, cwd=worktree)
        msg = "Deploy: " + ", ".join(title_for(path) for path in selected)
        run(["git", "commit", "-m", msg], cwd=worktree)
        run(["git", "push", "origin", LIVE_BRANCH], cwd=worktree)
        return True
    finally:
        run(["git", "worktree", "remove", "--force", worktree], check=False)
        shutil.rmtree(tmp_parent, ignore_errors=True)


def main():
    source_sha = output(["git", "rev-parse", "HEAD"])
    uncommitted = output(["git", "status", "--short", "--", ARTICLE_DIR])
    if uncommitted:
        print("Uncommitted article changes are not deployable. Run 'just push' first.")
        print(uncommitted)
        sys.exit(1)

    initialized = ensure_live_branch(source_sha)
    if initialized:
        run(["git", "push", "origin", LIVE_BRANCH])
        print(f"Initialized and pushed '{LIVE_BRANCH}' from current HEAD.")
        return

    files = changed_article_files(source_sha)
    if not files:
        print(f"No committed article changes to deploy relative to '{LIVE_BRANCH}'.")
        sys.exit(0)

    selected = questionary.checkbox("Select article files to deploy:", choices=files).ask()
    if not selected:
        sys.exit(0)

    if commit_selected_files(source_sha, selected):
        print(f"Deployed {len(selected)} file(s) to '{LIVE_BRANCH}'.")


if __name__ == "__main__":
    main()
