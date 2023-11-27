document.getElementById('img-convert').addEventListener('click', convert); // convert on click

// enable options after selecting file
document.getElementById('img-input').addEventListener('change', enableOptions);

// only enable quality slider if a non lossless format is selected (jpeg, webp)
document.getElementById('img-format').addEventListener('change', checkQuality);

// sync quality slider with value and enable options if file already present on window load
window.addEventListener('load', function() {
	if (document.getElementById('img-input').files[0]) enableOptions();

	let slider = document.getElementById('qualitySlider');
	let value = document.getElementById('qualityValue');

	slider.oninput = function() {
		value.innerHTML = `${this.value}%`;
	};
});

function enableOptions() {
	// enable options
	document.getElementById('img-convert').classList.remove('disabled');
	document.getElementById('img-options').classList.remove('disabled');
	document.getElementById('heightInput').disabled = false;
	document.getElementById('widthInput').disabled = false;
	document.getElementById('keepRatio').disabled = false;

	// obtain image dimensions
	let img = new Image();
	let heightDom = document.getElementById('heightInput');
	let widthDom = document.getElementById('widthInput');
	let ratio;
	img.src = URL.createObjectURL(document.getElementById('img-input').files[0]);
	img.onload = function() {
		heightDom.value = img.height;
		widthDom.value = img.width;
		ratio = img.width / img.height;
	};

	// calculate ratio on input if enabled
	widthDom.oninput = function() {
		if (document.getElementById('keepRatio').checked) {
			document.getElementById('heightInput').value = Math.round(this.value / ratio);
		}
	};

	heightDom.oninput = function() {
		if (document.getElementById('keepRatio').checked) {
			document.getElementById('widthInput').value = Math.round(this.value / (1 / ratio));
		}
	};

	checkQuality();
}

function checkQuality() {
	let slider = document.getElementById('qualitySlider');
	let value = document.getElementById('qualityValue');
	let format = document.getElementById('img-format').value;
	let warning = document.getElementById('img-formatInfo');

	if (format === 'jpeg' || format === 'webp') {
		slider.disabled = false;
		slider.value = 100;
		value.innerHTML = '100%';
	} else {
		slider.disabled = true;
		value.innerHTML = 'loseless';
	}
	warning.classList.add('hidden');

	if (format === 'ico' || format === 'bmp') {
		warning.classList.remove('hidden');
	}
}

function convert() {
	let input = document.getElementById('img-input').files[0];
	let canvas = document.getElementById('img-canvas');
	let format = document.getElementById('img-format').value;
	let download = document.getElementById('img-download');
	let filenameSpan = document.getElementById('img-filename');

	if (!input) return;

	const reader = new FileReader();
	reader.onload = function (e) {
		const img = new Image();
		img.onload = function() {
			let width = document.getElementById('widthInput').value || img.width;
			let height = document.getElementById('heightInput').value || img.height;

			const temp = document.createElement('canvas');
			temp.width = width;
			temp.height = height;
			temp.getContext('2d').drawImage(img, 0, 0, width, height);

			canvas.src = temp.toDataURL(`image/${format}`, document.getElementById('qualitySlider').value / 100);
			download.href = canvas.src;
		};
		img.src = e.target.result;
	};
	reader.readAsDataURL(input);
	canvas.hidden = false;
	download.classList.remove('hidden');
	let filename = `${input.name.split('.')[0]}.${format}`;
	download.download = filename;
	filenameSpan.innerHTML = `will be saved as ${filename}`;
}
