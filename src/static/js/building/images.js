/**
 * Function that finds all the images in a project and injects them into the
 * project page in HTML.
 *
 * @param {String} project - The project title
 */
function projectImages(project, images) {
	const projectImages = images[project];
	if (!projectImages) return "";

	let html = "<div class='project-images'>";
	projectImages.forEach((image) => {
		html += `<img src="/assets/media/projects/${project}/${image}" alt="${project}" class="project-image" />`;
	});
	html += "</div>";

	return html;
}

module.exports = projectImages;
