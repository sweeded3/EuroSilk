const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const header = document.querySelector(".site-header");
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mainNav = document.getElementById("mainNav");
const accordionHeaders = document.querySelectorAll(".accordion-header");
const revealItems = document.querySelectorAll(".reveal");
const fileInput = document.getElementById("file");
const fileName = document.getElementById("file-name");
const feedbackForm = document.getElementById("feedbackForm");
const formStatus = document.getElementById("form-status");
const emailFallback = document.getElementById("emailFallback");

const WHATSAPP_PHONE = "996221070666";
const CONTACT_EMAIL = "partsworldkz@yandex.ru";

const setMenuState = (isOpen) => {
    if (!mobileMenuBtn || !mainNav) {
        return;
    }

    mainNav.classList.toggle("active", isOpen);
    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
};

if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener("click", () => {
        setMenuState(!mainNav.classList.contains("active"));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });

    document.addEventListener("click", (event) => {
        if (!mainNav.classList.contains("active")) {
            return;
        }

        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        if (!target.closest(".header-inner")) {
            setMenuState(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1080) {
            setMenuState(false);
        }
    });
}

const updateAccordionHeight = (button) => {
    const contentId = button.getAttribute("aria-controls");
    const content = contentId ? document.getElementById(contentId) : null;
    if (!content) {
        return;
    }

    if (button.getAttribute("aria-expanded") === "true") {
        content.style.maxHeight = `${content.scrollHeight}px`;
    } else {
        content.style.maxHeight = "0px";
    }
};

accordionHeaders.forEach((button) => {
    updateAccordionHeight(button);
    button.addEventListener("click", () => {
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
        updateAccordionHeight(button);
    });
});

window.addEventListener("resize", () => {
    accordionHeaders.forEach(updateAccordionHeight);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
        const href = this.getAttribute("href");
        if (!href || href === "#") {
            return;
        }

        const target = document.querySelector(href);
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "start" });
    });
});

if (fileInput && fileName) {
    fileInput.addEventListener("change", () => {
        fileName.textContent = fileInput.files && fileInput.files.length > 0
            ? `Выбран файл: ${fileInput.files[0].name}`
            : "";
    });
}

const getValue = (id) => {
    const field = document.getElementById(id);
    return field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement ? field.value.trim() : "";
};

const buildRequestText = () => {
    const name = getValue("name");
    const phone = getValue("phone");
    const vin = getValue("vin").toUpperCase();
    const message = getValue("message");
    const fileText = fileInput && fileInput.files && fileInput.files.length > 0
        ? `Файл: ${fileInput.files[0].name} (прикреплю вручную)`
        : "";

    return [
        "Здравствуйте! Хочу уточнить наличие и цену запчастей.",
        name ? `Имя: ${name}` : "",
        phone ? `Телефон: ${phone}` : "",
        vin ? `VIN: ${vin}` : "",
        message ? `Сообщение: ${message}` : "",
        fileText,
    ].filter(Boolean).join("\n");
};

if (feedbackForm) {
    feedbackForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!feedbackForm.checkValidity()) {
            feedbackForm.reportValidity();
            return;
        }

        const text = buildRequestText();
        const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
        const whatsappWindow = window.open(url, "_blank");

        if (whatsappWindow) {
            whatsappWindow.opener = null;
            if (formStatus) {
                formStatus.textContent = "WhatsApp открыт. Если выбран Excel-файл, прикрепите его к сообщению вручную.";
            }
        } else {
            window.location.href = url;
        }
    });
}

if (emailFallback) {
    emailFallback.addEventListener("click", (event) => {
        event.preventDefault();
        const subject = encodeURIComponent("Запрос запчастей EURO SILK");
        const body = encodeURIComponent(buildRequestText());
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });
}

if (!prefersReducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("visible"));
}

let scrollFrame = null;

const updateHeaderState = () => {
    scrollFrame = null;
    if (!header) {
        return;
    }

    header.classList.toggle("is-condensed", window.scrollY > 20);
};

window.addEventListener("scroll", () => {
    if (scrollFrame !== null) {
        return;
    }

    scrollFrame = window.requestAnimationFrame(updateHeaderState);
}, { passive: true });

updateHeaderState();
