! function(e, n) {
  "function" == typeof define && define.amd ? define(["exports"], n) : n("undefined" != typeof exports ? exports : e.dragscroll = {})
}(this, function(e) {
  var n = window,
    t = "mousemove",
    o = "mouseup",
    i = "mousedown",
    l = "addEventListener",
    r = "removeEventListener",
    c = [],
    m = function(e, m) {
      for (e = 0; e < c.length;) m = c[e++], m[r](i, m.md, 0), n[r](o, m.mu, 0), n[r](t, m.mm, 0);
      for (c = document.getElementsByClassName("dragscroll"), e = 0; e < c.length;) ! function(e, r, c, m) {
        e[l](i, e.md = function(e) {
          m = 1, r = e.clientX, c = e.clientY, e.preventDefault(), e.stopPropagation()
        }, 0), n[l](o, e.mu = function() {
          m = 0
        }, 0), n[l](t, e.mm = function(n, t) {
          t = e.scroller || e, m && (t.scrollLeft -= -r + (r = n.clientX), t.scrollTop -= -c + (c = n.clientY))
        }, 0)
      }(c[e++])
    };
  "complete" == document.readyState ? m() : n[l]("load", m, 0), e.reset = m
});