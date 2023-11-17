window.addEventListener("load", function(event) {
	const decoded = document.getElementById('decoded-text');
	const encoded = document.getElementById('encoded-text');

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

	decoded.addEventListener('input', encode);
	encoded.addEventListener('input', decode);
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
