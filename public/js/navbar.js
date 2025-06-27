document.addEventListener('DOMContentLoaded', function () {
    const navbarToggle = document.getElementById('navbarSettingsToggle');
    const navbarMenu = document.getElementById('navbarSettingsMenu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            navbarMenu.style.display = navbarMenu.style.display === 'block' ? 'none' : 'block';
        });

        window.addEventListener('click', function (e) {
            if (!navbarMenu.contains(e.target) && e.target !== navbarToggle) {
                navbarMenu.style.display = 'none';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navbarMenu.style.display = 'none';
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("mobileMenuToggle");
    const menu = document.getElementById("mobileDropdownMenu");
  
    if (toggle) {
      toggle.addEventListener("click", () => {
        menu.style.display = menu.style.display === "block" ? "none" : "block";
      });
  
      // Optional: Hide when clicking outside
      document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && e.target !== toggle) {
          menu.style.display = "none";
        }
      });
    }
  });
  