// búsqueda en cliente sobre las tarjetas de TIL mostradas en la página
const SEARCH_ID = 'til-search-input'
const CARD_SELECTOR = '#til-recents .til-card'
const EMPTY_ID = 'til-no-results'

function filterCards(query) {
	const needle = query.trim().toLowerCase()
	const cards = document.querySelectorAll(CARD_SELECTOR)

	// filtra por coincidencia en el texto completo de cada tarjeta (título, tags y descripción)
	const matches = Array.from(cards).filter((card) => {
		const hit = card.textContent.toLowerCase().includes(needle)
		card.hidden = !hit
		return hit
	})

	document.getElementById(EMPTY_ID).hidden = matches.length > 0
}

window.addEventListener('load', () => {
	document.getElementById(SEARCH_ID).addEventListener('input', (event) => filterCards(event.target.value))
})
