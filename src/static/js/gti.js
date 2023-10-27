const isCorrect = (ans) => ans.classList.contains('correct') && ans.classList.contains('selected');
let responded = 0;

window.addEventListener('load', () => {
	resetAll();
	document.querySelector('#reset').addEventListener('click', resetAll);
});

window.addEventListener('scroll', () => {
	let element = document.querySelector('#results');
	let stickyPos = element.getBoundingClientRect().top + window.scrollY;

	if (window.pageY >= stickyPos) {
		element.style.position = 'fixed';
		element.style.top = '0';
	} else {
		element.style.position = 'relative';
		element.style.top = 'initial';
	}
});

function disableBlock(block) {
	block.querySelectorAll('.answer').forEach((ans) => {
		ans.removeEventListener('click', handleAnswerClick);
		ans.classList.add('disabled');
	});
}

function handleAnswerClick(e) {
	let target = e.target;
	let block = target.parentNode;

	target.classList.add('selected');
	disableBlock(block);
	responded++;

	let correct = isCorrect(target);
	if (correct) {
		document.querySelector('#correct').innerHTML++;
	}
	block.parentNode.classList.add(correct ? 'correct' : 'wrong');

	let score = document.querySelector('#correct').innerHTML / responded * 100;
	document.querySelector('#score').innerHTML = round(score);
}

function round(number) {
	let rounded = number.toFixed(1);
	if (rounded.endsWith('.0')) {
		return number;
	}
	return rounded;
}

function resetAll() {
	document.querySelectorAll('.question-block').forEach((block) => {
		block.classList.remove('correct');
		block.classList.remove('wrong');
	});

	document.querySelectorAll('.answer').forEach((ans) => {
		ans.classList.remove('selected');
		ans.classList.remove('disabled');
		ans.addEventListener('click', handleAnswerClick);
	});

	document.querySelector('#total').innerHTML = document.querySelectorAll('.question-block').length;
	document.querySelector('#correct').innerHTML = 0;
	document.querySelector('#score').innerHTML = 0;
	responded = 0;
}
