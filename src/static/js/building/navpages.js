// construye una lista de páginas navegables para el panel de navegación
const buildNavPages = (navPages, allPages) => {
    const pages = [];

    for (const page of allPages) {
        if (!page.url || page.url === false) continue;
        if (page.data?.url === false) continue; // respeta url: false en frontmatter
        if (page.url === '/') continue;

        const nav = page.data?.eleventyNavigation;
        const key = nav?.key || page.fileSlug;
        const emoji = page.data?.emoji || '';
        const parent = nav?.parent || null;

        pages.push({
            url: page.url,
            key: key,
            emoji: emoji,
            slug: page.fileSlug,
            parent: parent,
            // searchText incluye key, slug y parent para búsqueda
            searchText: `${emoji} ${key} ${page.fileSlug} ${parent || ''}`.toLowerCase()
        });
    }

    pages.sort((a, b) => a.key.localeCompare(b.key));
    return pages;
};

// genera el script inline con los datos de navegación
const buildNavScript = (navPages, allPages) => {
    const pages = buildNavPages(navPages, allPages);
    return `<script>window.__NAV_PAGES__ = ${JSON.stringify(pages)};</script>`;
};

module.exports = { buildNavPages, buildNavScript };
