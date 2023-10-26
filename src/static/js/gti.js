document.querySelectorAll('.answer-block').forEach((ans, i) => {
	ans.addEventListener('click', (e) => {
		ans.classList.toggle('selected');
		console.log('clicked');
	});
});

console.log('loaded?');
