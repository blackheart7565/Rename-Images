'use strict';

/**
 * Функция конвертирующая байты в нужный формат в 
 * B, KB, MB, GB, TB
 * @param {Number} bytes 
 * @returns 
 */
export const formatFileSize = (bytes) => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return size.toFixed(2) + ' ' + units[unitIndex];
};

/**
 *  Функция отображает элемент картинки и деталей
 * @param {string | ArrayBuffer} src 
 * @param {String} name 
 * @param {Number} size 
 * @param {String} format 
 * @returns HTML Image Item Element
 */

export const displayItemImage = (src, name, size, format) => {
	const li = document.createElement("li");
	li.classList.add("rename-images__display-images-item");

	const divImage = document.createElement("div");
	divImage.classList.add("rename-images__display-image");
	const img = document.createElement("img");
	img.src = src;
	divImage.appendChild(img);

	const divContent = document.createElement("div");
	divContent.classList.add("rename-images__display-images-content");
	const pName = document.createElement("p");
	pName.textContent = name;
	pName.classList.add("rename-images__display-images-name");
	const pMemory = document.createElement("p");
	pMemory.textContent = size;
	pMemory.classList.add("rename-images__display-images-memory");
	const pFormat = document.createElement("p");
	pFormat.textContent = format;
	pFormat.classList.add("rename-images__display-images-format");
	divContent.appendChild(pName);
	divContent.appendChild(pMemory);
	divContent.appendChild(pFormat);

	li.appendChild(divImage);
	li.appendChild(divContent);
	return li;
};

export const setTheme = (e) => {
	e.stopPropagation();
	const theme = document.body.getAttribute("data-theme");
	if (theme === "dark") {
		document.body.setAttribute("data-theme", "light");
		e.currentTarget.setAttribute("data-theme", "light");
	} else {
		document.body.setAttribute("data-theme", "dark");
		e.currentTarget.setAttribute("data-theme", "dark");
	}
};

export const renameImages = (images, newNameImage) => {
	const newImages = [];
	let newName = "";

	images.forEach(({ image }, index) => {

		if (newNameImage) {
			if (!isNaN(newNameImage)) {
				newName = parseInt(newNameImage) + index;
			} else {
				newName = newNameImage + "_" + (index + 1);
			}
		} else {
			newName = index + 1;
		}

		const newFile = new File([image], `${newName}.${image.name.split(".").pop()}`, { type: image.type });
		Object.defineProperty(newFile, 'lastModified', {
			value: image.lastModified,
			writable: false,
		});
		newImages.push(newFile);
	});
	return newImages;
};

export const downloadZipImage = (images) => {
	const zip = new JSZip();

	images.forEach(image => {
		const nameFile = `${image.name.split(".")[0]}.${image.name.split(".").pop()}`;
		zip.file(nameFile, image);
	});

	zip.generateAsync({ type: "blob" })
		.then(content => {
			const url = URL.createObjectURL(content);
			const a = document.createElement("a");
			a.href = url;
			a.download = "images.zip";
			a.click();
			setTimeout(() => {
				a.remove();
				window.URL.revokeObjectURL(url);
			}, 0);
		}).catch(error => {
			console.error("Error generating zip:", error);
		});
};

export const readFileAsDataURL = (image) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => resolve(event.target.result);
		reader.onerror = (error) => reject(error);
		reader.readAsDataURL(image);
	});
};

export const convertToJPG = (image) => {
	return new Promise((resolve, reject) => {
		if (!window.FileReader) {
			console.error("FileReader не поддерживается");
			reject("FileReader не поддерживается");
			return;
		}

		const nameImage = image.name.split(".")[0];

		const reader = new FileReader();

		reader.addEventListener("load", (event) => {
			const imageUrl = event.target.result;
			const mimeType = "image/jpeg";
			const image = new Image();
			image.src = imageUrl;

			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			image.onload = function () {
				canvas.width = image.width;
				canvas.height = image.height;
				ctx.drawImage(image, 0, 0);

				// canvas.toBlob((blob) => {
				// 	const jpgImage = new File([blob], "image.jpg", {
				// 		type: "image/jpeg"
				// 	});
				// 	resolve(jpgImage);
				// }, "image/jpeg", 1.0);
				const jpgImage = canvas.toDataURL(mimeType);


				// Декодируем строку Base64 в массив байтов
				const byteCharacters = atob(jpgImage.split(',')[1]);
				const byteNumbers = new Array(byteCharacters.length);
				for (let i = 0; i < byteCharacters.length; i++) {
					byteNumbers[i] = byteCharacters.charCodeAt(i);
				}
				const byteArray = new Uint8Array(byteNumbers);
				const blob = new Blob([byteArray], { type: mimeType });
				const file = new File([blob], `${nameImage}.jpg`, { type: mimeType });

				resolve(file);
			};

			image.onerror = reject;
		});

		reader.onerror = reject;
		reader.readAsDataURL(image);
	});
};

export const getExtensionFile = (value) => {
	return value.split(".").pop();
};