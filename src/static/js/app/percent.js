window.addEventListener("load", function(event) {
	const decoded = document.getElementById('url-decoded');
	const encoded = document.getElementById('url-encoded');

	const encode = () => {
		encoded.value = encodeURIComponent(decoded.value);
	}

	const decode = () => {
		let text;

		try {
			text = decodeURIComponent(encoded.value);
		} catch (e) {
			text = '!INVALID!';
		}

		decoded.value = text;
	}

	decoded.addEventListener('input', encode);
	encoded.addEventListener('input', decode);
});
