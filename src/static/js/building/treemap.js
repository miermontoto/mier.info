const buildTreemap = (navPages) => {
	let html = `<ul id="treemap">`
	let pages = navPages.filter(p => p.url !== '/' && p.url !== false)
	let tree = []

	while (pages.length > 0) {
		const page = pages.shift()

		let element = {
			name: page.fileSlug,
			html: `<li class="treemap-node"><a href="${page.url}">${page.fileSlug}</a>`,
			children: navPages.filter(p => p.data.eleventyNavigation?.parent === page.fileSlug)
		}

		if (element.children.length > 0) {
			element.html += `<ul class="treemap-children">`
			element.children.forEach(child => { element.html += `<li class="treemap-node"><a href="${child.url}">${child.fileSlug}</a></li>` })
			element.html += `</ul>`
		}

		element.html += `</li>`
		tree.push(element)
	}

	// remove children from tree
	const childSlugs = new Set(tree.flatMap(node => node.children.map(child => child.fileSlug)));
	tree = tree.filter(node => !childSlugs.has(node.name));

	tree.sort((a, b) => a.name > b.name ? 1 : -1) // sort tree by name
	tree.forEach(node => html += node.html) // add html to the treemap

	html += `</ul>`

	return html
};

module.exports = buildTreemap;
