const isCorrect = (ans) => ans.classList.contains('correct') && ans.classList.contains('selected');
let responded = 0;
let total;

let allQuestions;
let currentQuestionsDiv = document.createElement('div');

window.addEventListener('load', () => { // when the page loads (the content is rendered)
	let questionsBlock = document.getElementById('questions');

	allQuestions = document.querySelectorAll('.question-block');
	document.querySelectorAll('.select-block').forEach((block) => {
		block.addEventListener('click', () => {
			if (warn()) return;
			let blockId = block.getAttribute('id');
			questionsBlock.innerHTML = ''; // empty all questions
			allQuestions.forEach((q) => {
				if (q.getAttribute('block') == blockId || blockId == 'all' || (q.getAttribute('exam') == "true" && blockId == "exam")) {
					if (blockId == "exam") q.querySelector('.exam').remove();
					questionsBlock.appendChild(q);
				}
			});
			currentQuestionsDiv.innerHTML = questionsBlock.innerHTML;

			resetAll(false);
			document.querySelectorAll('.select-block').forEach((b) => b.classList.remove('selected'));
			block.classList.add('selected');
		});
	});

	document.querySelector('.select-block').click(); // send click event to the first block (select socrative)
	document.getElementById('reset').addEventListener('click', resetAll);

	document.querySelectorAll('#shuffle-questions, #shuffle-answers').forEach((checkbox) => checkbox.addEventListener('change', resetAll));

	resetAll(false); // reset everything and calculate indices
});

function recalc() {
	let i = 1;
	document.querySelectorAll('.question-block').forEach((q) => {
		let title = q.querySelector('.question');
		title.innerHTML = `<span class="number">${i++}.</span> ${title.innerHTML}`;   // add index to each question title

		let j = 0;
		q.querySelectorAll('.answer').forEach((ans) => {           				      // for each answer
			let letter = String.fromCharCode(97 + j++);                               // convert index to letter
			ans.innerHTML = `<span class="letter">${letter}.</span>${ans.innerHTML}`; // add letter to answer
		});
	});
	total = document.querySelectorAll('.question-block').length;
	document.getElementById('total').innerHTML = total;
}

// shuffle questions
function shuffleQuestions() {
	let questions = document.querySelectorAll('.question-block');
	shuffle(questions).forEach((q) => {
		document.getElementById('questions').appendChild(q);
	});
}

// shuffle 'shuffable' answer blocks
function shuffleAnswers() {
	document.querySelectorAll('.answer-block').forEach((block) => {
		if (block.getAttribute('shuffle') !== 'false') {               // if it's shuffable
			block.querySelectorAll('br').forEach((br) => br.remove()); // remove all <br> tags
			let answers = block.querySelectorAll('.answer');           // get all answers
			shuffle(answers).forEach((ans) => {                        // shuffle them and for each
				block.appendChild(ans);                                // append them to the block
				block.appendChild(document.createElement('br'));       // and add a <br> tag
			});
		}
	});
}

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
		document.getElementById('correct').innerHTML++;
	}
	block.parentNode.classList.add(correct ? 'correct' : 'wrong');

	let score = document.getElementById('correct').innerHTML / responded * 100;
	document.getElementById('score').innerHTML = round(score);

	if (responded == total) {
		document.getElementById('results').classList.add('finished');
	}
}

function round(number) {
	let rounded = number.toFixed(1);
	if (rounded.endsWith('.0')) {
		return number;
	}
	return rounded;
}

function warn() {
	return alert && responded != 0 && !window.confirm('esta acción reinicia el progreso del quiz. pulsa OK para continuar.');
}

function resetAll(alert = true) {
	if (alert && warn()) return;
	document.getElementById('questions').innerHTML = currentQuestionsDiv.innerHTML;

	if (document.getElementById('shuffle-questions').checked) {
		shuffleQuestions();
	}

	if (document.getElementById('shuffle-answers').checked) {
		shuffleAnswers();
	}

	recalc();

	document.querySelectorAll('.question-block').forEach((block) => {
		block.classList.remove('correct');
		block.classList.remove('wrong');
	});

	document.querySelectorAll('.answer').forEach((ans) => {
		ans.classList.remove('selected');
		ans.classList.remove('disabled');
		ans.removeEventListener('click', handleAnswerClick);

		ans.addEventListener('click', handleAnswerClick);
	});

	document.getElementById('correct').innerHTML = 0;
	document.getElementById('score').innerHTML = 0;
	responded = 0;

	document.getElementById('results').classList.remove('finished');
}

function shuffle(collection) {
	let array = Array.from(collection);
	let currentIndex = array.length;
	let randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}
