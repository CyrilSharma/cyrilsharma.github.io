#!/usr/bin/env python3
from rich.console import Console
from rich.prompt import Prompt
import randomname
import datetime, os, sys

console = Console()
LOCAL_DIR = "./local/article"

def iso_timestamp():
    now = datetime.datetime.now().astimezone().replace(microsecond=0)
    return now.isoformat()

def main():
    console.print("\n[bold underline]New Draft[/bold underline]\n")

    raw = Prompt.ask("[cyan]Title[/cyan] (leave blank to generate)").strip()
    if raw:
        title = raw.title()
        slug = raw.lower().replace(" ", "-")
    else:
        slug = randomname.get_name()
        title = slug.replace("-", " ").title()

    os.makedirs(LOCAL_DIR, exist_ok=True)
    filepath = f"{LOCAL_DIR}/{slug}.typ"

    if os.path.exists(filepath):
        console.print(f"[red]Error:[/red] '{filepath}' already exists.")
        sys.exit(1)

    content = (
        '#import "/typ/templates/blog.typ": *\n'
        "#show: main.with(\n"
        f'  title: "{title}",\n'
        f'  desc: "",\n'
        f'  date: "{iso_timestamp()}",\n'
        f'  tags: (),\n'
        ")\n"
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    console.print(f"\n[green]Created:[/green] [bold]{filepath}[/bold]")
    console.print(f"[green]Open:[/green]    [bold]open -a CotEditor {filepath}[/bold]")

if __name__ == "__main__":
    main()
