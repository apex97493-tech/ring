import urllib.request, json, re

url = 'https://www.etsy.com/in-en/listing/4582242777/oval-cut-rose-quartz-ring'
headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-US,en;q=0.9',
}
req = urllib.request.Request(url, headers=headers)
try:
    html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
    print('HTML size:', len(html))
    
    # Meta description
    meta = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', html, re.IGNORECASE)
    if meta:
        print('\nMETA DESC:', meta.group(1)[:400])
    
    # JSON-LD
    jld = re.search(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.DOTALL)
    if jld:
        try:
            d = json.loads(jld.group(1))
            if isinstance(d, list): d = d[0]
            print('\nJSON-LD description:', str(d.get('description',''))[:400])
        except:
            pass
    
    # Search for description in raw HTML
    desc_patterns = [
        r'"description"\s*:\s*"((?:[^"\\]|\\.){100,})"',
        r'listing-page-description.*?<p>(.*?)</p>',
        r'wt-text-body-01.*?<p[^>]*>(.*?)</p>',
    ]
    for pat in desc_patterns:
        m = re.search(pat, html, re.DOTALL | re.IGNORECASE)
        if m:
            print('\nPattern found:', pat[:40])
            txt = re.sub(r'<[^>]+>', '', m.group(1))
            print(txt[:400])
            break
            
except Exception as e:
    print('Error:', e)
