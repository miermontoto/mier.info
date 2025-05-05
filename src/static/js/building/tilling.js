const maxTagSize = 1.25
const minTagSize = 0.75

function buildTagWall(data) {
	const tags = {}

	data.forEach((element) => {
		element.data.tags.forEach((tag) => {
			if (!tags[tag]) { tags[tag] = {} }
			if (tags[tag].count) { tags[tag].count += 1 }
			else { tags[tag].count = 1 }
		})
	})

	delete tags.til // remove the 'til' tag from the list

	// calculate size by count.
	const maxCount = Math.max(...Object.values(tags).map((tag) => tag.count))
	const minCount = Math.min(...Object.values(tags).map((tag) => tag.count))
	Object.keys(tags).forEach((tag) => {
		const size = (tags[tag].count - minCount) / (maxCount - minCount) * (maxTagSize - minTagSize) + minTagSize
		tags[tag].size = `font-size: ${size}em`
	})

	return Object.keys(tags).sort((a, b) => {
		// sort by count. if the counts are equal, sort by name
		if (tags[a].count > tags[b].count) { return -1 }
		if (tags[a].count < tags[b].count) { return 1 }
		return a.localeCompare(b);
	}).map((tag) => {
		// TODO: make tags clickable to filter the entries
		return `<span class="tag" style="${tags[tag].size}"><code class="tag-name">${tag}</code> <span class="tag-count">${tags[tag].count}</span></span>`
	}).join(' ')
}


function getRecents(data) {
	// sort data by the "created" frontmatter field
	return data.sort((a, b) => {
		if (a.data.created > b.data.created) { return -1 }
		if (a.data.created < b.data.created) { return 1 }
		return 0
	}).slice(-10).map((element) => buildEntry(element)).join(' ');
}


function buildEntry(element) {
	return `<div class="hoverborder til-card">
		${buildTitle(element)}
		<p class="til-desc">${buildDescription(element)}</p>
	</div>`
}


function buildTitle(element) {
	// process tags
	const tags = element.data.tags.map((tag) => {
		if (tag === 'til') { return '' }
		return `<code>${tag}</code>`
	}).join(' ')


	const date = extractDate(element.data.created) || ''

	return `<div>
		<a href="${element.url}"><span class="til-card-title">${element.data.title}</span></a>
		${tags}
		<span class="til-card-date">${date}</span>
	</div>`
}


function buildDescription(element) {
	// ahora, el contenido viene en rawInput en lugar de content
	const content = element.rawInput

	// the description is the first characters of the content, removing
	// the HTML tags. stop at 100 characters or at the end of the first line
	let description = content.replace(/<[^>]*>?/gm, '').split('\n')[0].substring(0, 100).trim()
	const isLastCharDot = description[description.length - 1] === '.'
	const lastThreeDots = isLastCharDot ? '..' : ' ...'
	description = content.length < 100 ? description : `${description}${lastThreeDots}`

	return description
}


// function that extracts the date in format YYYY-MM-DD from the full date
function extractDate(fullDate) {
	const date = new Date(fullDate)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`
}


// function that gets the related entries for the current entry
function getRelated(data, current) {
	const filteredData = data.filter((element) => element.page.fileSlug !== current.fileSlug)

	// the 'current' object doesn't contain tags, so we need to find the
	// corresponding object in 'data' to get the tags.
	const currentTags = data.find((element) => element.page.fileSlug === current.fileSlug).data.tags
	delete currentTags.til
	const entries = filteredData.filter((element) => {
		return element.data.tags.some((tag) => currentTags.includes(tag))
	}).slice(-5)

	// if there are not enough related entries, get the most recent ones
	if (entries.length < 5) {
		// remove the included entries from the data to avoid duplicates
		const dataWithoutEntries = filteredData.filter((element) => !entries.includes(element))
		const remainingEntries = 5 - entries.length
		entries.push(...dataWithoutEntries.slice(-remainingEntries))
	}

	// if there are still no related entries, content will be a simple message
	if (!entries.length) { return 'no related entries found :(' }

	return '<div id="til-related"><li>' + entries.map((element) => buildTitle(element)).join('</li><li>') + '</li></div>'
}


function buildTimestamps(data, element) {
	let target = element.inputPath.substring(1)
	target = `https://github.com/miermontoto/mier.info/tree/main${target}`

	// find the element in the data array
	let fullElement = data.find((entry) => entry.page.fileSlug === element.fileSlug)
	const date = extractDate(fullElement.data.created)

	return `
		<div class="timestamp"> created: <time datetime="${date}">${date}</time></div>
		<div class="source">source: <a href="${target}">${element.filePathStem}</a></div>
	`
}

module.exports = { buildTagWall, getRecents, getRelated, buildTimestamps }
