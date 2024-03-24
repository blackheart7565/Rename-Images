const getTemplate = (data = [], placeholder, selectedId) => {
	let text = placeholder ?? "Placeholder по умолчанию";

	const items = data.map(item => {
		let cls = "";
		if (item.id === selectedId) {
			text = item.value;
			cls = "selected";
		}
		return `
		<li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>
		`;
	});

	return `
    	<div class="select__backdrop" data-type="backdrop"></div>
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

		// событияе клика для input
		this.$element.querySelector("[data-type=\"input\"]").addEventListener("click", this.clickInputHandler);

		this.$element.addEventListener("click", this.clickHandler);
		this.$value = this.$element.querySelector("[data-type=\"value\"]");
	}

	clickInputHandler(e) {
		console.log(11);
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
		this.$value.textContent = this.current.value;

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
		this.$element.innerHTML = "";
	}
}

window.s = new Select("#select", {
	placeholder: 'Выбери пожалуйста элемент',
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

