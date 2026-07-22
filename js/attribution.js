/*
 * Atribución de primer toque para el portafolio (deyvidev.com) — Fase 3 del CRM.
 * Sin dependencias ni cookies de terceros:
 *   - Mantiene un id anónimo `ddv_sid` (cookie propia + localStorage de respaldo).
 *   - Captura los UTMs + referrer + landing del PRIMER toque y los conserva.
 *   - Rellena campos ocultos del formulario de contacto (deben existir en el
 *     HTML estático) para que viajen en el POST a Netlify Forms → webhook → CRM.
 *   - Propaga `?sid=` a los enlaces hacia tienda.deyvidev.com (une la sesión
 *     portafolio → tienda: el proxy de la tienda adopta ese sid).
 *   - Registra los clics de WhatsApp en el CRM de la tienda vía sendBeacon.
 *
 * No toca el handler del formulario de js/main.js (que lee FormData al enviar):
 * solo pone valores en inputs que ya existen. NUNCA bloquea un clic ni el envío.
 */
(function () {
  "use strict";

  var SID_KEY = "ddv_sid";
  var ATTR_KEY = "ddv_attr";
  var TIENDA_ORIGIN = "https://tienda.deyvidev.com";
  var TRACK_URL = TIENDA_ORIGIN + "/api/track/whatsapp";
  var MAX_AGE = 60 * 60 * 24 * 180; // 180 días
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

  function readCookie(name) {
    var m = document.cookie.match("(?:^|; )" + name + "=([^;]*)");
    return m ? decodeURIComponent(m[1]) : "";
  }
  function writeCookie(name, value) {
    document.cookie =
      name + "=" + encodeURIComponent(value) +
      "; path=/; max-age=" + MAX_AGE + "; SameSite=Lax" +
      (location.protocol === "https:" ? "; Secure" : "");
  }
  function validSid(s) {
    return typeof s === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(s);
  }
  function randomId() {
    try {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    } catch (e) {
      /* sin crypto: cae al respaldo */
    }
    return "ddv-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  var params = new URLSearchParams(location.search);

  // --- ddv_sid: id anónimo estable ---
  var sid = readCookie(SID_KEY);
  if (!validSid(sid)) {
    try { sid = localStorage.getItem(SID_KEY) || ""; } catch (e) { sid = ""; }
  }
  var incoming = params.get("sid"); // por consistencia si llega uno
  if (validSid(incoming)) sid = incoming;
  if (!validSid(sid)) sid = randomId();
  writeCookie(SID_KEY, sid);
  try { localStorage.setItem(SID_KEY, sid); } catch (e) { /* modo privado */ }

  // --- atribución de primer toque (inmutable) ---
  var attr = null;
  try { attr = JSON.parse(localStorage.getItem(ATTR_KEY) || "null"); } catch (e) { attr = null; }
  if (!attr || typeof attr !== "object") {
    var utm = {};
    UTM_KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) utm[k] = v.slice(0, 200);
    });
    attr = {
      utm: utm,
      ref: (document.referrer || "").slice(0, 512),
      landing: location.pathname.slice(0, 512),
    };
    try { localStorage.setItem(ATTR_KEY, JSON.stringify(attr)); } catch (e) { /* modo privado */ }
  }
  if (!attr.utm || typeof attr.utm !== "object") attr.utm = {};

  // token corto por página, visible en el teléfono de Deyvi
  function pageToken() {
    var slug = location.pathname.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");
    return "pf-" + (slug || "home").slice(0, 24);
  }

  // --- rellena los ocultos del formulario de contacto ---
  function fillForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    function set(name, value) {
      if (!value) return;
      var input = form.querySelector('input[name="' + name + '"]');
      if (input) input.value = value;
    }
    set("sid", sid);
    set("landing", attr.landing);
    UTM_KEYS.forEach(function (k) { set(k, attr.utm[k]); });
  }

  // --- ?sid= en los enlaces hacia la tienda ---
  function linkTienda() {
    var links = document.querySelectorAll('a[href^="' + TIENDA_ORIGIN + '"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (a.getAttribute("data-ddv-sid")) continue;
      var href = a.getAttribute("href");
      a.setAttribute(
        "href",
        href + (href.indexOf("?") === -1 ? "?" : "&") + "sid=" + encodeURIComponent(sid),
      );
      a.setAttribute("data-ddv-sid", "1");
    }
  }

  // --- clics de WhatsApp → CRM de la tienda ---
  function trackWhatsapp(a) {
    try {
      if (!navigator.sendBeacon) return;
      var payload = JSON.stringify({
        site: "portafolio",
        sid: sid,
        cta: a.getAttribute("data-wa-cta") || "portafolio-wa",
        ref_token: pageToken(),
        utm: attr.utm,
        page_path: location.pathname,
        referrer: document.referrer || undefined,
      });
      // String → text/plain (petición "simple"): sin preflight CORS cross-origin.
      navigator.sendBeacon(TRACK_URL, payload);
    } catch (e) {
      /* la analítica nunca rompe el clic */
    }
  }
  function wireWhatsapp() {
    var links = document.querySelectorAll('a[href^="https://wa.me/"]');
    for (var i = 0; i < links.length; i++) {
      (function (a) {
        if (a.getAttribute("data-ddv-wa")) return;
        a.setAttribute("data-ddv-wa", "1");
        // token dentro del texto, solo si el enlace ya lleva mensaje prefijado
        var href = a.getAttribute("href");
        if (href.indexOf("text=") !== -1) {
          a.setAttribute("href", href + encodeURIComponent("\n\n[#" + pageToken() + "]"));
        }
        a.addEventListener("click", function () { trackWhatsapp(a); });
      })(links[i]);
    }
  }

  function init() {
    fillForm();
    linkTienda();
    wireWhatsapp();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
