document.addEventListener("DOMContentLoaded", () => {
	const preloader = document.querySelector(".preloader");

	if (preloader) {
		if (!window.location.href.includes("fullcpgrid")) {
			preloader.style.display = "none";
		}
	}
});
