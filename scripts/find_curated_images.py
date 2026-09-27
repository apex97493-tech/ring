import json, os

data = json.load(open('src/lib/products-store.json', encoding='utf-8'))
for p in data:
    cat = p.get('category')
    name = p.get('name')
    imgs = [i for i in p.get('images', []) if i.startswith('/uploads/')]
    if not imgs: continue
    
    # Specific gems or standout items
    if cat == 'nose-ring':
        print(f"NOSE RING: {name} -> {imgs[0]}")
    elif cat == 'belly-rings':
        print(f"BELLY RING: {name} -> {imgs[0]}")
    elif cat == 'bracelet':
        print(f"BRACELET: {name} -> {imgs[0]}")
    elif cat == 'lesbian-ring':
        print(f"LESBIAN: {name} -> {imgs[0]}")
    elif cat == 'earrings' and ('sapphire' in name.lower() or 'ruby' in name.lower() or 'gold' in name.lower()):
        print(f"EARRING: {name[:40]} -> {imgs[0]}")
    elif cat == 'necklace' and ('pendant' in name.lower() or 'heart' in name.lower() or 'snake' in name.lower()):
        print(f"NECKLACE: {name[:40]} -> {imgs[0]}")
    elif cat == 'band' and ('eternity' in name.lower() or 'curved' in name.lower() or 'chevron' in name.lower()):
        print(f"BAND: {name[:40]} -> {imgs[0]}")
    elif cat == 'ring-set' and ('bridal' in name.lower() or 'set' in name.lower()):
        print(f"RING SET: {name[:40]} -> {imgs[0]}")
    elif cat == 'rings' and ('radiant' in name.lower() or 'solitaire' in name.lower() or 'oval' in name.lower()):
        print(f"RINGS: {name[:40]} -> {imgs[0]}")
