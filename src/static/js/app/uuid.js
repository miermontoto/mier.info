// UUID v1 (timestamp-based)
function uuidv1() {
	const d = new Date().getTime();
	const nodeId = crypto.getRandomValues(new Uint8Array(6));
	let uuid = 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (d + Math.random() * 16) % 16 | 0;
		const v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
	uuid = uuid.substr(0, 23) + nodeId.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
	return uuid;
}

// UUID v4 (random)
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = Math.random() * 16 | 0;
		const v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

// UUID v7 (timestamp + random)
function uuidv7() {
	const milliseconds = Date.now();
	const seconds = Math.floor(milliseconds / 1000);
	const nanos = (milliseconds % 1000) * 1e6;

	const timestamp = BigInt(seconds) * BigInt(1e9) + BigInt(nanos);
	const timestampHex = timestamp.toString(16).padStart(16, '0');

	const randomBytes = crypto.getRandomValues(new Uint8Array(10));
	const randomHex = Array.from(randomBytes, (b) => b.toString(16).padStart(2, '0')).join('');

	return `${timestampHex.substr(0, 8)}-${timestampHex.substr(8, 4)}-7${timestampHex.substr(12, 3)}-${randomHex.substr(0, 4)}-${randomHex.substr(4)}`;
}

// GUID (Microsoft's variant of UUID)
function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function generate() {
	const version = document.getElementById('uuid-version').value;

	let uuid = '';
	switch (version) {
		case 'v1':
			uuid = uuidv1();
			break;
		case 'v4':
			uuid = uuidv4();
			break;
		case 'v7':
			uuid = uuidv7();
			break;
		case 'guid':
			uuid = guid();
			break;
		default:
			uuid = 'how?';
			break;
	}

	return uuid;
}

window.addEventListener("load", function (event) {
	const copy = document.getElementById('uuid-copy');
	const button = document.getElementById('uuid-generate');
	const output = document.getElementById('uuid-output');

	copy.addEventListener('click', function (event) {
		navigator.clipboard.writeText(output.value);
	});

	button.addEventListener('click', function (event) {
		output.innerHTML = generate();
	});

	output.innerHTML = generate();
});
