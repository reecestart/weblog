---
author: Reece
categories: Tech
comments: true
date: 2022-01-28T11:19:00+10:00
tags:
- Performance
- Timing
- Stats
- JavaScript
title: "Performance and Timing Stats"
url: /2022/01/28/performance-timing-stats/
draft: true
description: "Adding Performance and Timing Stats to Hugo"
---

![Performance Timing Stats](/public/img/performance-timing-stats.webp)
*Photo by [Chris Liverani](https://unsplash.com/@chrisliverani) on [Unsplash](https://unsplash.com)*

Performance is important. Page load times are important. Slow page loading times equal less engagement, lower page rank, less hits. It goes on and on.

I came across José Pérez's blog where at the bottom of his page it said:

>This page loaded in 1.51 seconds. FCP was 0.71 seconds. More info.

Intriguing. The More info led to [his blog post](https://jmperezperez.com/page-load-footer/) and a code snippet I could potentially incorporate into my Hugo blog site.

I create the partial `pageload.html` and tried to add it to the default `single.html` page for general posts but got this error:

![JavaScript Uncaught TypeError](/public/img/javascript-uncaught-typeerror.webp)

Time to try and debug this.

After installing a VS Code JavaScript debugger I can see a few issues:

![JavaScript Debugging](/public/img/javascript-debugging.webp)

Seems [`Performance.timing`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/timing) has been deprecated. The blog post from José is from 2018. The MDN Web Docs recommend using `PerformanceNavigationTiming` instead. After updating it seemed that the null stats were because I had the partial placed towards the top of the post, and as the page hadn't rendered the timing stats hadn't been calculated yet. Moving towards the bottom removed the `timingStats is null` error. But it still wasn't outputting any text on the page.

After adding `var` before `window` I got the `pageload.js` to finally load. Then outputting to the console I saw:

>This page loaded in NaN seconds.

After more time than I would like to admit I eventually was chatting to a mate who had a recommendation to use [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) similar to [this blog post](https://www.html5rocks.com/en/tutorials/webperformance/basics/) and wouldn't you know: works a treat.

{{< highlight js "linenos=true,linenostart=1,style=dracula" >}}
var before_loadtime = new Date().getTime();
window.onload = Pageloadtime;
function Pageloadtime() {
    var aftr_loadtime = new Date().getTime();
    // Time calculating in seconds  
    pgloadtime = (aftr_loadtime - before_loadtime) / 1000

    document.getElementById("loadtime").innerHTML = "Page load time - <b>" + pgloadtime + "</b></font> seconds";
}
{{< / highlight >}}

Then added this to the bottom of the `single.html` page:

{{< highlight html "linenos=true,linenostart=1,style=dracula" >}}
{{- end }}
<script defer src="/js/pageload.js"></script>  
<span id="loadtime" class="post-date"></span>  
{{- partial "default_foot.html" . -}}
{{< / highlight >}}

And that's about it.