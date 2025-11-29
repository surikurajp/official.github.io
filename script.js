// =======================
// ナビバー
// =======================
function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("show");
}

// =======================
// GSAP Apple風スクロールアニメ
// =======================
gsap.registerPlugin(ScrollTrigger);

gsap.timeline({
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
})
.to("#heroImage", {
  scale: 0.55,
  y: -80,
  opacity: 0.8,
})
.to("#heroTitle", {
  opacity: 0,
}, "<");

// =======================
// 最新ニュース 3件読み込み
// =======================
async function loadLatestNews() {
  const repo = "surikurajp/official.github.io";

  const response = await fetch(`https://api.github.com/repos/${repo}/contents/news`);
  const files = await response.json();

  // 降順
  files.sort((a, b) => new Date(b.name) - new Date(a.name));

  const latest = files.slice(0, 3);

  const container = document.getElementById("latest-news");

  for (const file of latest) {
    const mdResponse = await fetch(file.download_url);
    const mdText = await mdResponse.text();

    const match = mdText.match(/^---\n([\s\S]*?)\n---/);

    let title = "タイトルなし";
    let date = "";
    let body = mdText;

    if (match) {
      const fm = match[1];

      const t = fm.match(/title:\s*(.*)/);
      if (t) title = t[1];

      const d = fm.match(/date:\s*(.*)/);
      if (d) date = new Date(d[1]).toLocaleDateString("ja-JP");

      body = mdText.replace(match[0], "");
    }

    container.innerHTML += `
      <div class="news-card">
        <h3>${title}</h3>
        <p style="color:#777;">${date}</p>
        <div>${marked.parse(body)}</div>
      </div>
    `;
  }
}

loadLatestNews();
