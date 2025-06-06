window.addEventListener('DOMContentLoaded', () => {
	const modes = {
		newbie: 300,
		confident: 600,
		beast: 1500
	};

	let totalTime = modes['confident'];

	const updateTime = (minElement, secElement) => {
		minElement.textContent = String(Math.floor(timeLeft / 60)).padStart(2, '0');
		secElement.textContent = String(Math.floor(timeLeft % 60)).padStart(2, '0');
	}

	// Timer Block

	const timerMin = document.querySelector('.timer__min-value');
	const timerSec = document.querySelector('.timer__sec-value');
	const progressBar = document.querySelector('.timer__progress-bar');
	const startButton = document.querySelector('.timer__button');

	let isActiveTimer = false;
	let timeLeft = totalTime;
	let startTime = 0;
	let currentTime = 0;
	let animation;

	const animateTimer = (timestamp) => {
		if (!startTime) startTime = timestamp;

		currentTime = (timestamp - startTime) / 1000;
		let remainingTime = Math.max(totalTime - currentTime, 0);

		if (isActiveTimer) {
			timeLeft = Math.ceil(remainingTime);

			updateTime(timerMin, timerSec);

			let progress = ((totalTime - remainingTime) / totalTime) * 360;

			progressBar.style.background = `conic-gradient(#06ffff ${progress}deg, transparent ${progress}deg)`;

			if (remainingTime > 0) {
				animation = requestAnimationFrame(animateTimer);
			} else {
				setTimeout(() => progressBar.classList.add('end'), 300);

				isActiveTimer = false;

				updateTextButton();
			}
		}
	}

	const startTimer = () => {
		if (!isActiveTimer) {
			if (currentTime >= totalTime) {
				resetTimer();
			} else {
				startTime = performance.now() - currentTime * 1000;
			}

			isActiveTimer = true;

			updateTextButton();

			animation = requestAnimationFrame(animateTimer);
		} else {
			cancelAnimationFrame(animation);

			isActiveTimer = false;

			updateTextButton();
		}
	}

	const resetTimer = () => {
		progressBar.classList.remove('end');

		timeLeft = totalTime;
		startTime = 0;
		currentTime = 0;

		progressBar.style.background = `conic-gradient(#06ffff 0deg, transparent 0deg)`;
	}

	const updateTextButton = () => {
		let buttonText = isActiveTimer ? 'Pause' : 'Start';

		startButton.style.opacity = 0;

		setTimeout(() => {
			startButton.textContent = buttonText;
			startButton.style.opacity = 1;
		}, 100);
	}

	startButton.addEventListener('click', startTimer);

	if (timerMin && timerSec) {
		updateTime(timerMin, timerSec);
	}

	// Progress Block (Calories)

	const scaleContainer = document.querySelector('.progress__scale');
	const blocksCount = 12;
	const fixedCount = 6;

	for (let i = 0; i < blocksCount; i++) {
		const block = document.createElement('div');

		block.classList.add('progress__block');

		if (i < fixedCount) block.classList.add('past');

		const startAngle = -140;
		const endAngle = 20;
		const angle = startAngle + i * 0.9 * ((endAngle - startAngle) / (blocksCount - 1));

		const x = 137 * Math.cos((angle * Math.PI) / 180);
		const y = 137 * Math.sin((angle * Math.PI) / 180);

		block.style.transform = `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`;
		scaleContainer.appendChild(block);
	}

	const updateProgress = () => {
		const blocks = Math.floor(totalTime / 300);
		const allBlocks = scaleContainer.querySelectorAll('.progress__block');
		const caloriesCount = document.querySelector('.progress__calories-count');

		allBlocks.forEach((block) => {
			block.classList.remove('present');
		});

		const maxBlocks = Math.min(allBlocks.length, fixedCount + blocks);

		for (let i = fixedCount; i < maxBlocks; i++) {
			allBlocks[i].classList.add('present');
		}

		const calories = Math.max(0, 1800 - totalTime);

		caloriesCount.textContent = calories.toString();
	}

	updateProgress();

	// Duration Block

	const durationMin = document.querySelector('.duration__min-value');
	const durationSec = document.querySelector('.duration__sec-value');
	const plusBtn = document.querySelector('.duration__time-plus');
	const minusBtn = document.querySelector('.duration__time-minus');

	plusBtn.addEventListener('click', () => {
		if (isActiveTimer) return;

		resetTimer();

		totalTime = totalTime + 10;
		timeLeft = totalTime;

		updateTime(durationMin, durationSec);
		updateTime(timerMin, timerSec);
		updateProgress();
	});

	minusBtn.addEventListener('click', () => {
		if (isActiveTimer) return;

		resetTimer();

		if (totalTime > 0) {
			totalTime = totalTime - 10;
			timeLeft = totalTime;

			updateTime(durationMin, durationSec);
			updateTime(timerMin, timerSec);
			updateProgress();
		}
	});

	if (durationSec && durationMin) {
		updateTime(durationMin, durationSec);
	}

	// Options

	const buttonsControl = document.querySelectorAll('.options__mode');
	const optionsMin = document.querySelector('.options__min-value');
	const optionsSec = document.querySelector('.options__sec-value');
	const caloriesMode = document.querySelector('.options__calories-count');

	const changeMode = (item) => {
		if (item.classList.contains('active')) {
			const mode = item.getAttribute('data-mode');

			totalTime = modes[mode];
			timeLeft = totalTime;

			updateTime(optionsMin, optionsSec);
			updateTime(durationMin, durationSec);
			updateTime(timerMin, timerSec);

			caloriesMode.textContent = totalTime;
		}
	}

	buttonsControl.forEach((item) => {
		changeMode(item);

		item.addEventListener('click', () => {
			if (isActiveTimer) return;

			resetTimer();

			buttonsControl.forEach((btn) => btn.classList.remove('active'));
			item.classList.add('active');

			changeMode(item);

			updateProgress();
		});
	});

	// Activity Block

	const currentDay = document.querySelector('.activity__current-day');
	const days = document.querySelectorAll('.activity__day');

	const today = new Date().getDay() === 0 ? 1 : new Date().getDay() + 1;

	const activityInspector = () => {
		currentDay.textContent = today.toString();

		days.forEach((item) => {
			const dayNumber = item.getAttribute('data-day');

			if (dayNumber < today) item.classList.add('active');

			if (parseInt(dayNumber) === today) item.classList.add('current');
		});
	}

	activityInspector();
});
