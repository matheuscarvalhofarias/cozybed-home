(() => {
  const cache = new Map(), pending = new WeakMap(), queued = new Set(), queue = [];
  let running = 0;
  function url(variant, product) {
    return variant?.optimizedImage ? '/cozybed-home/' + variant.optimizedImage : variant?.featured_image?.src || product.images[0]?.src || '/cozybed-home/' + product.localImage;
  }
  function load(src, priority = 'high') {
    if (cache.has(src)) {
      const entry = cache.get(src);
      if (priority === 'high') entry.image.fetchPriority = 'high';
      return entry.promise;
    }
    const image = new Image();
    image.decoding = 'async'; image.fetchPriority = priority;
    const promise = new Promise((resolve, reject) => {
      image.onload = async () => {
        try { await image.decode(); } catch { /* Loaded image remains usable. */ }
        resolve(image);
      };
      image.onerror = () => { cache.delete(src); reject(new Error('Image failed to load')); };
    });
    cache.set(src, { image, promise }); image.src = src;
    return promise;
  }
  function pump() {
    while (running < 2 && queue.length) {
      const src = queue.shift(); running++;
      load(src, 'low').catch(() => {}).finally(() => { running--; pump(); });
    }
  }
  function warm(product) {
    if (navigator.connection?.saveData) return;
    for (const variant of product.variants) {
      const src = url(variant, product);
      if (!queued.has(src) && !cache.has(src)) { queued.add(src); queue.push(src); }
    }
    pump();
  }
  async function swap(img, src, alt) {
    const token = {}; pending.set(img, token);
    const frame = img.parentElement;
    frame.classList.remove('color-image-error');
    frame.setAttribute('aria-busy', 'true');
    try {
      await load(src);
      if (pending.get(img) !== token) return;
      img.src = src; img.alt = alt;
    } catch {
      if (pending.get(img) === token) frame.classList.add('color-image-error');
    } finally {
      if (pending.get(img) === token) frame.setAttribute('aria-busy', 'false');
    }
  }
  let observer;
  function observe(products) {
    observer?.disconnect();
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        const product = products.find(p => String(p.id) === entry.target.dataset.card);
        if (product) warm(product);
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '100px' });
    document.querySelectorAll('[data-card]').forEach(card => observer.observe(card));
  }
  window.ColorImages = { url, load, warm, swap, observe };
})();
