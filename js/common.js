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