document.addEventListener('keydown', (event) => {
	switch (event.key) {
		case '.':
			window.open('https://github.com/miermontoto/mier.info', '_blank');
			break;
		case 'c':
			window.open('/changelog', '_self');
			break;
		case 't':
			window.open('/treemap', '_self');
			break;
		default:
			break;
	}
});
