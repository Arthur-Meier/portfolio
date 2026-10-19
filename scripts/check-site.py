from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import argparse

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids=[]; self.references=[]; self.language=None; self.alternates=set(); self.description=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.append(a['id'])
        if tag=='html': self.language=a.get('lang')
        for key in ('src','href'):
            if a.get(key): self.references.append(a[key])
        if tag=='link' and a.get('rel')=='alternate': self.alternates.add(a.get('hreflang'))
        if tag=='meta' and a.get('name')=='description' and a.get('content'): self.description=True

parser=argparse.ArgumentParser()
parser.add_argument('directory', nargs='?', default='dist')
parser.add_argument('--base-path', default='')
args=parser.parse_args()
base_path=args.base_path.rstrip('/')
root=Path(args.directory).resolve()
pages={}
for relative, language in [('index.html','pt-BR'),('en/index.html','en')]:
    p=Page(); p.feed((root/relative).read_text()); pages[relative]=p
    assert p.language==language, f'{relative}: wrong language'
    assert len(p.ids)==len(set(p.ids)), f'{relative}: duplicate IDs'
    assert p.description, f'{relative}: missing description'
    assert {'pt-BR','en','x-default'}<=p.alternates, f'{relative}: missing alternates'
for relative, page in pages.items():
    for reference in page.references:
        u=urlsplit(reference)
        if u.scheme or u.netloc: continue
        if u.path:
            local_path=u.path
            if local_path.startswith('/') and base_path:
                assert local_path.startswith(base_path+'/'), f'{relative}: asset outside site base {reference}'
                local_path=local_path[len(base_path):]
            target=(root/unquote(local_path.lstrip('/'))) if local_path.startswith('/') else (root/relative).parent/unquote(local_path)
            if u.path.endswith('/'): target=target/'index.html'
        else: target=root/relative
        assert target.is_relative_to(root), f'{relative}: asset escapes output'
        assert target.is_file(), f'{relative}: missing {reference}'
        if u.fragment:
            key=str(target.relative_to(root))
            assert key in pages and unquote(u.fragment) in pages[key].ids, f'{relative}: missing anchor {reference}'
assert (root/'assets/curriculo-arthur-meier-pt.pdf').stat().st_size>0
assert (root/'assets/arthur.webp').stat().st_size>0
print('PASS: two locales, metadata, unique IDs, anchors and local assets.')
