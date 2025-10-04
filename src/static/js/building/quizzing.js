function getBlocksFromJson(json) {
    let blocks = [];
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            const element = json[key];
            if (element['questions']) {
                blocks.push(key);
            }
        }
    }
    return blocks;
}


const quizQuestions = (json) => {
	let blocks = getBlocksFromJson(json);
	let template = '<div id="questions">';

	blocks.forEach((block) => {
		let questions = json[block]['questions'];

		questions.forEach((q) => {
			let exam = q.exam == "true";

			template += `
				<div class="question-block" block="${block}" exam="${exam}">
					<h3 class="question">
						${q.title}
					</h3>
			`;

			if (q.options) {
				template += `<div class="options">`;

				q.options.forEach((o, j) => {
					template += `<h3 class="option">${j+1}. ${o}</h3>`;
				});

				template += `</div>`;
			}

			let shuffle = q.shuffle != "false";

			template += `<div class="answer-block" shuffle="${shuffle}">`;
			q.answers.forEach((a, j) => {
				template += `
				<span class="button answer${j == q.correct ? " correct" : ""}">
					${a}
				</span> <br>`;
			});

			template += '</div>';
			if (exam || !shuffle) {
				template += `<ul class="asterisks">
					${exam ? '<li class="exam">pregunta de examen reciente</li>' : ''}
					${!shuffle ? '<li class="shuffle">orden de respuestas fijado</li>' : ''}
				</ul>`;
			}
			template += '</div>';
		});
	});

	template += `</div>`;
	return template;
}


const quizButtons = (json) => {
	let blocks = getBlocksFromJson(json);
	if (blocks.length <= 1) return '';

	let template = `<div id="block-selection"> <h3>preguntas.</h3> <ul>`;
	blocks.forEach(b => {
		template += `<li><code>${b}</code>: ${json[b]['info']}</li>`;
	});
	template += '<li><code>todas</code>: todas las preguntas</li></ul>';

	blocks.forEach((b) => {
		template += `<span class="button select-block" id="${b}">${b}</span>`
	});

	template += '<span class="button select-block" id="all">todas</span>';
	template += '</div>';
	return template;
}


const qka = (data) => {
	let template = ""
	data.forEach((d, i) => {
		let sources = d.s ? d.s.map(s => `<li><a href="${s}">${s}</a></li>`).join(' ') : null;
		template += `<div class="doubt hoverborder">
			<span class="question">${i+1}. ${d.q}</span>`;
		if (d.a) template += `<span class="answer">${d.a}</span>`
		if (sources) template += `<span class="sources">sources: <br>${sources}</span>`
		if (d.k && d.d) template += `<span class="bottom">keywords: <code>${d.k}</code>, date asked: ${d.d}</span>`
		else console.log('warning: question missing keywords or date')
		template += `</div>`
	})
	return template
}

module.exports = { qka, quizButtons, quizQuestions }
