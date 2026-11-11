# Magenta (#FF00FF) zeminli ön katmanı şeffaf PNG'ye çevirir: python3 store_key.py in.png out.png
import sys, numpy as np
from PIL import Image
from scipy import ndimage as nd
a = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(float)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
# magentaya uzaklık: yüksek R ve B, düşük G
key = np.clip(((r + b) / 2 - g - 90) / 80, 0, 1) * np.clip((np.minimum(r, b) - 150) / 60, 0, 1)
alpha = 1 - key
alpha = nd.grey_opening(alpha, size=3)
alpha = nd.gaussian_filter(alpha, 0.6)
# kenarlardaki magenta taşmasını temizle (despill)
spill = np.clip(np.minimum(r, b) - g, 0, None) * (1 - alpha) * 0.9
a[..., 0] -= spill; a[..., 2] -= spill
lab, n = nd.label(alpha > 0.5)
if n:
    sizes = nd.sum(np.ones_like(alpha), lab, range(1, n + 1))
    small = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s < 400])
    alpha[small] = 0
out = np.dstack([np.clip(a, 0, 255), alpha * 255]).astype(np.uint8)
Image.fromarray(out, 'RGBA').save(sys.argv[2])
