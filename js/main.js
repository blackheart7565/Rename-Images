'use strict';
import {
	convertToJPG,
	displayItemImage,
	downloadZipImage,
	formatFileSize,
	getExtensionFile,
	readFileAsDataURL,
	renameImages,
	setTheme
} from "./common.js";

const dragImages = document.getElementById("drag-images");
const drag = document.getElementById("drag");
const displayContainer = document.getElementById("display-container");
const displayListImages = document.getElementById("display-list-images");
const displayNewListImages = document.getElementById("display-new-list-images");
const countListImages = document.getElementById("count-list-images");
const countNewListImages = document.getElementById("count-new-list-images");
const themeBtn = document.getElementById("theme-btn");
const renameBtn = document.getElementById("rename-btn");
const downloadBtn = document.getElementById("download-btn");
const dragLoader = document.getElementById("drag-loader");
const renameProgress = document.getElementById("progress-rename");

const enterStartCount = document.getElementById("enter-start-count");
const isEnterStartCount = document.getElementById("is-enter-start-count");
const isEnterCovertImg = document.getElementById("is-enter-covert-img");

let images = [];
let newImages = [];
let isRename = false;
let isConvert = false;

const onDragOver = (e) => {
	e.preventDefault();
	drag.classList.add("drag-visible");
};

const onDragLeave = (e) => {
	drag.classList.remove("drag-visible");
};

const onDrop = (e) => {
	e.preventDefault();
	drag.classList.remove("drag-visible");
	dragImages.classList.replace("visible", "hidden");
	displayContainer.classList.replace("hidden", "visible");
	dragLoader.classList.add("loader-active");

	const dataTransfer = e.dataTransfer.items;

	if (dataTransfer) {
		for (let i = 0; i < dataTransfer.length; i++) {
			const element = dataTransfer[i];
			if (element.kind !== "file") return;

			if (!element.type.match("image.*")) {
				console.log("not image");
				return;
			};

			const image = element.getAsFile();
			const creationDate = new Date(image.lastModified);
			images.push({ image, creationDate });
		}

		images.sort((a, b) => a.creationDate.getTime() - b.creationDate.getTime());

		setTimeout(async () => {
			countListImages.textContent = `Количество: ${images.length}`;

			for (const { image } of images) {
				const src = await readFileAsDataURL(image);
				const { name, size } = image;

				const nameImg = name.split(".")[0];
				const sizeImg = formatFileSize(size);
				const format = name.split(".")[1];

				const li = displayItemImage(src, nameImg, sizeImg, format);
				displayListImages.appendChild(li);
			}

			dragLoader.classList.remove("loader-active");
		}, 1500);
	}
};

const onDrag = (e) => e.preventDefault();

// dragstart – возникает, когда пользователь начинает перемещать элемент
dragImages.addEventListener("dragover", onDragOver);
// dragleave - возникает, когда перемещаемый элемент покидает принимающий объект
dragImages.addEventListener("dragleave", onDragLeave);
// drop - возникает, когда пользователь отпускает перемещаемый элемент
dragImages.addEventListener("drop", onDrop);
// drag – возникает во время перемещения элемента
dragImages.addEventListener("drag", onDrag);

themeBtn.addEventListener("click", setTheme);
renameBtn.addEventListener("click", async (e) => {

	if (images.length <= 0) return;

	renameProgress.classList.add("progress-active");

	setTimeout(async () => {
		const newNameImage = enterStartCount.value;

		if (isConvert) {
			let convertImages = [];

			for (const { image, creationDate } of images) {
				if (getExtensionFile(image.name) === "jpg") {
					console.log(getExtensionFile(image.name));
					convertImages.push({
						creationDate,
						image
					});
				} else {
					const img = await convertToJPG(image);
					convertImages.push({
						creationDate,
						image: img
					});
				}
			}
			images = convertImages;
		}

		newImages = renameImages(images, newNameImage);

		if (newImages && !isRename && newImages.length > 0) {
			countNewListImages.textContent = `Количество: ${newImages.length}`;

			for (const image of newImages) {
				const src = await readFileAsDataURL(image);
				const { name, size } = image;

				const nameImg = name.split(".")[0];
				const sizeImg = formatFileSize(size);
				const format = name.split(".")[1];

				const li = displayItemImage(src, nameImg, sizeImg, format);
				displayNewListImages.appendChild(li);
			}
			isRename = true;
			renameProgress.classList.remove("progress-active");
			downloadBtn.classList.add("download-btn-active");
		}
	}, 1500);
});
downloadBtn.addEventListener("click", () => {
	downloadZipImage(newImages);
});

isEnterStartCount.addEventListener("change", (e) => {
	if (isEnterStartCount.checked) {
		enterStartCount.classList.add("open");
	} else {
		enterStartCount.classList.remove("open");
	}
});

isEnterCovertImg.addEventListener("change", (e) => {
	if (isEnterCovertImg.checked) {
		isConvert = true;
	} else {
		isConvert = false;
	}
});