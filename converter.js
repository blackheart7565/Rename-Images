function convertAndDownloadImage(files) {
	if (files.length === 0) {
		console.log("No file selected.");
		return;
	}

	const file = files[0];
	const reader = new FileReader();

	reader.onload = function (event) {
		const img = new Image();
		img.onload = function () {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);

			// Convert the image to JPEG format
			const newDataURI = canvas.toDataURL('image/jpeg');

			// Create a link element to download the converted image
			const downloadLink = document.createElement('a');
			downloadLink.href = newDataURI;
			downloadLink.download = 'converted_image.jpg'; // Change the filename if needed
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		};
		img.src = event.target.result;
	};

	reader.readAsDataURL(file);
}
