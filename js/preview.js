document.addEventListener("DOMContentLoaded", () => {
	document.documentElement.style.overflow = "hidden";
	document.body.style.overflow = "hidden";

	const preview = document.querySelector(".preview");

	if (preview) {
		const isLegacyGridPreview = window.location.href.includes("fullcpgrid");
		const isEmbeddedPreview = window.parent !== window;

		if (isEmbeddedPreview && !isLegacyGridPreview) {
			preview.style.display = "none";

			document.documentElement.style.overflow = "";
			document.body.style.overflow = "";
		}
	}
});
