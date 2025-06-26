const triggerTabList = document.querySelectorAll('#notificationTabs button');
triggerTabList.forEach(triggerEl => {
  const tabTrigger = new bootstrap.Tab(triggerEl);

  triggerEl.addEventListener('click', event => {
    event.preventDefault();
    tabTrigger.show();
  });
});