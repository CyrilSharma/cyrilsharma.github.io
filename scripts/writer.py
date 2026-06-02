#!/usr/bin/env python3
from rich.console import Console
from rich.prompt import Prompt
import randomname
import os, sys

console = Console()
LOCAL_DIR = "./local/article"

def main():
    console.print("\n[bold underline]New Draft[/bold underline]\n")

    raw = Prompt.ask("[cyan]Title[/cyan] (leave blank to generate)").strip()
    slug = raw.lower().replace(" ", "-") if raw else randomname.get_name()

    os.makedirs(LOCAL_DIR, exist_ok=True)
    filepath = f"{LOCAL_DIR}/{slug}.typ"

    if os.path.exists(filepath):
        console.print(f"[red]Error:[/red] '{filepath}' already exists.")
        sys.exit(1)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write("#show: main\n")

    console.print(f"\n[green]Created:[/green] [bold]{filepath}[/bold]")
    console.print(f"[green]Open:[/green]    [bold]open -a CotEditor {filepath}[/bold]")

if __name__ == "__main__":
    main()
