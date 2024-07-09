function findSelfInNavPages(navPages, url) {
    for (const page of navPages) {
        if (page.key == url) return page;
        if (page.children) {
            let result = findSelfInNavPages(page.children, url);
            if (result) return result;
            if (url.indexOf('/') != -1) result = findSelfInNavPages(page.children, url.split('/').slice(1).join('/'));
            if (result) return result;
        }
    }

    return null;
};

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

        // remove children from navPages
        pages = pages.filter(p => !element.children.includes(p))

        if (element.children.length > 0) {
            element.html += `<ul class="treemap-children">`
            element.children.forEach(child => {element.html += `<li class="treemap-node"><a href="${child.url}">${child.fileSlug}</a></li>`})
            element.html += `</ul>`
        }

        element.html += `</li>`
        tree.push(element)
    }

    tree.sort((a, b) => a.name > b.name ? 1 : -1) // sort tree by name
    tree.forEach(node => html += node.html) // add html to the treemap

    html += `</ul>`

    return html
};

const buildBreadcrumbs = (navPages, thisPage) => {
    if (!thisPage.url) return ''; // if permalink is false in frontmatter, don't show breadcrumbs
    let targetName = thisPage.url.replace('.html', '').split('/').filter(v => v !== '').join('/');

    let currentPage = findSelfInNavPages(navPages, targetName); // find the current page in the navPages
    if (!currentPage) { // if the page is not in the navPages, don't show breadcrumbs
        console.log(`unable to produce breadcrumbs for ${targetName}.`);
        return '';
    }

    // build the breadcrumbs
    let html = `<nav aria-label="breadcrumbs" id="breadcrumbs">$ <a href="/" id="indx-btn">/</a>`; // home button

    if (currentPage.parent) { // if the page has a parent, add it to the breadcrumbs
        let parentPage = findSelfInNavPages(navPages, currentPage.parent);
        html += `<span class="bc-spacer"> > </span><a class="bc-target" href="${parentPage.url}">${parentPage.key}</a>`;
    }

    html += `<span class="bc-spacer"> > </span><b class="bc-target">${currentPage.title || currentPage.key}</b>`; // add self
    html += `</nav>`;
    return html;
};

module.exports = {buildBreadcrumbs, buildTreemap};
