# Ekran önizlemelerinin ne kadar "dolu" olduğunu ölçer (mağaza karesi için en dolu ekranı seçmek).
#   python3 panel/screen_density.py <png> [png ...]  → her satır: <yol>\t<skor 0–1>
# Skor: baskın zemin renginden farklı piksel oranı × 0.6 + kenar yoğunluğu × 0.4 (küçültülmüş görüntüde)
import sys
from PIL import Image, ImageFilter, ImageStat

for p in sys.argv[1:]:
    try:
        im = Image.open(p).convert('RGB').resize((108, 232))
        px = list(im.get_flattened_data()) if hasattr(im, "get_flattened_data") else list(im.getdata())
        bg = max(set(px[::7]), key=px[::7].count)
        diff = sum(1 for c in px if abs(c[0] - bg[0]) + abs(c[1] - bg[1]) + abs(c[2] - bg[2]) > 40) / len(px)
        edges = ImageStat.Stat(im.convert('L').filter(ImageFilter.FIND_EDGES)).mean[0] / 64
        print(f'{p}\t{round(diff * 0.6 + min(edges, 1) * 0.4, 4)}')
    except Exception:
        print(f'{p}\t0')
