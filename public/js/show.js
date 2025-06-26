
function calculateSummary() {
    const checkin = new Date(document.getElementById('checkin').value);
    const checkout = new Date(document.getElementById('checkout').value);
    const pricePerNight = parseFloat(document.getElementById('pricePerNight').innerText);
    const taxRate = 0.1575;

    const nights = (checkout - checkin) / (1000 * 60 * 60 * 24);

    if (isNaN(nights) || nights <= 0) {
        // Reset UI
        document.getElementById('nightsCalc').innerText = "0";
        document.getElementById('subtotal').innerText = "0";
        document.getElementById('taxes').innerText = "0";
        document.getElementById('totalAmount').innerText = "0";
        return;
    }

    // Calculate amounts
    const subtotal = pricePerNight * nights;
    const taxes = Math.round(subtotal * taxRate);
    const total = subtotal + taxes;

    // Update UI
    document.getElementById('nightsCalc').innerText = nights;
    document.getElementById('subtotal').innerText = subtotal.toLocaleString("en-IN", { maximumFractionDigits: 2 });
    document.getElementById('taxes').innerText = taxes.toLocaleString("en-IN");
    document.getElementById('totalAmount').innerText = total.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

document.addEventListener('DOMContentLoaded', function () {
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsMenu = document.getElementById('settingsMenu');

    if (settingsToggle && settingsMenu) {
        settingsToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const isVisible = settingsMenu.style.display === 'block';
            settingsMenu.style.display = isVisible ? 'none' : 'block';
        });

        window.addEventListener('click', function (e) {
            if (!settingsMenu.contains(e.target) && e.target !== settingsToggle) {
                settingsMenu.style.display = 'none';
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    // === Toggle Description ===
    const toggleBtn = document.getElementById("toggleDescBtn");
    const shortDesc = document.getElementById("shortDesc");
    const fullDesc = document.getElementById("fullDesc");

    if (toggleBtn && shortDesc && fullDesc) {
        toggleBtn.addEventListener("click", () => {
            const isExpanded = getComputedStyle(fullDesc).display !== "none";
            if (isExpanded) {
                fullDesc.style.display = "none";
                shortDesc.style.display = "block";
                toggleBtn.textContent = "Show More";
            } else {
                fullDesc.style.display = "block";
                shortDesc.style.display = "none";
                toggleBtn.textContent = "Show Less";
            }
        });
    }

    // === Toggle Review Form ===
    const toggleReviewBtn = document.getElementById("toggleReviewFormBtn");
    const reviewForm = document.getElementById("reviewFormContainer");

    if (toggleReviewBtn && reviewForm) {
        toggleReviewBtn.addEventListener("click", () => {
            const isVisible = getComputedStyle(reviewForm).display !== "none";
            reviewForm.style.display = isVisible ? "none" : "block";
            toggleReviewBtn.textContent = isVisible ? "Leave a Review" : "Hide Review Form";
        });
    }

    // === Show More in Review Modal ===
    const modal = new bootstrap.Modal(document.getElementById("reviewModal"));
    const modalBody = document.getElementById("modalReviewContent");

    document.querySelectorAll(".show-more-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const fullText = btn.getAttribute("data-comment");
            modalBody.textContent = fullText;
            modal.show();
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const listingToggle = document.getElementById('listingSettingsToggle');
    const listingMenu = document.getElementById('listingSettingsMenu');

    if (listingToggle && listingMenu) {
        listingToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            listingMenu.style.display = listingMenu.style.display === 'block' ? 'none' : 'block';
        });

        window.addEventListener('click', function (e) {
            if (!listingMenu.contains(e.target) && e.target !== listingToggle) {
                listingMenu.style.display = 'none';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                listingMenu.style.display = 'none';
            }
        });
    }
});