const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const equalButton = document.querySelector("[data-equal]");
const deleteButton = document.querySelector("[data-delete]");
const clearButton = document.querySelector("[data-all-clear]");
const previousDisplayText = document.querySelector("div.display .previous");
const currentDisplayText = document.querySelector("div.display .current");

class Calculator {
	constructor(previousDisplayText, currentDisplayText) {
		this.previousDisplayText = previousDisplayText;
		this.currentDisplayText = currentDisplayText;
		this.resetState();
	}

	resetState() {
		this.previousDisplay = "";
		this.currentDisplay = "";
		this.operator = null;
		this.equalPressed = false;
	}

	clear() {
		this.resetState();
	}

	delete() {
		if (this.equalPressed) {
			this.currentDisplay = "";
		}
		this.equalPressed = false;
		this.currentDisplay = this.currentDisplay.slice(0, -1);
	}

	updateDisplay() {
		this.previousDisplayText.innerText = `${this.formatNumber(
			this.previousDisplay
		)} ${this.operator || ""}`;
		this.currentDisplayText.innerText = this.formatNumber(
			this.currentDisplay
		);
	}

	formatNumber(number) {
		let [integer, decimal] = number.toString().split(",");
		integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		return decimal ? `${integer},${decimal}` : integer;
	}

	addNumber(number) {
		if (this.equalPressed) {
			this.currentDisplay = "";
			this.equalPressed = false;
		}

		const maxLength = 10;
		if (this.currentDisplay.length >= maxLength && number !== ",") return;
		if (number === "," && this.currentDisplay.includes(",")) return;
		if (number === "," && this.currentDisplay === "") {
			this.currentDisplay = "0";
		}

		this.currentDisplay += number.toString();
	}

	chooseOperation(operator) {
		if (!this.currentDisplay && this.previousDisplay) {
			this.operator = operator;
			return;
		}

		if (!this.currentDisplay) return;

		if (this.previousDisplay) {
			this.calculate();
		}

		this.operator = operator;
		this.previousDisplay = this.currentDisplay;
		this.currentDisplay = "";
	}

	calculate(equalPressed = false) {
		this.equalPressed = equalPressed;

		const prev = parseFloat(this.previousDisplay.replace(",", "."));
		const current = parseFloat(this.currentDisplay.replace(",", "."));

		if (isNaN(prev) || isNaN(current)) return;

		let result;
		switch (this.operator) {
			case "+":
				result = prev + current;
				break;
			case "-":
				result = prev - current;
				break;
			case "x":
				result = prev * current;
				break;
			case "÷":
				result = prev / current;
				break;
			default:
				return;
		}

		this.currentDisplay = result.toString().replace(".", ",");
		this.operator = null;
		this.previousDisplay = "";
	}
}

const calculator = new Calculator(previousDisplayText, currentDisplayText);

const setupButtonListeners = (buttons, callback) => {
	buttons.forEach((button) =>
		button.addEventListener("click", () => callback(button.innerText))
	);
};

setupButtonListeners(numberButtons, (number) => {
	calculator.addNumber(number);
	calculator.updateDisplay();
});

setupButtonListeners(operatorButtons, (operator) => {
	calculator.chooseOperation(operator);
	calculator.updateDisplay();
});

clearButton.addEventListener("click", () => {
	calculator.clear();
	calculator.updateDisplay();
});

deleteButton.addEventListener("click", () => {
	calculator.delete();
	calculator.updateDisplay();
});

equalButton.addEventListener("click", () => {
	calculator.calculate(true);
	calculator.updateDisplay();
});
