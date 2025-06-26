(() => {
  'use strict'


  const forms = document.querySelectorAll('.needs-validation')


  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

document.querySelectorAll('.filter').forEach(filter => {
  filter.addEventListener('click', () => {
    const category = filter.getAttribute('data-category');
    window.location.href = `/categories/${category}`;
  });
});
