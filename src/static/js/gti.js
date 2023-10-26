const isCorrect = (ans) => ans.classList.contains('correct');

window.addEventListener('load', () => {
	resetAll();
	document.querySelector('#reset').addEventListener('click', resetAll);
	document.querySelector('#top').addEventListener('click', () => {
		window.scrollTo(0, 0);
	});
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
		if (isCorrect(ans)) {
			document.querySelector('#correct').innerHTML++;
		}
	});
}

function handleAnswerClick(e) {
	e.target.classList.add('selected');
	disableBlock(e.target.parentNode);
}

function resetAll() {
	document.querySelectorAll('.answer-block').forEach((block) => {
		block.querySelectorAll('.answer').forEach((ans) => {
			ans.classList.remove('selected');
			ans.classList.remove('disabled');
			ans.addEventListener('click', handleAnswerClick);
		});
	});

	document.querySelector('#total').innerHTML = document.querySelectorAll('.question-block').length;
	document.querySelector('#correct').innerHTML = 0;
}
