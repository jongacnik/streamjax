# streamjax

*Very* experimental pjax implementation which streams content into container using an [`iframe` and `document.write`](https://jakearchibald.com/2016/fun-hacks-faster-content/)

**Warning: maybe don't use this ☢️**

## Example

```js
var streamjax = require('streamjax')
var sjax = streamjax({
  container: 'main'
})
```

Now on any anchor click, `streamjax` will perform an XHR request and attempt to stream the contents of the request into the container element.

## Heads up

Since the content is *streamed* into the container, there is no way to parse the HTML being XHR'd. This means you must send an html partial with **only** the content which should end up in the container (and you can only update a single container). This differs from traditional pjax implementations where you can send an entire HTML page through the pipes and update multiple containers.

You can pull this off on the server end of things by checking for a `XMLHttpRequest` header and sending a partial. Doable in a static site scenario too with some pre-planning.

## FAQ

### What?

[Pjax](https://github.com/MoOx/pjax) is a super handy way to appify a static site, but the need to complete the entire XHR request before setting `innerHTML` of the container can actually slow things down vs standard page refreshes. Streaming the content as the req is happening lets things get on screen faster.

### Says who?

Some ideas are being thrown around over on the HTML Standard Github about [a way to stream content into an element](https://github.com/whatwg/html/issues/2142). In that thread Jake Archibald links to a write up about performance gains streaming content into an element by [hijacking `iframe` and `doc.write`](https://jakearchibald.com/2016/fun-hacks-faster-content/) vs traditional pjax-style implementations. All credit to Jake on the hard work – thanks! ✨
