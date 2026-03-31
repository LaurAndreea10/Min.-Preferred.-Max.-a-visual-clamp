const minInput = document.getElementById("minInput");
const preferredInput = document.getElementById("preferredInput");
const maxInput = document.getElementById("maxInput");
const viewportInput = document.getElementById("viewportInput");

const minValue = document.getElementById("minValue");
const preferredValue = document.getElementById("preferredValue");
const maxValue = document.getElementById("maxValue");
const viewportValue = document.getElementById("viewportValue");

const viewportBox = document.getElementById("viewportBox");
const demoText = document.getElementById("demoText");

const minMarker = document.getElementById("minMarker");
const preferredMarker = document.getElementById("preferredMarker");
const maxMarker = document.getElementById("maxMarker");
const resultMarker = document.getElementById("resultMarker");

const stateText = document.getElementById("stateText");
const codeOutput = document.getElementById("codeOutput");
const explanation = document.getElementById("explanation");
const resultText = document.getElementById("resultText");
const copyButton = document.getElementById("copyButton");

function clampValue(min, preferred, max) {
	return Math.max(min, Math.min(preferred, max));
}

function toPercent(value, min, max) {
	return ((value - min) / (max - min)) * 100;
}

function updateDemo() {
	let min = Number(minInput.value);
	let preferredFactor = Number(preferredInput.value);
	let max = Number(maxInput.value);
	let viewport = Number(viewportInput.value);

	if (min > max) {
		max = min;
		maxInput.value = max;
	}

	const preferred = (preferredFactor / 100) * viewport;
	const result = clampValue(min, preferred, max);

	minValue.textContent = `${min}px`;
	preferredValue.textContent = `${preferredFactor}vw`;
	maxValue.textContent = `${max}px`;
	viewportValue.textContent = `${viewport}px`;

	viewportBox.style.width = `${viewport}px`;
	demoText.style.fontSize = `${result}px`;

	codeOutput.textContent = `font-size: clamp(${min}px, ${preferredFactor}vw, ${max}px);`;
	resultText.textContent = `Calculated size: ${result.toFixed(2)}px`;

	const meterMin = 0;
	const meterMax = Math.max(120, preferred + 20, max + 20);

	minMarker.style.left = `${toPercent(min, meterMin, meterMax)}%`;
	preferredMarker.style.left = `${toPercent(preferred, meterMin, meterMax)}%`;
	maxMarker.style.left = `${toPercent(max, meterMin, meterMax)}%`;
	resultMarker.style.left = `${toPercent(result, meterMin, meterMax)}%`;

	demoText.classList.remove("is-min", "is-preferred", "is-max");

	if (preferred < min) {
		stateText.textContent = "Minimum is active";
		explanation.textContent =
			"The preferred value falls below the minimum, so the result stays locked to the lower bound.";
		demoText.classList.add("is-min");
	} else if (preferred > max) {
		stateText.textContent = "Maximum is active";
		explanation.textContent =
			"The preferred value exceeds the maximum, so the result is capped at the upper bound.";
		demoText.classList.add("is-max");
	} else {
		stateText.textContent = "Preferred value is active";
		explanation.textContent =
			"The preferred value sits between the minimum and maximum, so it is used directly.";
		demoText.classList.add("is-preferred");
	}
}

copyButton.addEventListener("click", async () => {
	try {
		await navigator.clipboard.writeText(codeOutput.textContent);
		copyButton.textContent = "Copied";
		setTimeout(() => {
			copyButton.textContent = "Copy CSS";
		}, 1000);
	} catch {
		copyButton.textContent = "Copy failed";
		setTimeout(() => {
			copyButton.textContent = "Copy CSS";
		}, 1000);
	}
});

[minInput, preferredInput, maxInput, viewportInput].forEach((input) => {
	input.addEventListener("input", updateDemo);
});

updateDemo();
