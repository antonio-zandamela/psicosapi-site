document.addEventListener("DOMContentLoaded", () => {
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