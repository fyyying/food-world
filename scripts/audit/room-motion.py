"""Rank rooms by how much of the frame visibly changes in two seconds of idle motion.
First capture pairs in the dev server (hidden pane is fine):
  for each room object: __fw.open(id); step 60; __fw.sceneShot('rm-<id>-a'); step 120; __fw.sceneShot('rm-<id>-b'); __fw.closeScene()
Then: uv run --with pillow --with numpy scripts/audit/room-motion.py .data/shots [threshold%]
A room under the threshold has always-on loops that nobody can see; strengthen or replace them."""
import sys, os, re
import numpy as np
from PIL import Image
folder = sys.argv[1]; threshold = float(sys.argv[2]) if len(sys.argv) > 2 else 2.5
rows = []
for f in sorted(os.listdir(folder)):
    m = re.match(r'rm-(.+)-a\.jpg$', f)
    if not m: continue
    tag = m.group(1); b = os.path.join(folder, f'rm-{tag}-b.jpg')
    if not os.path.exists(b): continue
    x = np.asarray(Image.open(os.path.join(folder, f)).convert('RGB')).astype(int); y = np.asarray(Image.open(b).convert('RGB')).astype(int)
    if x.shape != y.shape: continue
    d = np.abs(x - y).sum(axis=2)
    rows.append((100 * (d > 24).mean(), 100 * (d > 60).mean(), tag))
rows.sort()
for soft, hard, tag in rows:
    flag = 'WEAK' if soft < threshold else ''
    print(f'{soft:5.1f}% >24  {hard:5.2f}% >60  {tag:22s} {flag}')
weak = [r for r in rows if r[0] < threshold]
print(f'{len(rows)} rooms measured, {len(weak)} under {threshold}% change in two seconds')
