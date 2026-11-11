# Mağaza görselini hedef boyuta getirir.
#   python3 panel/store_fit.py <kaynak> <çıktı.png> <W> <H> <cover|contain> <top|center|bottom>
# cover: boşluk bırakmadan doldurur, taşan kısım anchor'a göre kırpılır.
# contain: görselin tamamı görünür; boşluklar aynı görselin bulanık, büyütülmüş haliyle dolar.
import sys
from PIL import Image, ImageFilter

src, out, W, H, mode, anchor = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5], sys.argv[6]
_src = Image.open(src)
img = _src.convert('RGBA' if ('A' in _src.mode or _src.mode == 'P') else 'RGB')


def cover(im, w, h, anchor):
    scale = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    x = (im.width - w) // 2
    y = {'top': 0, 'bottom': im.height - h}.get(anchor, (im.height - h) // 2)
    return im.crop((x, y, x + w, y + h))


if mode == 'contain':
    canvas = cover(img, W, H, 'center').filter(ImageFilter.GaussianBlur(60))
    scale = min(W / img.width, H / img.height)
    fit = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    y = {'top': 0, 'bottom': H - fit.height}.get(anchor, (H - fit.height) // 2)
    canvas.paste(fit, ((W - fit.width) // 2, y))
else:
    canvas = cover(img, W, H, anchor)

canvas.save(out, 'PNG', optimize=True)
print(f'{W}x{H}')
