module.exports = {
	eleventyNavigation: {
		key: (data) => data.title,
		title: (data) => data.title,
		order: (data) => data.order,
		parent: (data) => data.parent,
		url: (data) => data.url,
		permalink: (data) => data.url,
	}
}
