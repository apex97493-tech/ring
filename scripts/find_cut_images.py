import json, os

data = json.load(open('src/lib/products-store.json', encoding='utf-8'))
cuts = ['Round', 'Emerald', 'Oval', 'Pear', 'Cushion', 'Radiant']
for cut in cuts:
    print(f"\n=== Cut: {cut} ===")
    matches = [p for p in data if (p.get('shape') == cut or cut.lower() in p.get('name', '').lower()) and 'moissanite' in p.get('name', '').lower()]
    for p in matches[:4]:
        imgs = [i for i in p.get('images', []) if i.startswith('/uploads/')]
        if imgs:
            fpath = os.path.join('public', imgs[0].lstrip('/'))
            exists = os.path.exists(fpath)
            size = os.path.getsize(fpath) if exists else 0
            print(f"  {p['name'][:55]} | {imgs[0]} ({size//1024}KB, exists={exists})")
