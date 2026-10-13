"""Create the offline game and source archive beside this project folder."""
from pathlib import Path
import base64
import re
import zipfile

root = Path(__file__).resolve().parent.parent
out = root.parent
html = (root / 'dist/index.html').read_text()
css = (root / 'dist/style.css').read_text()
font = base64.b64encode((root / 'dist/fonts/Bravura.woff2').read_bytes()).decode()
css = css.replace("url('fonts/Bravura.woff2')", "url('data:font/woff2;base64," + font + "')")
parts = []
for name in ['chart-data.js', 'data.js', 'engine.js', 'notation.js', 'brass.js', 'woodwinds.js', 'keyboard.js', 'practice.js', 'timing.js', 'audio.js', 'preferences.js', 'drag.js', 'share.js', 'student-ui.js', 'silhouettes.js', 'answers.js', 'reference-input.js', 'full-chart.js', 'banner.js', 'app.js']:
    code = (root / 'dist' / name).read_text()
    code = re.sub(r'^import .*?;\s*', '', code, flags=re.M)
    code = re.sub(r'\bexport (?=(const|function|class)\b)', '', code)
    if name == 'silhouettes.js':
        asset = root / 'dist/art/instrument-silhouettes.png'
        code = code.replace('art/instrument-silhouettes.png', 'data:image/png;base64,' + base64.b64encode(asset.read_bytes()).decode())
    if name == 'student-ui.js':
        asset = root / 'dist/art/note-quest-brand-sheet.png'
        code = code.replace('art/note-quest-brand-sheet.png', 'data:image/png;base64,' + base64.b64encode(asset.read_bytes()).decode())
    if name == 'audio.js':
        asset = root / 'dist/audio/incorrect-buzz.mp3'
        code = code.replace('audio/incorrect-buzz.mp3', 'data:audio/mpeg;base64,' + base64.b64encode(asset.read_bytes()).decode())
    parts.append(code)
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')
html = html.replace('<script type="module" src="app.js"></script>', '<script type="module">\n' + '\n'.join(parts) + '\n</script>')
license_text = (root / 'dist/fonts/OFL.txt').read_text()
html = html.replace('</body>', '<script type="text/plain" id="bravura-font-license">\n' + license_text + '\n</script></body>')
standalone = out / 'Band Fingering Trainer.html'
standalone.write_text(html)
(out / 'Note Quest.html').write_text(html)
with zipfile.ZipFile(out / 'Band Fingering Trainer Project.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    archive.write(standalone, 'Note Quest.html')
    for path in sorted(root.rglob('*')):
        if path.is_file() and not any(part.startswith('.') or part == '__pycache__' for part in path.relative_to(root).parts):
            archive.write(path, root.name + '/' + str(path.relative_to(root)))
(out / 'Note Quest Project.zip').write_bytes((out / 'Band Fingering Trainer Project.zip').read_bytes())
print(out / 'Note Quest.html')
