const photos = document.querySelectorAll(".preview-photo");
const modal = document.querySelector("#galleryModal");
const closeButton = modal.querySelector(".close");
const modalImage = document.querySelector("#modalImage");
const modalType = document.querySelector("#modalType");
const modalTitle = document.querySelector("#modalTitle");
const modalDate = document.querySelector("#modalDate");
const modalDescription = document.querySelector("#modalDescription");

photos.forEach((photo) => {
  photo.addEventListener("click", () => {
    modalImage.src = photo.dataset.image;
    modalImage.alt = photo.dataset.title;
    modalType.textContent = photo.dataset.type;
    modalTitle.textContent = photo.dataset.title;
    modalDate.textContent = photo.dataset.date;
    modalDescription.textContent = photo.dataset.description;
    modal.showModal();
  });
});

closeButton.addEventListener("click", () => {
  modal.close();
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.open) {
    modal.close();
  }
});
