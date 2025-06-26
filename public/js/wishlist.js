document.querySelectorAll(".wishlist-remove-form").forEach(form => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    Swal.fire({
      title: "Remove from Wishlist?",
      text: "Are you sure you want to remove this listing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF385C",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, remove it!"
    }).then((result) => {
      if (result.isConfirmed) {
        form.submit();
      }
    });
  });
});