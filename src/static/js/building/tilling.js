function buildTagWall(data) {
	const tags = {}

	data.forEach((element) => {
		element.data.tags.forEach((tag) => {
			if (tags[tag]) { tags[tag] += 1 }
			else { tags[tag] = 1 }
		})
	})

	delete tags.til

	// sort tags by count and then alphabetically
	Object.keys(tags).sort((a, b) => {
		if (tags[a] === tags[b]) { return a > b ? 1 : -1 }
		return tags[a] < tags[b] ? 1 : -1
	})

	return Object.keys(tags).map((tag) => {
		// TODO: size the tags based on the count
		// TODO: make tags clickable to filter the entries
		return `<code class="tag">${tag}</code> <span class="count">${tags[tag]}</span>`
	}).join(' ')
}

function getRecents(data) {
	return data.slice(-10).reverse().map((element) => buildEntry(element)).join(' ');
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

	const date = extractDate(element.page.date) || ''

	return `<div>
		<a href="${element.url}"><span class="til-card-title">${element.data.title}</span></a>
		${tags}
		<span class="til-card-date">${date}</span>
	</div>`
}


function buildDescription(element) {
	// the description is the first characters of the content, removing
	// the HTML tags. stop at 100 characters or at the end of the first line
	let description = element.content.replace(/<[^>]*>?/gm, '').split('\n')[0].substring(0, 100).trim()
	const isLastCharDot = description[description.length - 1] === '.'
	const lastThreeDots = isLastCharDot ? '..' : ' ...'
	description = element.content.length < 100 ? description : `${description}${lastThreeDots}`

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

	return '<li>' + entries.map((element) => buildTitle(element)).join('</li><li>') + '</li>'
}


function buildTimestamps(element) {
	let target = element.inputPath.substring(1)
	target = `https://github.com/miermontoto/mier.info/tree/main${target}`
	return `
		<div class="timestamp"> created: <time datetime="${element.date}">${element.date}</time></div>
		<div class="source">source: <a href="${target}">${element.filePathStem}</a></div>
	`
}

module.exports = { buildTagWall, getRecents, getRelated, buildTimestamps }
