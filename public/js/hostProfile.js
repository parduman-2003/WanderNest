document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-details-btn");
    const moreDetails = document.getElementById("more-details");

    if (toggleBtn && moreDetails) {
        toggleBtn.addEventListener("click", () => {
            const isHidden = moreDetails.style.display === "none";
            moreDetails.style.display = isHidden ? "block" : "none";
            toggleBtn.textContent = isHidden ? "See Less" : "See More";
        });
    }

    const toggleTexts = document.querySelectorAll(".toggle-text");

    toggleTexts.forEach(span => {
        span.addEventListener("click", function () {
            const paragraph = this.closest(".review-comment");
            const fullText = paragraph.getAttribute("data-full");
            if (this.innerText === "Show More") {
                paragraph.innerHTML = fullText + ' <span class="toggle-text" style="color: blue; cursor: pointer;">Show Less</span>';
            } else {
                const shortText = fullText.slice(0, 50) + '...';
                paragraph.innerHTML = shortText + ' <span class="toggle-text" style="color: blue; cursor: pointer;">Show More</span>';
            }
            paragraph.querySelector(".toggle-text").addEventListener("click", arguments.callee);
        });
    });
});