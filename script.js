/* ==========================================
   OCS - OSÉ CHIMISTE SERVICE
   JavaScript principal
========================================== */

/* 1. MENU DE NAVIGATION MOBILE */
const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", function () {
        const menuIsOpen = navigation.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", menuIsOpen);
        menuToggle.setAttribute(
            "aria-label",
            menuIsOpen ? "Fermer le menu" : "Ouvrir le menu"
        );
        menuToggle.textContent = menuIsOpen ? "✕" : "☰";
    });

    // Fermer le menu après avoir sélectionné une rubrique
    navigation.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Ouvrir le menu");
            menuToggle.textContent = "☰";
        });
    });

    // Fermer le menu lorsqu'on revient sur grand écran
    window.addEventListener("resize", function () {
        if (window.innerWidth > 760) {
            navigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Ouvrir le menu");
            menuToggle.textContent = "☰";
        }
    });
}

/* 2. ANNÉE AUTOMATIQUE DANS LE PIED DE PAGE */
const currentYear = document.getElementById("current-year");
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* ==========================================
   PAGE RÉALISATIONS : FILTRES DE LA GALERIE
========================================== */
const portfolioFilters = document.querySelectorAll(".portfolio-filter");
const portfolioCards = document.querySelectorAll(".portfolio-card");
const portfolioEmpty = document.getElementById("portfolio-empty");

if (portfolioFilters.length > 0 && portfolioCards.length > 0) {
    portfolioFilters.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedCategory = button.dataset.filter;
            let visibleCards = 0;

            // Mettre à jour le bouton actif
            portfolioFilters.forEach(function (filterButton) {
                const isActive = filterButton === button;
                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute("aria-pressed", isActive);
            });

            // Afficher uniquement les réalisations choisies
            portfolioCards.forEach(function (card) {
                const cardCategory = card.dataset.category;
                const shouldDisplay =
                    selectedCategory === "all" ||
                    selectedCategory === cardCategory;

                card.hidden = !shouldDisplay;

                if (shouldDisplay) {
                    visibleCards++;
                }
            });

            // Afficher un message si aucune carte ne correspond
            if (portfolioEmpty) {
                portfolioEmpty.hidden = visibleCards > 0;
            }
        });
    });
}

/* ==========================================
   OCS - FORMULAIRE DE CONTACT
   Envoi des demandes via WhatsApp
========================================== */

const OCS_WHATSAPP = "22655198680";

const contactForm = document.getElementById("contact-form");
const serviceError = document.getElementById("service-error");
const selectedServicesSummary = document.getElementById("selected-services-summary");
const contactFormStatus = document.getElementById("contact-form-status");

if (contactForm) {
    const serviceCheckboxes = contactForm.querySelectorAll('input[name="services"]');

    /* Présélectionner le service depuis l'URL */
    const serviceParameters = new URLSearchParams(window.location.search);
    const serviceFromURL = serviceParameters.get("service");

    const serviceMapping = {
    baches: "Location de bâches climatisées",
    traiteur: "Service traiteur",
    decoration: "Décoration événementielle",
    jus: "Jus naturels",
};


    if (serviceFromURL && serviceMapping[serviceFromURL]) {
        serviceCheckboxes.forEach(function (checkbox) {
            if (checkbox.value === serviceMapping[serviceFromURL]) {
                checkbox.checked = true;
            }
        });
    }

    /* Mettre à jour le récapitulatif */
    function updateServiceSummary() {
        const selectedServices = Array.from(serviceCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        if (selectedServices.length > 0) {
            selectedServicesSummary.textContent = "Services choisis : " + selectedServices.join(", ");
            if (serviceError) {
                serviceError.hidden = true;
            }
        } else {
            selectedServicesSummary.textContent = "Aucun service sélectionné pour le moment.";
        }
    }

    serviceCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", updateServiceSummary);
    });

    updateServiceSummary();

    /* Empêcher de choisir une date passée */
    const eventDateField = document.getElementById("date-evenement");
    if (eventDateField) {
        const today = new Date();
        const localToday = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        eventDateField.min = localToday;
    }

    /* Traitement du formulaire à la soumission */
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const selectedServices = Array.from(serviceCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        if (selectedServices.length === 0) {
            if (serviceError) {
                serviceError.hidden = false;
                serviceError.textContent = "Veuillez sélectionner au moins un service.";
            }
            if (serviceCheckboxes.length > 0) {
                serviceCheckboxes[0].focus();
            }
            return;
        }

        const nom = document.getElementById("nom").value.trim();
        const telephone = document.getElementById("telephone").value.trim();
        const email = document.getElementById("email").value.trim();
        const typeEvenement = document.getElementById("type-evenement").value;
        const dateEvenement = document.getElementById("date-evenement").value;
        const ville = document.getElementById("ville").value;
        const lieu = document.getElementById("lieu").value.trim();
        const invites = document.getElementById("invites").value;
        const budget = document.getElementById("budget").value;
        const details = document.getElementById("details").value.trim();

        const servicesListText = selectedServices.map(service => "- " + service).join("\n");

        const message = [
            "Bonjour OCS - Osé Chimiste Service !",
            "",
            "Je souhaite obtenir un devis pour mon événement.",
            "",
            "===== MES COORDONNÉES =====",
            "Nom : " + nom,
            "Téléphone : " + telephone,
            "E-mail : " + (email || "Non renseigné"),
            "",
            "===== MON ÉVÉNEMENT =====",
            "Type : " + typeEvenement,
            "Date : " + dateEvenement,
            "Ville : " + ville,
            "Lieu précis : " + lieu,
            "Nombre d'invités : " + (invites || "Non renseigné"),
            "",
            "===== SERVICES SOUHAITÉS =====",
            servicesListText,
            "",
            "===== BUDGET ET PRÉCISIONS =====",
            "Budget envisagé : " + (budget || "À discuter"),
            "Détails : " + (details || "Aucune précision supplémentaire"),
            "",
            "Merci de me contacter pour discuter de ma demande.",
            "",
            "Message envoyé depuis le site web d'OCS."
        ].join("\n");

        const whatsappURL = "https://wa.me/" + OCS_WHATSAPP + "?text=" + encodeURIComponent(message);

        if (contactFormStatus) {
            contactFormStatus.textContent = "Votre demande est préparée. Ouverture de WhatsApp...";
        }

        // Méthode propre pour ouvrir WhatsApp sans faire remonter la page en haut
        const tempLink = document.createElement('a');
        tempLink.href = whatsappURL;
        tempLink.target = '_blank';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("OCS : le JavaScript est chargé.");
});