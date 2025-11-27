import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// ----- 1) 기초 설정
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
const labelsLayer = document.getElementById("labels");
const DPR = Math.max(1, window.devicePixelRatio || 1);

function resize() {
  const w = canvas.clientWidth = window.innerWidth;
  const h = canvas.clientHeight = window.innerHeight;
  canvas.width = w * DPR; canvas.height = h * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); // DPI 스케일
}
window.addEventListener("resize", resize); resize();

// ----- 2) 더미 데이터(실전에서는 Datamuse/서버 응답 사용)
const N = 200; // 수를 늘려도 Canvas면 꽤 버팁니다(수천도 가능)
const nodes = d3.range(N).map(i => ({ id: i, r: 3 + Math.random()*3, score: Math.random() }));
const links = d3.range(N * 1.2).map(() => ({
  source: Math.floor(Math.random() * N),
  target: Math.floor(Math.random() * N)
}));

// ----- 3) 패닝/줌 (줌 레벨에 따라 라벨/링크 LOD 가능)
let transform = d3.zoomIdentity;
const zoom = d3.zoom()
  .scaleExtent([0.2, 4])
  .on("zoom", (ev) => { transform = ev.transform; });
d3.select(canvas).call(zoom);

// ----- 4) 포스 시뮬레이션 (메인 스레드 버전)
const sim = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).distance(d => 30 + (1 - (nodes[d.source.index]?.score||0))*60).strength(0.1))
  .force("charge", d3.forceManyBody().strength(-35))
  .force("center", d3.forceCenter(window.innerWidth/2, window.innerHeight/2))
  .alphaDecay(0.08)
  .on("tick", draw);

// ----- 5) 드래그 (노드 고정 최소 구현)
const drag = d3.drag()
  .subject(dragsubject)
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended);
d3.select(canvas).call(drag);

function dragsubject(event) {
  const [mx, my] = transform.invert([event.x, event.y]);
  let minD = 12, picked = null;
  for (const n of nodes) {
    const dx = mx - n.x, dy = my - n.y, d = Math.hypot(dx, dy);
    if (d < n.r + 6 && d < minD) { minD = d; picked = n; }
  }
  return picked;
}
function dragstarted(event) {
  if (!event.active) sim.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x; event.subject.fy = event.subject.y;
}
function dragged(event) {
  event.subject.fx = transform.invertX(event.x);
  event.subject.fy = transform.invertY(event.y);
}
function dragended(event) {
  if (!event.active) sim.alphaTarget(0);
  event.subject.fx = null; event.subject.fy = null;
}

// ----- 6) 라벨(상위 몇 개만 DOM 오버레이)
const topLabels = nodes
  .slice()
  .sort((a,b)=>b.score-a.score)
  .slice(0, 12)
  .map(n => {
    const el = document.createElement("div");
    el.className = "label";
    el.textContent = `node ${n.id}`;
    labelsLayer.appendChild(el);
    return { n, el };
  });

// ----- 7) 고속 캔버스 렌더
function draw() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  ctx.translate(transform.x, transform.y);
  ctx.scale(transform.k, transform.k);

  // 링크 (줌 아웃이면 링크를 부분적으로 생략 가능)
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  for (const l of links) {
    const a = l.source, b = l.target;
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
  }
  ctx.strokeStyle = "#7dd3fc33";
  ctx.lineWidth = 1;
  ctx.stroke();

  // 노드
  ctx.globalAlpha = 1;
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
    // 연한 시안 단색: score로 알파/크기 조절도 가능
    ctx.fillStyle = "rgba(125, 211, 252, 0.85)";
    ctx.fill();
  }

  ctx.restore();

  // 라벨 위치 업데이트(상위 12개만)
  for (const {n, el} of topLabels) {
    const x = transform.applyX(n.x);
    const y = transform.applyY(n.y - (n.r + 8));
    el.style.left = `${x}px`;
    el.style.top  = `${y}px`;
    el.style.opacity = (transform.k > 0.6) ? 1 : 0; // 줌 레벨에 따라 노출
  }
}
draw();
