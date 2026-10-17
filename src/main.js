const frames = [
  ['3/22 12:00', 8, 31, 12, 3400, '의성 안평면 최초 신고'],
  ['3/23 06:00', 18, 24, 19, 6200, '열점이 북동쪽 능선을 따라 확산'],
  ['3/24 18:00', 36, 18, 22, 12400, '안동·청송 경계로 확산'],
  ['3/25 21:00', 68, 13, 25, 21900, '강풍 구간 — 풍속 25 m/s'],
  ['3/26 09:00', 86, 21, 16, 28400, '영덕 해안권 열점 확인'],
  ['3/27 18:00', 93, 37, 8, 31100, '주불 진화 단계']
];
const hot = [[30,67],[37,59],[44,53],[54,48],[63,42],[69,35],[77,29],[82,23],[85,17]];
let index = 3, timer, layers = {wind:true, pop:true, news:true};
const root = document.querySelector('#root');

function metric(k,v,s) { return `<div class="metric"><span>${k}</span><strong>${v}</strong><small>${s}</small></div>`; }
function render() {
  const f = frames[index], points = hot.slice(0, Math.max(2, Math.round(f[1] / 11)));
  root.innerHTML = `<main>
    <header><div><span class="tag">DEMO · 합성 데이터</span><h1>산불추적기 <em>FireTrace Korea</em></h1><p>2025 의성 산불 · 6일의 확산을 시간축 위에서 읽는다</p></div><div class="notice">실시간 경보 서비스 아님<br/>데이터 파이프라인 시연판</div></header>
    <section class="metrics">${metric('활성 열점', `${Math.round(f[1]*4.7)}개`, 'NASA FIRMS 형식')}${metric('순간풍속', `${f[3]} m/s`, f[3]>=25?'강풍 주의':'ASOS 형식')}${metric('상대습도', `${f[2]}%`, f[2]<20?'저습 위험':'ERA5 형식')}${metric('영향권 인구', f[4].toLocaleString(), '읍·면·동 집계')}</section>
    <section class="grid"><article class="map card"><div class="title"><b>확산 추적 지도</b><span>${f[1]}% 경과</span></div><div class="mapbox"><div class="terrain"></div>${layers.pop?'<div class="town a">의성군<br/><strong>27,000</strong></div><div class="town b">영덕군<br/><strong>34,000</strong></div>':''}<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M25 72 C40 60,44 58,55 49 S71 37,86 16"></path>${layers.wind?'<path class="wind" d="M25 30 L47 35 M37 24 L59 29 M53 19 L75 25"></path>':''}${points.map(([x,y],n)=>`<circle cx="${x}" cy="${y}" r="${n===points.length-1?3.6:2.1}" class="${n===points.length-1?'active':''}"></circle>`).join('')}</svg><div class="legend"><i></i> VIIRS/MODIS 열점 <span>━</span> 추정 확산 경로</div></div></article>
    <article class="card narrative"><div class="title"><b>사건 타임라인</b><span>언론·관측 결합</span></div><h2>${f[5]}</h2><p>열점 군집과 바람 벡터를 같은 시간 창으로 정렬한다. 인과관계 판정은 사람이 검토한다.</p>${layers.news?'<div class="headline">📰 “산불 확산, 주민 대피령 확대”<small>'+f[0]+' · 뉴스 수집 시각 표기 예시</small></div>':''}<div class="layer"><b>레이어</b>${Object.entries({wind:'바람',pop:'인구',news:'뉴스'}).map(([k,v])=>`<button data-layer="${k}" class="${layers[k]?'on':''}">${layers[k]?'✓ ':''}${v}</button>`).join('')}</div></article></section>
    <section class="card control"><div class="timeline"><button class="play">${timer?'Ⅱ':'▶'}</button>${frames.map((x,n)=>`<button data-frame="${n}" class="tick ${n===index?'selected':''}"><span></span><small>${x[0]}</small></button>`).join('')}</div><div class="readout"><b>${f[0]}</b><span>열점 확산 지수 ${f[1]} · 습도 ${f[2]}% · 풍속 ${f[3]} m/s</span></div></section>
    <footer>데이터 연결 예정: NASA FIRMS · 기상청 ASOS · ERA5 · 행안부 인구 · 산림청 통계 · 뉴스 API &nbsp;|&nbsp; 이 화면은 시각화 구조 검증용이다.</footer></main>`;
  document.querySelector('.play').onclick = () => { if (timer) { clearInterval(timer); timer = null; } else timer = setInterval(()=>{index=(index+1)%frames.length; render()},900); render(); };
  document.querySelectorAll('[data-frame]').forEach(b=>b.onclick=()=>{ index=Number(b.dataset.frame); render(); });
  document.querySelectorAll('[data-layer]').forEach(b=>b.onclick=()=>{ layers[b.dataset.layer]=!layers[b.dataset.layer]; render(); });
}
render();
