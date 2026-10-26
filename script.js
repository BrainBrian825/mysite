const photos = [...document.querySelectorAll('[data-photo]')];
const dialog = document.querySelector('.lightbox');
const viewerImage = document.querySelector('.lightbox-image');
const viewerDescription = document.querySelector('#lightbox-description');
let activePhoto = 0;
let returnFocus = null;

// Image links still open the originals if JavaScript or dialog support is absent.
if (typeof dialog.showModal === 'function') {
  document.querySelector('.gallery-hint').hidden = false;

  function showPhoto(index) {
    activePhoto = (index + photos.length) % photos.length;
    const photo = photos[activePhoto];
    const original = photo.querySelector('img');
    viewerImage.src = photo.getAttribute('href');
    viewerImage.alt = original.alt;
    viewerImage.width = original.width;
    viewerImage.height = original.height;
    viewerDescription.textContent = photo.dataset.type;
  }

  photos.forEach(photo => {
    photo.addEventListener('click', event => {
      // Preserve standard browser behavior for modified clicks and new tabs.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      returnFocus = photo;
      showPhoto(photos.indexOf(photo));
      dialog.showModal();
    });
  });

  document.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  document.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(activePhoto - 1));
  document.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(activePhoto + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(activePhoto + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => {
    viewerImage.removeAttribute('src');
    if (returnFocus) returnFocus.focus({ preventScroll: true });
  });
}
