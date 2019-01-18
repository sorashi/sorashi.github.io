---
layout: post
title: A comprehensive list of Rikai extensions
---

There are so many rikai extensions that I got lost when I was trying to find my choice.
I want this to be the go-to article for people who seek not only the full list of rikai
extensions, but also the truth behind their origin.

We'll begin with what you're all here for:

Name|Browser|Repository|Site
----|-------|----|----
nazeka|[Firefox](https://addons.mozilla.org/cs/firefox/addon/nazeka/), works on Android|[GitHub](https://github.com/wareya/nazeka)|None
Rikaichamp|[Firefox](https://addons.mozilla.org/cs/firefox/addon/rikaichamp/)|[GitHub](https://github.com/birtles/rikaichamp)|[Twitter](https://twitter.com/rikaichamp)
rikaichan|[Chrome](https://chrome.google.com/webstore/detail/rikaichan/clidkjbfdlffpbbhlalnkifiehenkjaj?hl=en) & [Firefox](https://addons.mozilla.org/firefox/addon/rikaichan/)|[GitHub](https://github.com/Kalamandea/Rikaichan)|None
rikaikun|[Chrome](https://chrome.google.com/webstore/detail/rikaikun/jipdnfibhldikgcjhfnomkfpcebammhp?hl=en)|[GitHub](https://github.com/melink14/rikaikun)|None
RikaiRebuilt|[Chrome](https://chrome.google.com/webstore/detail/rikairebuilt/bhcfpccmjdpjejaahbblpnikkejnkfcj) & [Firefox](https://addons.mozilla.org/cs/firefox/addon/rikairebuilt/)|[GitHub](https://github.com/Garethp/RikaiRebuilt)|None
Rikaisama|[Firefox](https://sourceforge.net/projects/rikaisama/files/) (XPI, not published on Firefox addon site)|None|[Yes](http://rikaisama.sourceforge.net/)
rikaiXUL|N/A|N/A|[mozdev](http://rikaixul.mozdev.org/)
Yomichan|[Chrome](https://chrome.google.com/webstore/detail/yomichan/ogmnaimimemjmbakcfefmnahgdfhfami) & [Firefox](https://addons.mozilla.org/en-US/firefox/addon/yomichan/)|Not Public|[Yes](https://foosoft.net/projects/yomichan/)

Now some information about some of them:

**nazeka** is a rikai replacement with many interesting features and options, which are listed in the [readme](https://github.com/wareya/nazeka/blob/master/readme.md) of the repository. It also works in Firefox on Android.

**Rikaichamp** is a port of rikaikun, which is a port of rikaichan, which is a port of rikaiXUL. It's very fast.

**rikaichan** is a fork of rikaiXUL, which took over the development. Originally only for Firefox, it was eventually published for Chrome too.

**rikaikun** (Chrome) started as a port of rikaichan to Chrome, when rikaichan
wasn't available for Chrome yet.

**RikaiRebuilt** is a rewrite of Rikaisama for WebExtension API, which aims to keep the structure of the original extension.

**Rikaisama** is a fork of rikachan with many new features and cutomization options, but it is no longer developed and not supported by Firefox anymore.

**rikaiXUL** is an old Firefox add-on on which most of the rikai family members were
based.

**Yomichan** is not a fork, but rather a whole different extension which focuses
not only on dictionaries, but also the learning side of things. It has a built
in integration for Anki, which makes the experience for Anki users a breeze.

### How can I decide on my rikai extension?
Rikaichamp is the latest fork (deepest in the fork tree) with many performance
improvements and an active development community. But you should definitely
check out all the other choices, explore their features and decide which one
has the best feel to it for you.

*Do you know something I don't? Do you want to make this more comprehensible? Make a pull request into this GitHub pages [repo](https://github.com/sorashi/sorashi.github.io)!*