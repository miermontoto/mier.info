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
		// TODO: ← and → buttons to switch between images (disabling auto cycle)
	});
	html += "</div>";

	return html;
}

// secciones internas del propio sitio (quizzes, til, webutils), no proyectos reales
function getSiteSections(projects) {
	return projects.filter((project) => project.data.section);
}

function getFeaturedProjects(projects) {
	// remove sections, projects with no "img" frontmatter and projects marked as "hidden"
	let featuredProjects = projects.filter((project) => project.data.img && !project.data.hidden && !project.data.section);

	// sort projects with "star" first
	let starred = featuredProjects.filter((project) => project.data.star);
	let unstarred = featuredProjects.filter((project) => !project.data.star);

	return starred.concat(unstarred);
}

function getMainProjects(projects) {
	// remove sections and projects marked as "hidden"
	let mainProjects = projects.filter((project) => !project.data.hidden && !project.data.section);

	// remove "featured" projects
	let featuredProjects = getFeaturedProjects(projects);
	let main = mainProjects.filter((project) => !featuredProjects.includes(project));

	// remove "other" projects
	let otherProjects = getOtherProjects(projects);
	return main.filter((project) => !otherProjects.includes(project));
}

function getOtherProjects(projects) {
	return projects.filter((project) => !project.data.hidden && project.data.minor && !project.data.section);
}

module.exports = { projectImages, getSiteSections, getFeaturedProjects, getMainProjects, getOtherProjects };
