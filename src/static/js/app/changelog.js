// navegación interna sin mover el viewport
const main = document.getElementById('changelog-main')
document.querySelectorAll('.version-link').forEach(link => {
	link.addEventListener('click', e => {
		e.preventDefault()
		const target = document.querySelector(link.getAttribute('href'))
		if (target && main) main.scrollTo({ top: target.offsetTop - main.offsetTop, behavior: 'smooth' })
	})
})
