---
title: epiCalendar
tags: projects
desc: web (and python) app that downloads your personal University of Oviedo calendar in ICS or CSV format.
source: https://github.com/miermontoto/epiCalendar
demo: https://epicalendar.mier.info
permalink: /epiCalendar/
---

## JSESSION tutorial
1. Inicia sesión en el [SIES](https://sies.uniovi.es/serviciosacademicos/) con tu cuenta.
2. Abre las herramientas de desarrollador de tu navegador (F12).
3. Ve a la pestaña de almacenamiento:
    - En Chrome y derivados, ve a la pestaña `Application`.
    - En Firefox, ve a la pestaña `Storage`.
4. Copia el valor de la cookie `JSESSIONID`.
    - En caso de haber varias, copia el valor de la cookie que tenga `path: /serviciosacademicos`.
5. Pega el valor en el campo de texto de la página de epiCalendar.

<img src="https://github.com/Bimo99B9/autoUniCalendar/blob/main/assets/cookies.jpg?raw=true" width="1000em" alt="JSESSIONID cookie"/>
