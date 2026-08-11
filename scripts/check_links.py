#!/usr/bin/env python3
"""Fail if index.html references a local file that does not exist."""
import re
import sys
from pathlib import Path

html = Path("index.html").read_text()
refs = re.findall(r'(?:src|href)="([^"]+)"', html)
local_refs = [r for r in refs if not r.startswith(("http://", "https://", "data:", "#", "mailto:"))]
missing = [r for r in local_refs if not Path(r).is_file()]

if missing:
    print("Missing local assets referenced in index.html:")
    for m in missing:
        print(f"  - {m}")
    sys.exit(1)

print(f"OK: {len(local_refs)} local asset reference(s) all resolve to real files.")
