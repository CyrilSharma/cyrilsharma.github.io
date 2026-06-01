#!/usr/bin/env python3
from rich.console import Console
from rich.prompt import Prompt
import datetime, os, re, shutil, subprocess, sys

console = Console()
LOCAL_DIR = "./local/article"
SECTION_DIRS = {
    "blog":  "./content/article",
    "notes": "./content/notes",
}

def iso_timestamp():
    now = datetime.datetime.now().astimezone().replace(microsecond=0)
    return now.isoformat()

def list_drafts():
    if not os.path.isdir(LOCAL_DIR):
        return []
    files = [
        (os.path.getmtime(p := os.path.join(LOCAL_DIR, f)), f, p)
        for f in os.listdir(LOCAL_DIR) if f.endswith(".typ")
    ]
    files.sort(reverse=True)
    return files

def find_published(slug):
    for section, d in SECTION_DIRS.items():
        path = f"{d}/{slug}.typ"
        if os.path.exists(path):
            return section, path
    return None, None

def update_frontmatter(content, title, tags):
    tags_field = ", ".join(f'"{t}"' for t in tags)
    if len(tags) == 1:
        tags_field += ","
    content = re.sub(r'title: "[^"]*"', f'title: "{title}"', content)
    content = re.sub(r'date: "[^"]*"',  f'date: "{iso_timestamp()}"', content)
    content = re.sub(r'tags: \([^)]*\)', f'tags: ({tags_field})', content)
    return content

def read_frontmatter_tags(content):
    m = re.search(r'tags: \(([^)]*)\)', content)
    if not m:
        return []
    return [t.strip().strip('"') for t in m.group(1).split(",") if t.strip().strip('"')]

def main():
    console.print("\n[bold underline]Publish Draft[/bold underline]\n")

    drafts = list_drafts()
    if not drafts:
        console.print("[red]No drafts found in local/article.[/red]")
        sys.exit(1)

    console.print("[cyan]Drafts (newest first):[/cyan]")
    for i, (mtime, fname, _) in enumerate(drafts):
        dt = datetime.datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M")
        console.print(f"  [bold]{i+1}[/bold]. {fname[:-4]}  [dim]{dt}[/dim]")

    while True:
        raw = Prompt.ask("\n[cyan]Pick a draft[/cyan]").strip()
        if raw.isdigit() and 1 <= int(raw) <= len(drafts):
            _, src_fname, src_path = drafts[int(raw) - 1]
            break
        console.print("[red]Invalid choice.[/red]")

    slug = src_fname[:-4]
    section, dest_path = find_published(slug)

    if dest_path:
        # Already published — read existing tags/title from dest and just overwrite
        with open(dest_path, "r", encoding="utf-8") as f:
            existing = f.read()
        tags = read_frontmatter_tags(existing)
        m = re.search(r'title: "([^"]*)"', existing)
        title = m.group(1) if m else slug.replace("-", " ").title()
        console.print(f"[dim]Updating existing: {dest_path}[/dim]")
    else:
        # First publish — prompt for everything
        section = Prompt.ask("[cyan]Section[/cyan]", choices=["blog", "notes"], default="blog")

        raw_name = Prompt.ask("[cyan]Name[/cyan]", default=slug).strip()
        slug = raw_name.lower().replace(" ", "-")
        title = raw_name.replace("-", " ").title()

        while True:
            raw_tags = Prompt.ask("[cyan]Tags (comma-separated)[/cyan]").strip()
            tags = [t.strip() for t in raw_tags.split(",") if t.strip()]
            if tags:
                break
            console.print("[red]At least one tag is required.[/red]")

        dest_dir = SECTION_DIRS[section]
        os.makedirs(dest_dir, exist_ok=True)
        dest_path = f"{dest_dir}/{slug}.typ"

    with open(src_path, "r", encoding="utf-8") as f:
        content = f.read()

    content = update_frontmatter(content, title, tags)
    shutil.copy2(src_path, dest_path)

    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(content)

    subprocess.run(["git", "add", dest_path], check=True)
    subprocess.run(["git", "commit", "-m", f"Publish: {title}"], check=True)
    subprocess.run(["git", "push"], check=True)

    console.print(f"\n[green]Published:[/green] [bold]{dest_path}[/bold]")
    console.print(f"[green]URL:[/green]       [bold]http://localhost:4321/{section}/{slug}/[/bold]")

if __name__ == "__main__":
    main()
