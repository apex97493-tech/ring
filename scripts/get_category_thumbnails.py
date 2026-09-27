import json, os
from collections import defaultdict

data = json.load(open('src/lib/products-store.json', encoding='utf-8'))
cats = defaultdict(list)
for p in data:
    cats[p.get('category')].append(p)

target_cats = ['rings', 'band', 'lesbian-ring', 'pendant', 'earrings', 'necklace', 'bracelet', 'nose-ring', 'belly-rings', 'ring-set']
for cat in target_cats:
    items = cats.get(cat, [])
    print(f"\n*** Category: {cat} ({len(items)} items) ***")
    for p in items[:5]:
        imgs = [i for i in p.get('images', []) if i.startswith('/uploads/')]
        first_img = imgs[0] if imgs else "NONE"
        exists = os.path.exists(os.path.join('public', first_img.lstrip('/'))) if first_img != "NONE" else False
        size_kb = os.path.getsize(os.path.join('public', first_img.lstrip('/'))) // 1024 if exists else 0
        print(f"  {p['name'][:50]} | {first_img} ({size_kb}KB, exists={exists})")
