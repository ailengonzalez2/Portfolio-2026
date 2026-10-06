/** Resolves with the URL the browser actually loaded (respects srcset). */
export function waitForImage(img: HTMLImageElement): Promise<string> {
  return new Promise((resolve, reject) => {
    if (img.complete && img.naturalWidth > 0) return resolve(img.currentSrc || img.src)
    img.addEventListener('load', () => resolve(img.currentSrc || img.src), { once: true })
    img.addEventListener('error', () => reject(new Error(`image failed: ${img.src}`)), { once: true })
  })
}
