document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const dropdowns = document.querySelectorAll(".dropdown");
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
    const normalLinks = document.querySelectorAll(".nav-links a:not(.dropdown-toggle)");

    // Abrir / fechar menu hamburguer
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Dropdowns no mobile
    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
            if (window.innerWidth <= 760) {
                e.preventDefault();

                const parentDropdown = toggle.closest(".dropdown");
                const isActive = parentDropdown.classList.contains("active");

                // Fecha todos primeiro
                dropdowns.forEach((dropdown) => {
                    dropdown.classList.remove("active");
                });

                // Reabre só o clicado, se antes estava fechado
                if (!isActive) {
                    parentDropdown.classList.add("active");
                }
            }
        });
    });

    // Fechar menu mobile ao clicar num link normal
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

    // Fechar menu e dropdowns ao redimensionar para desktop
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

    // Fechar menu ao clicar fora dele no mobile
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

    // Scroll to top button
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    if (scrollToTopBtn) {
        // Show button when scrolled down
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = "flex";
            } else {
                scrollToTopBtn.style.display = "none";
            }
        });

        // Scroll to top when clicked
        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // Testimonial slider for testemunhos.html
    const cards = document.querySelectorAll(".testimonial-card");
    const dotsContainer = document.getElementById("testimonialDots");

    if (cards.length > 0 && dotsContainer) {
        let current = 0;

        // Criar dots
        cards.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.className = "testimonial-dot";
            if (index === 0) dot.classList.add("active");

            dot.addEventListener("click", () => {
                current = index;
                updateSlider();
            });

            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll(".testimonial-dot");

        function updateSlider() {
            cards.forEach((card, index) => {
                card.style.opacity = "0";
                card.style.transform = "translateY(10px)";

                setTimeout(() => {
                    card.classList.toggle("active", index === current);
                    if (index === current) {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }
                }, 150);
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === current);
            });
        }

        // Auto slide
        setInterval(() => {
            current = (current + 1) % cards.length;
            updateSlider();
        }, 5000);
    }
});