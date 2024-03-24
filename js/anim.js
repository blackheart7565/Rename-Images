const progress = document.querySelectorAll("#progress-rename i");

progress.forEach((item, index) => {
	if (progress.length / 2 <= index) {
		item.style.animationDelay = `-0.${progress.length - index + 1}s`;
	} else {
		item.style.animationDelay = `0.${index + 2}s`;
	}
});