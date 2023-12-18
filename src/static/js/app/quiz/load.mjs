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
    return blocks
}

export function blocks(json) {
	let blocks = getBlocksFromJson(json);
	if (blocks.length == 0 || blocks.length == 1) return '';

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

export function questions(json) {
	let blocks = getBlocksFromJson(json);
    let template = '<div id="questions">';

    blocks.forEach((block) => {
        let questions = json[block]['questions'];

        questions.forEach((q) => {
            let exam = q.exam == "true";

            template += `
                <div class="question-block" block="${block}" exam="${exam}">
                    <h2 class="question">
                        ${q.title}
                    </h2>
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
