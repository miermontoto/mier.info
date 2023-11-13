window.addEventListener("load", function(event) {
	const decoded = document.querySelector('#decoded-text');
	const encoded = document.querySelector('#encoded-text');
	const copyDecoded = document.querySelector('#decoded-copy');
	const copyEncoded = document.querySelector('#encoded-copy');

	const encode = () => {
		encoded.value = b2a(decoded.value);
	}

	const decode = () => {
		let text;

		try {
			text = a2b(encoded.value);
		} catch (e) {
			text = '!INVALID!';
		}

		decoded.value = text;
	}

	const copyToClipboard = (dom) => {
		this.navigator.clipboard.writeText(dom.value);
	};

	decoded.addEventListener('input', encode);
	encoded.addEventListener('input', decode);

	copyDecoded.addEventListener('click', () => copyToClipboard(decoded));
	copyEncoded.addEventListener('click', () => copyToClipboard(encoded));
});

function a2b(str) {
	return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function b2a(str) {
	return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
		return String.fromCharCode('0x' + p1);
	}));
}
