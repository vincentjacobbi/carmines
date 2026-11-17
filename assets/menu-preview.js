// Staging only: /menu.html?preview=1 re-renders the menu from the owner editor's unpublished draft
// (saved in this browser by /admin/), so Kelly can see her changes on the real page before publishing.
// Mirrors itemRow/addsRow in build.mjs; the pasta drawings in the bowl section are left as built.
(function () {
  if (!/[?&]preview=1/.test(location.search)) return;
  let draft;
  try { draft = JSON.parse(localStorage.getItem("carmines-menu-draft")); } catch (e) { return; }
  if (!draft) return;
  const esc = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const money = (n) => (typeof n === "number" ? n.toFixed(2) : "$ —");
  const item = (i) => `<div class="item${i.feature ? " feature" : ""}"><div class="head"><span class="nm">${esc(i.n)}</span>${i.p != null ? `<span class="pr">${money(i.p)}</span>` : ""}${i.v && i.p == null ? i.v.map(([l, p]) => ` <span class="pr"><span class="opt-l">${esc(l)}</span> ${money(p)}</span>`).join("") : ""}</div>${i.d ? `<div class="ds">${esc(i.d)}</div>` : ""}</div>`;
  draft.sections.forEach((s) => {
    const el = document.getElementById(s.id);
    if (!el) return;
    el.querySelectorAll(".item").forEach((x) => x.remove());
    const anchor = s.id === "bowl" ? el.querySelector(".rule-head.sm") : null;
    const html = s.items.filter((i) => !i.hidden).map(item).join("");
    if (anchor) anchor.insertAdjacentHTML("beforebegin", html); else el.querySelector(".adds") ? el.querySelector(".adds").insertAdjacentHTML("beforebegin", html) : el.insertAdjacentHTML("beforeend", html);
  });
  const bar = document.createElement("div");
  bar.className = "demo-banner";
  bar.style.cssText = "background:#5f1722;position:sticky;top:0;z-index:30";
  bar.innerHTML = `<b>Preview of your unpublished changes</b> · <a href="/admin/#menu" style="color:#fff">Back to the editor</a>`;
  document.body.prepend(bar);
})();
