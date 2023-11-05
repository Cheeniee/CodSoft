const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";

keys.forEach((key) => {
	const value = key.dataset.key;

	key.addEventListener('click', () => {
		if (value === "clear") {
			input = "";
		} else if (value === "backspace") {
			input = input.slice(0, -1);
		} else if (value === "=") {
			let result;
			try {
				result = eval(PrepareInput(input));
			} catch (error) {
				result = "Error";
			}
			display_output.innerHTML = CleanOutput(result);
		} else if (value === "brackets") {
			input += handleBrackets();
		} else {
			if (validateInput(value)) {
				input += value;
			}
		}

		display_input.innerHTML = CleanInput(input);
	});
});

function handleBrackets() {
	const openBrackets = (input.match(/\(/g) || []).length;
	const closeBrackets = (input.match(/\)/g) || []).length;

	if (openBrackets === closeBrackets || input === "") {
		return "(";
	} else if (openBrackets > closeBrackets) {
		return ")";
	}
}

function CleanInput(input) {
	const replacements = {
		'*': '<span class="operator">x</span>',
		'/': '<span class="operator">÷</span>',
		'+': '<span class="operator">+</span>',
		'-': '<span class="operator">-</span>',
		'(': '<span class="brackets">(</span>',
		')': '<span class="brackets">)</span>',
		'%': '<span class="percent">%</span>',
	};

	return input.replace(/[*+\/()%]/g, match => replacements[match] || match);
}

function CleanOutput(output) {
	const parts = output.toString().split('.');
	const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const decimalPart = parts[1] ? `.${parts[1]}` : '';

	return integerPart + decimalPart;
}

function validateInput(value) {
	const lastInput = input.slice(-1);
	const operators = ["+", "-", "*", "/"];

	if (value === "." && lastInput === ".") {
		return false;
	}

	if (operators.includes(value)) {
		return !operators.includes(lastInput);
	}

	return true;
}

function PrepareInput(input) {
	return input.replace(/%/g, "/100");
}
