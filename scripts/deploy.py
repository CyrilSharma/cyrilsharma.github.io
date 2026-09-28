#!/usr/bin/env python3
import argparse
import os
import shutil
import subprocess
import sys
import tempfile

import questionary

ARTICLE_DIR = "content/articles"
LIVE_BRANCH = "live"


def run(cmd, *, cwd=None, check=True):
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if check and result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip() or f"Command failed: {' '.join(cmd)}")
    return result


def output(cmd, *, cwd=None, check=True):
    return run(cmd, cwd=cwd, check=check).stdout.strip()


def ref_exists(ref):
    return run(["git", "rev-parse", "--verify", "--quiet", ref], check=False).returncode == 0


def ensure_live_branch(source_sha):
    fetched = run(["git", "fetch", "origin", LIVE_BRANCH], check=False)
    if fetched.returncode == 0:
        remote_ref = f"origin/{LIVE_BRANCH}"
        if ref_exists(LIVE_BRANCH):
            if ref_exists(remote_ref) and output(["git", "rev-parse", LIVE_BRANCH]) != output(["git", "rev-parse", remote_ref]):
                if run(["git", "merge-base", "--is-ancestor", LIVE_BRANCH, remote_ref], check=False).returncode != 0:
                    raise RuntimeError(f"Local '{LIVE_BRANCH}' has commits not on '{remote_ref}'; reconcile the branches before deploying.")
                run(["git", "branch", "-f", LIVE_BRANCH, remote_ref])
        else:
            run(["git", "branch", LIVE_BRANCH, remote_ref])
        return False

    if ref_exists(LIVE_BRANCH):
        raise RuntimeError(f"Could not fetch '{LIVE_BRANCH}' from origin: {fetched.stderr.strip()}")

    init = questionary.confirm(
        f"No local or remote '{LIVE_BRANCH}' branch found. Initialize it from current HEAD?",
        default=False,
    ).ask()
    if not init:
        sys.exit(0)

    run(["git", "branch", LIVE_BRANCH, source_sha])
    return True


def changed_article_files(source_sha, paths=None):
    return output([
        "git",
        "diff",
        "--name-only",
        "--diff-filter=ACMRD",
        f"{LIVE_BRANCH}..{source_sha}",
        "--",
        *(paths or [ARTICLE_DIR]),
    ]).splitlines()


def changed_non_article_files(source_sha):
    previous_deploy = output([
        "git", "log", "-1", "--grep=^Deploy-Source: ", "--format=%B", LIVE_BRANCH,
    ])
    source_lines = [line.removeprefix("Deploy-Source: ") for line in previous_deploy.splitlines()
                    if line.startswith("Deploy-Source: ")]
    base_sha = source_lines[-1] if source_lines else output(["git", "merge-base", LIVE_BRANCH, source_sha])
    if run(["git", "merge-base", "--is-ancestor", base_sha, source_sha], check=False).returncode != 0:
        raise RuntimeError("The last deployed source commit is not in the current branch; reconcile it before deploying.")
    changed_on_source = output([
        "git", "diff", "--name-only", "--no-renames", f"{base_sha}..{source_sha}",
        "--", ".", f":(exclude){ARTICLE_DIR}/**",
    ]).splitlines()
    if not changed_on_source:
        return []

    return output([
        "git", "diff", "--name-only", "--no-renames", f"{LIVE_BRANCH}..{source_sha}",
        "--", *changed_on_source,
    ]).splitlines()


def uncommitted_non_article_files():
    paths = [".", f":(exclude){ARTICLE_DIR}/**"]
    tracked = output(["git", "diff", "--name-only", "--no-renames", "HEAD", "--", *paths]).splitlines()
    untracked = output(["git", "ls-files", "--others", "--exclude-standard", "--", *paths]).splitlines()
    return list(dict.fromkeys(tracked + untracked))


def title_for(path):
    name = os.path.basename(path).removesuffix(".typ")
    if "." in name:
        name = name.split(".", 1)[1]
    return name.replace("-", " ").replace("_", " ").title()


def commit_selected_files(source_sha, selected, message=None, record_source=False):
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

        status = output(["git", "status", "--short", "--", *selected], cwd=worktree)
        if not status:
            print("Selected files produced no deploy changes.")
            return False

        run(["git", "add", "--"] + selected, cwd=worktree)
        msg = message or "Deploy: " + ", ".join(title_for(path) for path in selected)
        if record_source:
            msg += f"\n\nDeploy-Source: {source_sha}"
        run(["git", "commit", "-m", msg], cwd=worktree)
        run(["git", "push", "origin", LIVE_BRANCH], cwd=worktree)
        return True
    finally:
        run(["git", "worktree", "remove", "--force", worktree], check=False)
        shutil.rmtree(tmp_parent, ignore_errors=True)


def main():
    parser = argparse.ArgumentParser(description="Publish non-article changes to main and live, then optionally deploy articles.")
    parser.add_argument("files", nargs="*", help="Deploy only these committed paths; by default, publish all non-article changes and prompt for articles.")
    parser.add_argument("-m", "--message", help="Deployment commit message.")
    args = parser.parse_args()
    paths = args.files or [ARTICLE_DIR]
    uncommitted = output(["git", "status", "--short", "--", *paths])
    if uncommitted:
        print("Uncommitted changes are not deployable. Publish the selected files first.")
        print(uncommitted)
        sys.exit(1)

    if not args.files:
        if output(["git", "branch", "--show-current"]) != "main":
            raise RuntimeError("Run 'just deploy' from the main branch to publish non-article changes.")
        working_files = uncommitted_non_article_files()
        if working_files:
            run(["git", "add", "--", *working_files])
            run(["git", "commit", "--only", "-m", "Publish: Site updates", "--", *working_files])
            print(f"Committed {len(working_files)} non-article file(s) to 'main'.")
        run(["git", "push", "origin", "main"])

    source_sha = output(["git", "rev-parse", "HEAD"])
    initialized = ensure_live_branch(source_sha)
    if initialized:
        run(["git", "push", "origin", LIVE_BRANCH])
        print(f"Initialized and pushed '{LIVE_BRANCH}' from current HEAD.")
        return

    if args.files:
        selected = changed_article_files(source_sha, paths)
    else:
        site_files = changed_non_article_files(source_sha)
        article_files = changed_article_files(source_sha)
        selected_articles = (
            questionary.checkbox("Select article files to deploy:", choices=article_files).ask()
            if article_files else []
        ) or []
        selected = site_files + selected_articles
        if site_files:
            print(f"Including {len(site_files)} non-article file(s):")
            print("\n".join(site_files))
    if not selected:
        print(f"No changes selected for deployment to '{LIVE_BRANCH}'.")
        return

    message = args.message
    if message is None and not args.files and site_files:
        message = "Deploy: Site updates"
        if selected_articles:
            message += ", " + ", ".join(title_for(path) for path in selected_articles)

    if commit_selected_files(source_sha, selected, message, record_source=not args.files):
        print(f"Deployed {len(selected)} file(s) to '{LIVE_BRANCH}'.")


if __name__ == "__main__":
    main()
