import { questions } from './load.js';

document.getElementById('dl-btn').remove();
let defaultJson = {
	"data": {
		"block1": {
			"info": "info about block1",
			"questions": [
				{
					"title": "sample question 1",
					"answers": [
						"the number",
						"of answers",
						"is",
						"variable"
					],
					"shuffle": "false",
					"correct": 0
				},
				{
					"title": "sample question 2",
					"answers": [
						"shuffle isn't",
						"needed, and",
						"correct has to",
						"be a number"
					],
					"correct": 3
				}
			]
		}
	},
	"foo": "bar"
}

let jsonTextarea = document.getElementById('json');
jsonTextarea.innerHTML = JSON.stringify(defaultJson, null, 4);
jsonTextarea.addEventListener('input', () => {
	try {
		let json = JSON.parse(jsonTextarea.value);
		document.getElementById('inserted-questions').innerHTML = questions(json);
	} catch (e) {
		console.log(e);
	}
});
