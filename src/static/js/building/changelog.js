const checkCurrent = (data, pkg) => {
	let currentJson = require('../../../../package.json')
	let currentVersion = currentJson.version.split('.')
	let currentChannel = currentJson.channel ? ` ${currentJson.channel}` : ''

	// if the current version is already in the changelog, return
	if (data.find(d => d.version.major == currentVersion[1] && d.version.minor == currentVersion[2])) return

	data.unshift({
		"version": {
			"major": currentVersion[1],
			"minor": currentVersion[2]
		},
		"title": `${currentVersion[1]}.${currentVersion[2]}${currentChannel.includes("RTW") ? "" : currentChannel}`,
		"date": "ongoing",
		"message": "<span class='warning'>this version hasn't been published yet.</span>",
		"hash": "main"
	})
}


const processTitle = (title) => {
	let content = `<span class="title">`

	const parts = title.split(': ')
	content += parts[0].replace(' RTW', '')

	if (parts.length > 1) {
		content += `<span class="subtitle"> ${parts.slice(1).join(': ')}</span>`
	}

	content += `</span>`
	return content
}


const buildVersionsCollapsible = (data) => {
	const majors = new Set(data.map(d => d.version.major))

	let content = '<nav id="versions-sidebar"><div class="versions-header">VERSIONS</div><ul class="versions-list">'

	majors.forEach((major) => {
		const versions = data.filter(d => d.version.major == major)
		const fromDate = versions.slice(-1)[0].date
		const toDate = versions[0].date

		content += `<li class="version-item">
			<a href="#version-${major}" class="version-link" data-version="${major}">
				<span class="version-number">v${major}</span>
				<span class="version-range">${fromDate} → ${toDate}</span>
			</a>
		</li>`
	})
	content += '</ul></nav>'
	return content
}


const buildChangelog = (data, pkg) => {
	// sort commits by version
	data.sort((a, b) => { return a.version.major > b.version.major ? -1 : 1 })

	// if the current version isn't in the changelog,
	// add it manually to the data array
	checkCurrent(data, pkg)

	// build the sidebar and main content container
	let content = '<div id="changelog-container">'
	content += buildVersionsCollapsible(data)
	content += '<main id="changelog-main">'

	let prevMajor = null
	data.forEach((d) => {
		// if the major version has changed, add a new section header
		if (prevMajor != d.version.major) {
			if (prevMajor) content += '</section>'
			content += `<section id="version-${d.version.major}" class="version-section">
				<div class="version-header">
					<h1 class="version-title">v${d.version.major}</h1>
				</div>`
		}
		prevMajor = d.version.major

		// add the commit entry
		const shortHash = d.hash.substring(0, 7)
		content += `<div class="changelog-entry">`
		content += `<div class="entry-header">`
		content += processTitle(d.title)
		content += `<a class="entry-date" href="https://github.com/miermontoto/mier.info/commit/${d.hash}" target="_blank" rel="noopener noreferrer" data-hash="${shortHash}">${d.date}</a>`
		content += `</div>`
		if (d.message) content += `<div class="entry-message">${d.message.replace(/\n/g, '<br>')}</div>`
		content += `</div>`
	})

	content += '</section></main></div>'

	return content
}

module.exports = buildChangelog;
