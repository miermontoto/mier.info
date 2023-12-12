---
title: epiCalendar
desc: web (and python) app that downloads your personal University of Oviedo calendar in ICS or CSV format.
source: https://github.com/miermontoto/epiCalendar
demo: https://epicalendar.mier.info
permalink: /epiCalendar/
redirect_from: /epicalendar/
icons: [flask, python, react, heroku]
img: true
lang: es
star: star
emoji: 📅
buttons: [
    {'url': 'https://epicalendar.mier.info', 'img': '<span class="ico">🌐</span>', 'text': 'página web'}
]
eleventyNavigation:
  key: epicalendar
  title: epiCalendar
---

## cómo extraer tu JSESSIONID
1. Inicia sesión en el [SIES](https://sies.uniovi.es/serviciosacademicos/) con tu cuenta.
2. Abre las herramientas de desarrollador de tu navegador (F12).
3. Ve a la pestaña de almacenamiento:
    - En Chrome y derivados, ve a la pestaña `Application`.
    - En Firefox, ve a la pestaña `Storage`.
4. Copia el valor de la cookie `JSESSIONID`.
    - En caso de haber varias, copia el valor de la cookie que tenga `path: /serviciosacademicos`.
5. Pega el valor en el campo de texto de la página de epiCalendar.

<img src="/assets/media/projects/epicalendar/jsessionid.png" width="85%" alt="imagen de cómo extrar la cookie JSESSIONID de tu navegador">
