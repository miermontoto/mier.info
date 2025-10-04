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

	// Copy functionality
	const encodedCopy = document.getElementById('encoded-copy');
	const decodedCopy = document.getElementById('decoded-copy');

	encodedCopy.addEventListener('click', () => {
		encoded.select();
		document.execCommand('copy');
		// Visual feedback using CSS classes
		encodedCopy.classList.add('copied');
		encodedCopy.textContent = '✓';
		setTimeout(() => {
			encodedCopy.classList.remove('copied');
			encodedCopy.textContent = '⎘';
		}, 1000);
	});

	decodedCopy.addEventListener('click', () => {
		decoded.select();
		document.execCommand('copy');
		// Visual feedback using CSS classes
		decodedCopy.classList.add('copied');
		decodedCopy.textContent = '✓';
		setTimeout(() => {
			decodedCopy.classList.remove('copied');
			decodedCopy.textContent = '⎘';
		}, 1000);
	});

	// Image encoding functionality
	initImageEncoding();

	// Image decoding functionality
	initImageDecoding();

	// Image copy functionality
	const imgCopy = document.getElementById('img-copy');
	const imgEncodedCopy = document.getElementById('img-encoded-copy');

	imgCopy.addEventListener('click', () => {
		// Copy the image file name or data URL
		const imgInput = document.getElementById('img-input');
		if (imgInput.files.length > 0) {
			const file = imgInput.files[0];
			navigator.clipboard.writeText(file.name).then(() => {
				// Visual feedback using CSS classes
				imgCopy.classList.add('copied');
				imgCopy.textContent = '✓';
				setTimeout(() => {
					imgCopy.classList.remove('copied');
					imgCopy.textContent = '⎘';
				}, 1000);
			});
		}
	});

	imgEncodedCopy.addEventListener('click', () => {
		const imgEncodedText = document.getElementById('img-encoded-text');
		imgEncodedText.select();
		document.execCommand('copy');
		// Visual feedback using CSS classes
		imgEncodedCopy.classList.add('copied');
		imgEncodedCopy.textContent = '✓';
		setTimeout(() => {
			imgEncodedCopy.classList.remove('copied');
			imgEncodedCopy.textContent = '⎘';
		}, 1000);
	});
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

// Image encoding functionality
function initImageEncoding() {
	const imgInput = document.getElementById('img-input');
	const imgEncodedText = document.getElementById('img-encoded-text');
	const imgDrop = document.getElementById('img-drop');

	// Drag and drop functionality
	imgDrop.addEventListener('dragover', (e) => {
		e.preventDefault();
		imgDrop.style.borderColor = '#4CAF50';
	});

	imgDrop.addEventListener('dragleave', (e) => {
		e.preventDefault();
		imgDrop.style.borderColor = '';
	});

	imgDrop.addEventListener('drop', (e) => {
		e.preventDefault();
		imgDrop.style.borderColor = '';
		const files = e.dataTransfer.files;
		if (files.length > 0) {
			imgInput.files = files;
			handleImageFile(files[0]);
		}
	});

	// File input change
	imgInput.addEventListener('change', (e) => {
		if (e.target.files.length > 0) {
			handleImageFile(e.target.files[0]);
		}
	});

	// Prevent the click event from bubbling up when clicking on the file input itself
	imgInput.addEventListener('click', (e) => {
		e.stopPropagation();
	});

	function handleImageFile(file) {
		const reader = new FileReader();

		reader.onload = (e) => {
			const image = new Image();
			image.onload = () => {
				// Create canvas to get the image data
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');

				canvas.width = image.width;
				canvas.height = image.height;

				// Draw the image
				ctx.drawImage(image, 0, 0);

				// Convert to base64 and update the encoded textarea
				const base64Data = canvas.toDataURL('image/png').split(',')[1];
				imgEncodedText.value = base64Data;
			};
			image.src = e.target.result;
		};

		reader.readAsDataURL(file);
	}
}

// Image decoding functionality
function initImageDecoding() {
	const base64Input = document.getElementById('base64-input');
	const decodedImg = document.getElementById('decoded-img');

	// Auto-decode on input
	base64Input.addEventListener('input', (e) => {
		const data = e.target.value.trim();

		if (data && data.length > 100 && /^[A-Za-z0-9+/]*={0,2}$/.test(data)) {
			// Valid base64 format detected - try to decode
			try {
				const imageData = atob(data);
				const bytes = new Uint8Array(imageData.length);
				for (let i = 0; i < imageData.length; i++) {
					bytes[i] = imageData.charCodeAt(i);
				}

				// Create blob and display image
				const blob = new Blob([bytes], { type: 'image/png' });
				const imageUrl = URL.createObjectURL(blob);

				decodedImg.src = imageUrl;
				decodedImg.hidden = false;

				// Clean up the URL object when image loads
				decodedImg.onload = () => {
					URL.revokeObjectURL(imageUrl);
				};

				// Visual feedback for valid data
				base64Input.style.borderColor = '#00df0b';
			} catch (error) {
				// Invalid base64 data
				decodedImg.hidden = true;
				base64Input.style.borderColor = '#d40b00';
			}
		} else if (data.length > 0) {
			// Invalid format
			decodedImg.hidden = true;
			base64Input.style.borderColor = '#d40b00';
		} else {
			// No data
			decodedImg.hidden = true;
			base64Input.style.borderColor = '';
		}
	});

	// Auto-decode on paste
	base64Input.addEventListener('paste', (e) => {
		// Auto-decode on paste if it looks like base64 image data
		setTimeout(() => {
			const data = e.target.value.trim();
			if (data && data.length > 100 && /^[A-Za-z0-9+/]*={0,2}$/.test(data)) {
				// Trigger the input event to decode
				base64Input.dispatchEvent(new Event('input'));
			}
		}, 100);
	});
}
