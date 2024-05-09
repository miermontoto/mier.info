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
}

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

module.exports = buildBreadcrumbs;
