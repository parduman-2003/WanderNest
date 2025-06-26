const profilePicInput = document.getElementById('profilePic');
const profilePreview = document.getElementById('profilePreview');
const profileInitial = document.getElementById('profileInitial');

profilePicInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profileInitial?.remove();
      const oldImg = profilePreview.querySelector('img');
      if (oldImg) oldImg.remove();

      const img = document.createElement('img');
      img.src = e.target.result;
      profilePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});