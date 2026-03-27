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

    // Popup functionality for contact forms
    const forms = document.querySelectorAll(".ajax-contact-form");

    const popup = document.getElementById("customPopup");
    const popupBox = popup?.querySelector(".custom-popup-box");
    const popupTitle = document.getElementById("customPopupTitle");
    const popupText = document.getElementById("customPopupText");
    const popupBtn = document.getElementById("customPopupBtn");
    const popupClose = document.getElementById("customPopupClose");
    const popupIcon = document.getElementById("customPopupIcon");
    let popupTimeout = null;

    function closePopup() {
        popup?.classList.remove("active");
        if (popupTimeout) {
            clearTimeout(popupTimeout);
            popupTimeout = null;
        }
    }

    function showPopup(success, message) {
        if (!popup || !popupBox || !popupTitle || !popupText || !popupIcon) return;

        popupBox.classList.remove("error");

        if (success) {
            popupTitle.textContent = "Mensagem enviada";
            popupText.textContent = message || "Recebemos o seu contacto com sucesso.";
            popupIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
        } else {
            popupTitle.textContent = "Não foi possível enviar";
            popupText.textContent = message || "Ocorreu um erro ao enviar a mensagem.";
            popupIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            popupBox.classList.add("error");
        }

        popup.classList.add("active");

        if (popupTimeout) {
            clearTimeout(popupTimeout);
        }

        popupTimeout = setTimeout(closePopup, 3000);
    }

    function closePopup() {
        popup?.classList.remove("active");
    }

    popupBtn?.addEventListener("click", closePopup);
    popupClose?.addEventListener("click", closePopup);

    popup?.addEventListener("click", (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    forms.forEach((form) => {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn?.textContent || "Enviar Mensagem";

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "A enviar...";
            }

            try {
                const formData = new FormData(form);

                const response = await fetch(form.action, {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    showPopup(true, data.message);
                    form.reset();
                } else {
                    showPopup(false, data.message);
                }
            } catch (error) {
                showPopup(false, "Ocorreu um erro de ligação. Tente novamente.");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    });
});