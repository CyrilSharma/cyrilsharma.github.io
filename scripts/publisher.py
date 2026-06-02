#!/usr/bin/env python3
import questionary
import datetime, os, re, sys
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
    drafts = list_drafts()
    if not drafts:
        print("No drafts found in local/article.")
        sys.exit(1)

    choices = [
        questionary.Choice(
            title=f"{fname[:-4]}  ({datetime.datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M')})",
            value=(fname, path),
        )
        for mtime, fname, path in drafts
    ]
    picked = questionary.select("Pick a draft:", choices=choices).ask()
    if not picked:
        sys.exit(0)
    src_fname, src_path = picked
    local_slug = src_fname[:-4]
    section, dest_path = find_published(local_slug)

    if dest_path:
        with open(dest_path) as f:
            existing = f.read()
        title, tags = extract_meta(existing)
        slug = local_slug
        print(f"Updating existing: {dest_path}")
    else:
        section = questionary.select("Section:", choices=["blog", "notes"]).ask()
        if not section:
            sys.exit(0)

        raw_name = questionary.text("Name:", default=local_slug).ask()
        if not raw_name:
            sys.exit(0)
        slug = raw_name.strip().lower().replace(" ", "-")
        title = raw_name.strip().replace("-", " ").title()

        while True:
            raw_tags = questionary.text("Tags (comma-separated):").ask()
            if raw_tags is None:
                sys.exit(0)
            tags = [t.strip() for t in raw_tags.split(",") if t.strip()]
            if tags:
                break
            print("At least one tag is required.")

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

    print(f"\nPublished: {dest_path}")
    print(f"URL:       http://localhost:4321/{section}/{slug}/")
    print("Run 'just push' when ready to commit and push.")

if __name__ == "__main__":
    main()
