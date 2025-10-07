function setupSwitcher (root) {
    const switcher = document.createElement('div');

    switcher.setAttribute('tabindex', '1');
    switcher.classList.add('theme-switcher');

    switcher.innerHTML = `
        <div class="theme-switcher-slider">
            <div class="theme-switcher-cell">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19.14 19.14L19.01 19.01M19.01 4.99L19.14 4.86L19.01 4.99ZM4.86 19.14L4.99 19.01L4.86 19.14ZM12 2.08V2V2.08ZM12 22V21.92V22ZM2.08 12H2H2.08ZM22 12H21.92H22ZM4.99 4.99L4.86 4.86L4.99 4.99Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="theme-switcher-cell">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.53 15.93C21.37 15.66 20.92 15.24 19.8 15.44C19.18 15.55 18.55 15.6 17.92 15.57C15.59 15.47 13.48 14.4 12.01 12.75C10.71 11.3 9.90995 9.40999 9.89995 7.36999C9.89995 6.22999 10.12 5.12999 10.57 4.08999C11.01 3.07999 10.7 2.54999 10.48 2.32999C10.25 2.09999 9.70995 1.77999 8.64995 2.21999C4.55995 3.93999 2.02995 8.03999 2.32995 12.43C2.62995 16.56 5.52995 20.09 9.36995 21.42C10.29 21.74 11.26 21.93 12.26 21.97C12.42 21.98 12.58 21.99 12.74 21.99C16.09 21.99 19.23 20.41 21.21 17.72C21.88 16.79 21.7 16.2 21.53 15.93Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke="#171717" fill="#171717"/>
                </svg>
            </div>
        </div>
    `;

    switcher.addEventListener('click', () => {
        document.body.classList.toggle('light');

        const isLight = document.body.classList.contains('light');

        try {
            sessionStorage.setItem('bato-theme', isLight ? 'light' : 'dark');
        } catch (error) {
            console.error(`An error occurred while saving the theme: ${error}`);
        }
    });

    root.appendChild(switcher);
}

document.addEventListener('DOMContentLoaded', () => {
	const switcher = document.querySelector('[data-switcher]');

    if (!switcher) return;

    try {
        const savedTheme = sessionStorage.getItem('bato-theme');

        if (savedTheme === 'light') {
            document.body.classList.add('light');
        } else {
            document.body.classList.remove('light');
        }
    } catch (error) {
        console.error(`An error occurred while reading the theme: ${error}`);
    }

    setupSwitcher(switcher);
});
