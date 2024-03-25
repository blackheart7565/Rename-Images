const getTemplate = (data = [], placeholder, selectedId) => {
	let text = placeholder ?? "Placeholder по умолчанию";

	const items = data.map(item => {
		let cls = "";
		if (item.id === selectedId) {
			// text = item.value;
			cls = "selected";
		}
		return `
		<li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>
		`;
	});

	// <div class="select__backdrop" data-type="backdrop"></div>
	return `
		<div class="select__input" data-type="input">
			<span data-type="value">${text}</span>
		</div>
		<div class="select__dropdown">
			<ul class="select__list">
				${items.join("")}
			</ul>
		</div>
	`;
};

class Select {
	constructor(selector, option) {
		this.$element = document.querySelector(selector);
		this.options = option;
		this.selectedId = option.selectedId;

		this.#render();
		this.#setup();
	}

	/**
	 *  Генерирует шаблон для селекта
	 */
	#render() {
		const { data, placeholder } = this.options;
		this.$element.classList.add("select");
		this.$element.innerHTML = getTemplate(data, placeholder, this.selectedId);
	}

	/**
	 * Запуск настроек селекта
	 */
	#setup() {
		this.clickHandler = this.clickHandler.bind(this);
		this.clickInputHandler = this.clickInputHandler.bind(this);
		this.clickOutside = this.clickOutside.bind(this);

		// событияе клика для input
		this.$element.querySelector("[data-type=\"input\"]").addEventListener("click", this.clickInputHandler);

		document.addEventListener("click", this.clickOutside);

		this.$element.addEventListener("click", this.clickHandler);
		this.$value = this.$element.querySelector("[data-type=\"value\"]");
	}

	clickOutside(e) {
		const click = e.composedPath().includes(this.$element);
		if (!click) {
			this.close();
		}
	}

	clickInputHandler(e) {
		this.toggle();
	}

	clickHandler(event) {
		const { type } = event.target.dataset;

		// if (type === "input") {
		// 	this.toggle();
		// } else 
		if (type === "item") {
			const id = event.target.dataset.id;
			this.select(id);
		} else if (type === "backdrop") {
			this.close();
		}
	}

	get isOpen() {
		return this.$element.classList.contains("open");
	}

	get current() {
		return this.options.data.find(item => item.id === this.selectedId);
	}

	select(id) {
		this.selectedId = id;
		// this.$value.textContent = this.current.value;

		this.$element.querySelectorAll("[data-type=\"item\"]")
			.forEach(item => item.classList.remove("selected"));

		this.$element.querySelector(`[data-id="${id}"]`).classList.add("selected");

		this.options.onSelect ? this.options.onSelect(this.current) : null;

		this.close();
	}

	toggle() {
		this.isOpen ? this.close() : this.open();
	}

	open() {
		this.$element.classList.add("open");
	}

	close() {
		this.$element.classList.remove("open");
	}

	destroy() {
		this.$element.removeEventListener("click", this.clickHandler);
		this.$element.querySelector("[data-type=\"input\"]").removeEventListener("click", this.clickInputHandler);
		document.removeEventListener("click", this.clickOutside);
		this.$element.innerHTML = "";
	}
}

window.s = new Select("#select", {
	placeholder: `
		<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
			<path
				d="M262.29 192.31a64 64 0 1057.4 57.4 64.13 64.13 0 00-57.4-57.4zM416.39 256a154.34 154.34 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.81 10.81 0 01-13.14 4.59l-44.9-18.08a16.11 16.11 0 00-15.17 1.75A164.48 164.48 0 01325 400.8a15.94 15.94 0 00-8.82 12.14l-6.73 47.89a11.08 11.08 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.07 16.07 0 00-9-12.22 155.3 155.3 0 01-21.46-12.57 16 16 0 00-15.11-1.71l-44.89 18.07a10.81 10.81 0 01-13.14-4.58l-42.77-74a10.8 10.8 0 012.45-13.75l38.21-30a16.05 16.05 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30A10.81 10.81 0 0149.48 186l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.11 16.11 0 0015.17-1.75A164.48 164.48 0 01187 111.2a15.94 15.94 0 008.82-12.14l6.73-47.89A11.08 11.08 0 01213.23 42h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.07 16.07 0 009 12.22 155.3 155.3 0 0121.46 12.57 16 16 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.8 10.8 0 01-2.45 13.75l-38.21 30a16.05 16.05 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z"
				fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
				stroke-width="32" />
		</svg>
	`,
	selectedId: '1',
	data: [
		{ id: '1', value: 'React' },
		{ id: '2', value: 'Angular' },
		{ id: '3', value: 'Vue' },
		{ id: '4', value: 'React Native' },
		{ id: '5', value: 'Next' },
		{ id: '6', value: 'Nest' }
	],
	onSelect(item) {
		console.log('Selected Item', item);
	}
});

