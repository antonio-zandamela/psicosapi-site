document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".testimonial-card");
    const dotsContainer = document.getElementById("testimonialDots");

    if (cards.length > 0 && dotsContainer) {
        let current = 0;

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

        setInterval(() => {
            current = (current + 1) % cards.length;
            updateSlider();
        }, 5000);
    }
});