write:
  export TYPST_ROOT='/Users/csharma/CS/Blog'
  uv run ./scripts/writer.py

publish:
  export TYPST_ROOT='/Users/csharma/CS/Blog'
  uv run ./scripts/publisher.py

push:
  uv run ./scripts/push.py
