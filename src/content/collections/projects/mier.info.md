---
title: mier.info
desc: my personal portfolio, the very website you are looking at right now.
source: https://github.com/miermontoto/mier.info
icons: [eleventy, firebase, sass, markdown, nunjucks, js, json]
star: star
permalink: /this/
redirect_from: [/mier.info/, /self/]
emoji: 🌐
eleventyNavigation:
  key: this
  title: mier.info
---

## intro
this webpage is a collection of my personal projects, a place that I control
that allows me to build and publish my own small ideas.
I've spent a lot of time building it and slowly redefining it,
and even though it's not impressive neither visually nor technically,
it represents my ideas and beliefs.

<br>

## tech
almost everything you see, from the breadcrumbs to the buttons, is handcrafted
and built from scratch with <img src="/assets/icons/tech/eleventy.svg" class="icon" alt="eleventy">,
hosted in <img src="/assets/icons/tech/firebase.svg" class="icon" alt="firebase">,
using <img src="/assets/icons/tech/nunjucks.svg" class="icon" alt="nunjucks">,
<img src="/assets/icons/tech/sass.svg" class="icon" alt="sass">,
<img src="/assets/icons/tech/markdown.svg" class="icon" alt="markdown">
(and a ton of client-side <img src="/assets/icons/tech/js.svg" class="icon" alt="javascript">).

the github repo is connected to firebase hosting through CI/CD using github actions, including the 'beta' branch that hosts the latest changes before going live.

### custom elements
- the [**changelog**](/changelog/) is generated using the git history, first
  processed using a ruby script which generates a json file, which is then
  processed by javascript to generate the html changelog.
- the **breadcrumbs** at the top of the page (which are also used for navigation)
  are generated using the eleventyNavigation keys and processed with javascript
  to statically generate the html navigation bar for each page.
- the [**treemap**](/treemap/) is generated in a similar way to the breadcrumbs,
  using the eleventy collections and processed with javascript to generate the
  html treemap.

<br>

## design
the "design" is a tribute to the legendary
[daft punk 90's website](https://web.archive.org/web/20220223020719/https://daftpunk.com/).
as you can probably tell, it's a very important reference for me,
and even though it doesn't hold up to today's standards,
i've always loved its simplicty and looks.

from December 1st to January 7th every year, there is snow falling
(thanks to [zachleat](https://github.com/zachleat/snow-fall))

several other inspirations:
- [mschf](https://mschf.com/)
- [crlf.link](https://crlf.link/)
- [stacksorted](https://stacksorted.com/)
- [dmaorg / clancy's blog](http://dmaorg.info/)
- [ramsus' portfolio](https://rsms.me/)
- [eduardorl's portfolio](https://eduardorl.vercel.app/)
- [irene mateos' awesome portfolio](https://enerimateos.com/)
- [Things Of Interest](https://qntm.org/)
- [nothing](https://es.nothing.tech/)
