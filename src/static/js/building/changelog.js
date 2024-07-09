const checkCurrent = (data) => {
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
		"title": `${currentVersion[1]}.${currentVersion[2]}${currentChannel}`,
		"date": "ongoing",
		"message": "<span class='warning'>this version hasn't been published yet.</span>",
		"hash": "main"
	})
}


const processTitle = (title) => {
	let content = `<span class="title">`

	const parts = title.split(': ')
	content += parts[0]

	if (parts.length > 1) {
		content += `<span class="subtitle"> ${parts.slice(1).join(': ')}</span>`
	}

	content += `</span>`
	return content
}

const buildChangelog = (data) => {
	let content = '<div id="changelog">'

	// sort commits by version
	data.sort((a, b) => { return a.version.major > b.version.major ? -1 : 1 })

	// if the current version isn't in the changelog,
	// add it manually to the data array
	checkCurrent(data)

	let prevMajor = null
	data.forEach((d) => {
		// if the major version has changed, add a new header
		if (prevMajor != d.version.major) {
			if (prevMajor) content += '</div><hr>'
			content += `<div id="version-${d.version.major}"><h1>v${d.version.major}</h1>`
		}
		prevMajor = d.version.major

		// add the commit entry
		content += `<div class="entry hoverborder">`
		content += processTitle(d.title)
		if (d.message) content += `<br><span class="message">${d.message.replace(/\n/g, '<br>')}</span>`
		content += `<a class="date" href="https://github.com/miermontoto/mier.info/commit/${d.hash}" target="_blank">${d.date}</a></div>`
	})
	content += '</div>'

	return content
}

module.exports = buildChangelog;
