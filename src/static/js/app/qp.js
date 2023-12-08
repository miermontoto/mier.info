window.addEventListener("load", function(event) {
    const decoded = document.getElementById('qp-decoded-text');
    const encoded = document.getElementById('qp-encoded-text');

    const encode = () => {
        const text = decoded.value;
        const encodedText = encodeURIComponent(text)
            .replace(/%20/g, '=')
            .replace(/%([0-9A-F]{2})/g, (match, p1) => `=${p1}`)
            .toUpperCase();
        encoded.value = encodedText;
    }

    const decode = () => {
        const text = encoded.value;
        const decodedText = decodeURIComponent(text.replace(/=[\r\n]+/g, ''));
        decoded.value = decodedText;
    }

    decoded.addEventListener('input', encode);
    encoded.addEventListener('input', decode);
});
