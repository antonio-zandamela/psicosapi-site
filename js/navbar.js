document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const dropdowns = document.querySelectorAll(".dropdown");
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
    const normalLinks = document.querySelectorAll(".nav-links a:not(.dropdown-toggle)");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
            if (window.innerWidth <= 760) {
                e.preventDefault();

                const parentDropdown = toggle.closest(".dropdown");
                const isActive = parentDropdown.classList.contains("active");

                dropdowns.forEach((dropdown) => {
                    dropdown.classList.remove("active");
                });

                if (!isActive) {
                    parentDropdown.classList.add("active");
                }
            }
        });
    });

    normalLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 760 && navLinks) {
                navLinks.classList.remove("active");

                dropdowns.forEach((dropdown) => {
                    dropdown.classList.remove("active");
                });
            }
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            if (navLinks) {
                navLinks.classList.remove("active");
            }

            dropdowns.forEach((dropdown) => {
                dropdown.classList.remove("active");
            });
        }
    });

    document.addEventListener("click", (e) => {
        if (window.innerWidth <= 760) {
            const clickedInsideNavbar = e.target.closest(".navbar");

            if (!clickedInsideNavbar) {
                if (navLinks) {
                    navLinks.classList.remove("active");
                }

                dropdowns.forEach((dropdown) => {
                    dropdown.classList.remove("active");
                });
            }
        }
    });

    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    if (scrollToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = "flex";
            } else {
                scrollToTopBtn.style.display = "none";
            }
        });

        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});