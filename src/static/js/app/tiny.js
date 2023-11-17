window.addEventListener("load", function(event) {
	const input = document.getElementById('tiny-input');
	const output = document.getElementById('tiny-output');
	const ignore = document.getElementById('tiny-ignore');
	const copy = document.getElementById('tiny-copy');

	input.value = '';
	output.innerHTML = '';
	copy.classList.add('disabled');

	const update = () => {
		output.innerHTML = tinify(input.value, ignore.checked);
		if (output.innerHTML.length === 0) {
			copy.classList.add('disabled');
			return;
		}
		copy.classList.remove('disabled');
	}

	const copyToClipboard = () => {
		this.navigator.clipboard.writeText(output.innerHTML);
	}

	input.addEventListener('input', update);
	ignore.addEventListener('change', update);
	copy.addEventListener('click', copyToClipboard);
});

const superscript = { 'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'q': '𐞥', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
					  'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ꟲ', 'D': 'ᴰ', 'E': 'ᴱ', 'F': 'ꟳ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'Q': 'ꟴ', 'R': 'ᴿ', 'S': 'ˢ', 'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ', 'Y': 'ʸ', 'Z': 'ᶻ',
					  '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '0': '⁰' };


function tinify(str, ignore) {
	return str.split('').map(
		ignore ?
			(c => superscript[c] || '') :
			(c => superscript[c] || c)
	).join('');
}
