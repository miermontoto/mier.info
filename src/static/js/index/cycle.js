// ciclar entre las imagenes inyectadas para cada proyecto

const cycle = () => {
	const imagesContainers = document.querySelectorAll('.project-images');
	imagesContainers.forEach((container) => {
		const images = container.querySelectorAll('.project-image');
		images[0].classList.add('active');

		// si solo hay una imagen, no hay nada más que hacer :D
		if (images.length === 1) return;

		let index = 0;
		setInterval(() => {
			images.forEach((image) => image.classList.remove('active'));
			images[index].classList.add('active');
			index = (index + 1) % images.length;
		}, 5000);
	});
}

cycle();
