/**
 * @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
 */
!(function(a, b) {
  function c(a, b) {
    const c = a.createElement('p')
    const d = a.getElementsByTagName('head')[0] || a.documentElement
    return (
      (c.innerHTML = 'x<style>' + b + '</style>'),
      d.insertBefore(c.lastChild, d.firstChild)
    )
  }
  function d() {
    const a = t.elements
    return typeof a === 'string' ? a.split(' ') : a
  }
  function e(a, b) {
    let c = t.elements
    typeof c !== 'string' && (c = c.join(' ')),
      typeof a !== 'string' && (a = a.join(' ')),
      (t.elements = c + ' ' + a),
      j(b)
  }
  function f(a) {
    let b = s[a[q]]
    return b || ((b = {}), r++, (a[q] = r), (s[r] = b)), b
  }
  function g(a, c, d) {
    if ((c || (c = b), l)) return c.createElement(a)
    d || (d = f(c))
    let e
    return (
      (e = d.cache[a]
        ? d.cache[a].cloneNode()
        : p.test(a)
        ? (d.cache[a] = d.createElem(a)).cloneNode()
        : d.createElem(a)),
      !e.canHaveChildren || o.test(a) || e.tagUrn ? e : d.frag.appendChild(e)
    )
  }
  function h(a, c) {
    if ((a || (a = b), l)) return a.createDocumentFragment()
    c = c || f(a)
    for (var e = c.frag.cloneNode(), g = 0, h = d(), i = h.length; i > g; g++)
      e.createElement(h[g])
    return e
  }
  function i(a, b) {
    b.cache ||
      ((b.cache = {}),
      (b.createElem = a.createElement),
      (b.createFrag = a.createDocumentFragment),
      (b.frag = b.createFrag())),
      (a.createElement = function(c) {
        return t.shivMethods ? g(c, a, b) : b.createElem(c)
      }),
      (a.createDocumentFragment = Function(
        'h,f',
        'return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(' +
          d()
            .join()
            .replace(/[\w\-:]+/g, function(a) {
              return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")'
            }) +
          ');return n}'
      )(t, b.frag))
  }
  function j(a) {
    a || (a = b)
    const d = f(a)
    return (
      !t.shivCSS ||
        k ||
        d.hasCSS ||
        (d.hasCSS = !!c(
          a,
          'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}'
        )),
      l || i(a, d),
      a
    )
  }
  let k
  let l
  const m = '3.7.3'
  const n = a.html5 || {}
  var o = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i
  var p = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i
  var q = '_html5shiv'
  var r = 0
  var s = {}
  !(function() {
    try {
      const a = b.createElement('a')
      ;(a.innerHTML = '<xyz></xyz>'),
        (k = 'hidden' in a),
        (l =
          a.childNodes.length == 1 ||
          (function() {
            b.createElement('a')
            const a = b.createDocumentFragment()
            return (
              typeof a.cloneNode === 'undefined' ||
              typeof a.createDocumentFragment === 'undefined' ||
              typeof a.createElement === 'undefined'
            )
          })())
    } catch (c) {
      ;(k = !0), (l = !0)
    }
  })()
  var t = {
    elements:
      n.elements ||
      'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',
    version: m,
    shivCSS: n.shivCSS !== !1,
    supportsUnknownElements: l,
    shivMethods: n.shivMethods !== !1,
    type: 'default',
    shivDocument: j,
    createElement: g,
    createDocumentFragment: h,
    addElements: e
  }
  ;(a.html5 = t),
    j(b),
    typeof module === 'object' && module.exports && (module.exports = t)
})(typeof window !== 'undefined' ? window : this, document)
