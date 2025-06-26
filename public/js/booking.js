document.querySelectorAll(".cancel-booking-form").forEach(form => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    Swal.fire({
      title: "Cancel this booking?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF385C",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, cancel it!"
    }).then((result) => {
      if (result.isConfirmed) {
        form.submit();
      }
    });
  });
});