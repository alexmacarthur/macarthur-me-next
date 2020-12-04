export function createObserver (imageElement, callback: () => any) {
  const options = {
    rootMargin: '100px',
    threshold: 1.0
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(imageElement);
        callback();
      }
    });
  }, options);

  return {
    observe: () => observer.observe(imageElement),
    kill: () => observer.observe(imageElement)
  }
}

export function activateImage(imageElement, loadCallback) {
  imageElement.addEventListener('load', loadCallback)
  imageElement.src = imageElement.dataset.lazySrc;
}
