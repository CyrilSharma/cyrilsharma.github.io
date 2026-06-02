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

def extract_meta(content):
    title = (re.search(r'title:\s*"([^"]*)"', content) or type('', (), {'group': lambda s, n: None})()).group(1)
    tags_block = re.search(r'tags:\s*\(([^)]*)\)', content)
    tags = []
    if tags_block:
        tags = [t.strip().strip('"') for t in tags_block.group(1).split(",") if t.strip().strip('"')]
    return title, tags

def strip_header(content):
    content = re.sub(r'#import[^\n]*\n', '', content)
    content = re.sub(r'#show: main\.with\([\s\S]*?\n\)', '', content)
    content = re.sub(r'#show: main\n?', '', content)
    return content.lstrip('\n')

def build_frontmatter(title, tags):
    tags_field = ", ".join(f'"{t}"' for t in tags)
    if len(tags) == 1:
        tags_field += ","
    return (
        '#import "/typ/templates/blog.typ": *\n'
        '#show: main.with(\n'
        f'  title: "{title}",\n'
        f'  desc: "",\n'
        f'  date: "{iso_timestamp()}",\n'
        f'  tags: ({tags_field}),\n'
        ')\n'
    )

def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

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

    local_slug = src_fname[:-4]
    section, dest_path = find_published(local_slug)

    if dest_path:
        # Re-publish: read metadata from existing published file
        with open(dest_path) as f:
            existing = f.read()
        title, tags = extract_meta(existing)
        slug = local_slug
        console.print(f"[dim]Updating existing: {dest_path}[/dim]")
    else:
        # First publish: prompt for everything
        section = Prompt.ask("[cyan]Section[/cyan]", choices=["blog", "notes"], default="blog")

        raw_name = Prompt.ask("[cyan]Name[/cyan]", default=local_slug).strip()
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

    # Build canonical content from local source + resolved metadata
    with open(src_path) as f:
        raw_body = strip_header(f.read())
    canonical = build_frontmatter(title, tags) + raw_body

    # Write to published destination
    write_file(dest_path, canonical)

    # Sync local draft: rename if slug changed, then write canonical content back
    new_local_path = f"{LOCAL_DIR}/{slug}.typ"
    if new_local_path != src_path:
        os.rename(src_path, new_local_path)
    write_file(new_local_path, canonical)

    subprocess.run(["git", "add", dest_path], check=True)
    subprocess.run(["git", "commit", "-m", f"Publish: {title}"], check=True)
    subprocess.run(["git", "push"], check=True)

    console.print(f"\n[green]Published:[/green] [bold]{dest_path}[/bold]")
    console.print(f"[green]URL:[/green]       [bold]http://localhost:4321/{section}/{slug}/[/bold]")

if __name__ == "__main__":
    main()
