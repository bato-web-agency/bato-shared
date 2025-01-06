document.addEventListener("DOMContentLoaded", () => {
	const menu = document.createElement("aside");

    menu.setAttribute("id", "contact-menu");
    menu.setAttribute("aria-label", "Bato Web Agency - Contact Us");
    menu.classList.add("contact-menu");

    menu.innerHTML = `
        <input type="checkbox" id="contact-menu-trigger">

        <label tabindex="0" role="button" for="contact-menu-trigger" class="contact-menu__toggle">
            <div class="contact-menu__trigger">
                <img src="https://bato-web-agency.github.io/bato-shared/img/contact-menu/contact.svg" alt="Open Menu">
                <img src="https://bato-web-agency.github.io/bato-shared/img/contact-menu/close.svg" alt="Close Menu">
            </div>

            <div class="contact-menu__label">Contact Us</div>
        </label>

        <ul class="contact-menu__list">
            <li>
                <a href="https://bato.dev/" target="_blank" title="Bato Web Agency - Website" class="contact-menu__link">
                    <img src="https://bato-web-agency.github.io/bato-shared/img/contact-menu/website.svg" alt="Bato Web Agency - Website">
                </a>
            </li>
            <li>
                <a href="mailto:hello@bato.dev" title="Bato Web Agency - Email" class="contact-menu__link">
                    <img src="https://bato-web-agency.github.io/bato-shared/img/contact-menu/email.svg" alt="Bato Web Agency - Email">
                </a>
            </li>
            <li>
                <a href="https://dribbble.com/batowebagency" target="_blank" title="Bato Web Agency - Dribbble" class="contact-menu__link">
                    <img src="https://bato-web-agency.github.io/bato-shared/img/contact-menu/dribbble.svg" alt="Bato Web Agency - Dribbble">
                </a>
            </li>
        </ul>
    `;

    document.body.appendChild(menu);
});
