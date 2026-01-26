// constantes para feedback visual
const COPY_ICON = '⎘';
const CHECK_ICON = '✓';
const COPY_TIMEOUT = 1000;
const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
const MIN_BASE64_LENGTH = 100;

// helper para crear handlers de copy con feedback visual
const createCopyHandler = (button, getTextFn) => () => {
	const text = getTextFn();
	if (text === undefined) return;

	navigator.clipboard.writeText(text).then(() => {
		button.classList.add('copied');
		button.textContent = CHECK_ICON;
		setTimeout(() => {
			button.classList.remove('copied');
			button.textContent = COPY_ICON;
		}, COPY_TIMEOUT);
	});
};

// helper para validar formato base64
const isValidBase64 = (data) => data.length > MIN_BASE64_LENGTH && BASE64_REGEX.test(data);

// helper para decodificar base64 a image blob
const decodeBase64ToBlob = (data) => {
	const imageData = atob(data);
	const bytes = Uint8Array.from(imageData, c => c.charCodeAt(0));
	return new Blob([bytes], { type: 'image/png' });
};

window.addEventListener("load", function(event) {
	const decoded = document.getElementById('decoded-text');
	const encoded = document.getElementById('encoded-text');

	// text encoding/decoding handlers
	decoded.addEventListener('input', () => encoded.value = b2a(decoded.value));
	encoded.addEventListener('input', () => {
		try {
			decoded.value = a2b(encoded.value);
		} catch (e) {
			decoded.value = '!INVALID!';
		}
	});

	// configurar copy buttons con handlers unificados
	const encodedCopy = document.getElementById('encoded-copy');
	const decodedCopy = document.getElementById('decoded-copy');
	const imgCopy = document.getElementById('img-copy');
	const imgEncodedCopy = document.getElementById('img-encoded-copy');

	encodedCopy.addEventListener('click', createCopyHandler(encodedCopy, () => encoded.value));
	decodedCopy.addEventListener('click', createCopyHandler(decodedCopy, () => decoded.value));

	imgCopy.addEventListener('click', createCopyHandler(imgCopy, () => {
		const imgInput = document.getElementById('img-input');
		return imgInput.files.length > 0 ? imgInput.files[0].name : undefined;
	}));

	imgEncodedCopy.addEventListener('click', createCopyHandler(imgEncodedCopy,
		() => document.getElementById('img-encoded-text').value));

	// inicializar funcionalidades de imagen
	initImageEncoding();
	initImageDecoding();
});

// base64 decode con soporte unicode
const a2b = (str) => decodeURIComponent(
	atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
);

// base64 encode con soporte unicode
const b2a = (str) => btoa(
	encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode('0x' + p1))
);

// helper para configurar drag and drop
const setupDragDrop = (element, onDrop, highlightColor = '#4CAF50') => {
	element.addEventListener('dragover', (e) => {
		e.preventDefault();
		element.style.borderColor = highlightColor;
	});

	element.addEventListener('dragleave', (e) => {
		e.preventDefault();
		element.style.borderColor = '';
	});

	element.addEventListener('drop', (e) => {
		e.preventDefault();
		element.style.borderColor = '';
		onDrop(e.dataTransfer.files);
	});
};

// helper para convertir image file a base64
const imageFileToBase64 = (file, callback) => {
	const reader = new FileReader();
	reader.onload = (e) => {
		const image = new Image();
		image.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = image.width;
			canvas.height = image.height;
			ctx.drawImage(image, 0, 0);
			callback(canvas.toDataURL('image/png').split(',')[1]);
		};
		image.src = e.target.result;
	};
	reader.readAsDataURL(file);
};

// funcionalidad de encoding de imagen
function initImageEncoding() {
	const imgInput = document.getElementById('img-input');
	const imgEncodedText = document.getElementById('img-encoded-text');
	const imgDrop = document.getElementById('img-drop');

	const handleImageFile = (file) => imageFileToBase64(file, (base64) => imgEncodedText.value = base64);

	// configurar drag and drop
	setupDragDrop(imgDrop, (files) => {
		if (files.length > 0) {
			imgInput.files = files;
			handleImageFile(files[0]);
		}
	});

	// file input change handler
	imgInput.addEventListener('change', (e) => e.target.files.length > 0 && handleImageFile(e.target.files[0]));

	// prevenir bubble del click event
	imgInput.addEventListener('click', (e) => e.stopPropagation());
}

// helper para mostrar imagen decodificada
const displayDecodedImage = (imgElement, blob) => {
	const imageUrl = URL.createObjectURL(blob);
	imgElement.src = imageUrl;
	imgElement.hidden = false;
	imgElement.onload = () => URL.revokeObjectURL(imageUrl);
};

// funcionalidad de decoding de imagen
function initImageDecoding() {
	const base64Input = document.getElementById('base64-input');
	const decodedImg = document.getElementById('decoded-img');

	const processBase64Input = () => {
		const data = base64Input.value.trim();

		if (!data) {
			decodedImg.hidden = true;
			base64Input.style.borderColor = '';
			return;
		}

		if (isValidBase64(data)) {
			try {
				const blob = decodeBase64ToBlob(data);
				displayDecodedImage(decodedImg, blob);
				base64Input.style.borderColor = '#00df0b';
			} catch (error) {
				decodedImg.hidden = true;
				base64Input.style.borderColor = '#d40b00';
			}
		} else {
			decodedImg.hidden = true;
			base64Input.style.borderColor = '#d40b00';
		}
	};

	// auto-decode on input
	base64Input.addEventListener('input', processBase64Input);

	// auto-decode on paste
	base64Input.addEventListener('paste', () => setTimeout(processBase64Input, 100));
}
