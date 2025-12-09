function buildKeywords(pkg) {
	if (!pkg.keywords) {
		console.log('keywords not found in package.json');
		return '';
	}
	return `<meta name="keywords" content="${pkg.keywords.join(', ')}">`;
}

function buildVersionTag(pkg, page) {
	let version = pkg.version;
	let channel = pkg.channel && pkg.channel !== 'RTW' ? ` (${pkg.channel})` : '';
	let current = page?.url === '/changelog/' ? ' current' : '';
	return `<a id="version-tag" class="${current}" href="/changelog/">${version}${channel}</a>`;
}

module.exports = { buildKeywords, buildVersionTag };
