// ==UserScript==
// @name        gamemaps.com mature thumb
// @namespace   Violentmonkey Scripts
// @icon        https://www.gamemaps.com/static/img/logo-favicon.png
// @version     1.2.0
// @updateURL   https://raw.githubusercontent.com/rvntn/gamemaps-mature-thumb/main/gamemaps.js
// @downloadURL https://raw.githubusercontent.com/rvntn/gamemaps-mature-thumb/main/gamemaps.js
//
// @match       https://www.gamemaps.com/l4d2/mods*
// @grant       GM_xmlhttpRequest
//
// @author      -
// @description
// ==/UserScript==

// Filter article yang img src-nya mengandung "mature_thumb.png" menggunakan regex
const articles = Array.from(document.querySelectorAll('article')).filter(arti => 
  /mature_thumb\.png/.test(arti.querySelector('img')?.src)
);

// Hentikan script jika tidak ada gambar mature yang terdeteksi
if (!articles.length) return; 

const urls = articles.map(arti => "https://www.gamemaps.com/items/file/" + arti.dataset.id + "/media-thumbs");
const fetchJSON = url => new Promise((resolve, reject) => {
  GM_xmlhttpRequest({
    method: "GET",
    url,
    onload: res => resolve(JSON.parse(res.responseText)),
    onerror: reject
  });
});

Promise.all(urls.map(fetchJSON))
  .then(results => {
    // Ambil semua elemen article sekaligus (lebih efisien)
    results.forEach((res, x) => {
      const firstImgUrl = res.data?.[0]; // Ambil link gambar pertama[cite: 1]

      // Pastikan URL gambar ada, dan elemen article ke-[x] juga ada
      if (firstImgUrl && articles[x]) {
        const imgElement = articles[x].querySelector('img');

        if (imgElement) {
          imgElement.src = firstImgUrl; // Masukkan ke src
        }
      }
    });
  })
  .catch(console.error);