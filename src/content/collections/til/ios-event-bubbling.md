---
title: "why click events do not work on iOS"
tags: ["ios", "html", "javascript"]
eleventyNavigation:
  key: "ios-event-bubbling"
keywords: ["ios", "html", "javascript", "event bubbling", "event delegation", "event propagation", "event handling"]
created: 2024-08-24
---

recently, while preparing the 22.0 release of this website, I noticed that the
click events on the index page were not working on Apple devices, and as
such the navigation flow was completely broken. This issue was not present on
any other platform that I tested, including other mobile devices and desktop
browsers.

after some quick searches and tests, I found out that the issue was related to
the way iOS handles click events, and it is a known "bug" that has been around
for a while. The problem is that iOS does not handle click events as expected,
and as such, the event delegation mechanism that works on other platforms does
not work on iOS.

the issue is related to the way iOS handles the `click` event, and it is
documented in the [Apple Developer Documentation](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html).

here is the *"offending"* code that was causing the issue:

```javascript
sections.forEach(({ button, section }) => {
    window.addEventListener('click', (event) => { /* ... */ });
});
```

after some investigation
{% ref 'https://www.quirksmode.org/blog/archives/2010/09/click_event_delegation.html', '1' %}
{% ref 'https://www.sitepoint.com/community/t/handling-click-in-the-safari-browser/417837', '2' %}
(and Claude's help), I found out that the issue was related to
[*event bubbling*](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture).
By simply moving the event listener from the `window` object to the `document`
object and flipping the loop to iterate over the sections last, the issue was
fixed.

here is the updated code that works on all platforms:

```javascript
document.addEventListener('click', (event) => {
    sections.forEach(({ button, section }) => { /* ... */ });
});
```

Claude also suggested some other changes to the code, such as introducing
`preventDefault()` for certain events, using `touchend` along with `click` for
better compatibility, and the mentioned change of the loop order, avoiding the
addition of separate event listeners.

*Thanks, Claude!*
