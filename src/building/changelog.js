const buildChangelog = (data) => {
	let content = '<div id="changelog">'

	// sort commits by version
	data.sort((a, b) => {
		return a.version.major > b.version.major ? -1 : 1;
	})

	// if the current version isn't in the changelog, add it manually to the data array
	let currentJson = require('../../package.json')
	let currentVersion = currentJson.version.split('.')
	let currentChannel = currentJson.channel ? ` ${currentJson.channel}` : ''
	if (!data.find(d => d.version.major == currentVersion[1] && d.version.minor == currentVersion[2])) {
		data.unshift({
			"version": {
				"major": currentVersion[1],
				"minor": currentVersion[2]
			},
			"title": `${currentVersion[1]}.${currentVersion[2]}${currentChannel}`,
			"date": "ongoing",
			"message": "<span class='warning'>changelog for this patch will be built in the next version</span>",
			"hash": "main"
		})
	}

	let prevMajor = null
	data.forEach((d) => {
		// if the major version has changed, add a new header
		if (prevMajor != d.version.major) {
			if (prevMajor) content += '<hr>'
			content += `<h1>v${d.version.major}</h1>`
		}
		prevMajor = d.version.major

		// add the commit entry
		content += `<div class="entry hoverborder">
			<span class="title">${d.title}</span>`
		if (d.message) content += `<br><span class="message">${d.message.replace(/\n/g, '<br>')}</span>`
		content += `<a class="date" href="https://github.com/miermontoto/mier.info/commit/${d.hash}" target="_blank">${d.date}</a></div>`
	})
	content += '</div>'
	return content
}

module.exports = buildChangelog;
