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

function getFeaturedProjects(projects) {
	// remove projects with no "img" frontmatter and projects marked as "hidden"
	let featuredProjects = projects.filter((project) => project.data.img && !project.data.hidden);

	// sort projects with "star" first
	let starred = featuredProjects.filter((project) => project.data.star);
	let unstarred = featuredProjects.filter((project) => !project.data.star);

	return starred.concat(unstarred);
}

function getMainProjects(projects) {
	// remove projects marked as "hidden"
	let mainProjects = projects.filter((project) => !project.data.hidden);

	// remove "featured" projects
	let featuredProjects = getFeaturedProjects(projects);
	let main = mainProjects.filter((project) => !featuredProjects.includes(project));

	// remove "other" projects
	let otherProjects = getOtherProjects(projects);
	return main.filter((project) => !otherProjects.includes(project));
}

function getOtherProjects(projects) {
	return projects.filter((project) => !project.data.hidden && project.data.minor);
}

module.exports = { projectImages, getFeaturedProjects, getMainProjects, getOtherProjects };
