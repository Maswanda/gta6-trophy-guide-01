// Leonida Trophy Guide: a tracker for the 55 GTA VI PS5 trophies.
// Loads app/data/trophies.json, renders one card per trophy with its official
// name, description and grade plus our own guide and its sources, and keeps
// the earned ticks in localStorage. Filters by kind and grade, a spoiler
// setting that hides story trophies until they are earned, export and import
// of the progress file, and a roadmap to the platinum built from the data.
const KEY = 'leonida-trophy-guide-v1';
const list = document.getElementById('list');
const roadmapList = document.getElementById('roadmapList');
const searchInput = document.getElementById('search');
const kindSelect = document.getElementById('kind');
const gradeSelect = document.getElementById('grade');
const hideEarnedBox = document.getElementById('hideEarned');
const spoilerBox = document.getElementById('spoiler');
const countLine = document.getElementById('countLine');
const earnedCount = document.getElementById('earnedCount');
const progressFill = document.getElementById('progressFill');
const progressSub = document.getElementById('progressSub');

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function gradeLabel(g) {
  return g[0].toUpperCase() + g.slice(1);
}

function kindLabel(t) {
  if (t.missable) return 'Missable';
  return t.kind[0].toUpperCase() + t.kind.slice(1);
}

function isStorySpoiler(t) {
  return t.kind === 'story' && t.id !== 1;
}

function renderRoadmap() {
  roadmapList.replaceChildren();
  for (const step of doc.roadmap) {
    const done = trophies.filter((t) => t.stage === step.stage && earned.has(t.name)).length;
    const total = trophies.filter((t) => t.stage === step.stage).length;
    const li = document.createElement('li');
    const head = document.createElement('div');
    head.className = 'stage-head';
    const title = document.createElement('strong');
    title.textContent = `Stage ${step.stage} — ${step.title}`;
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = `${done} / ${total}`;
    head.append(title, count);
    const detail = document.createElement('p');
    detail.textContent = step.detail;
    li.append(head, detail);
    roadmapList.append(li);
  }
}

function renderProgress() {
  const n = earned.size;
  earnedCount.textContent = String(n);
  progressFill.style.width = `${Math.round((n / trophies.length) * 100)}%`;
  const platinum = trophies.find((t) => t.grade === 'platinum');
  progressSub.textContent =
    platinum && earned.has(platinum.name)
      ? 'Platinum: earned — Leonida Legend!'
      : `Platinum: ${trophies.length - n} to go`;
}

function trophyCard(t) {
  const card = document.createElement('article');
  card.className = `card grade-${t.grade}${t.missable ? ' is-missable' : ''}${earned.has(t.name) ? ' is-earned' : ''}`;

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.className = 'tick';
  box.checked = earned.has(t.name);
  box.setAttribute('aria-label', `Mark ${t.name} earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name);
    else earned.delete(t.name);
    save();
    renderAll();
  });

  const body = document.createElement('div');
  body.className = 'card-body';

  const titleRow = document.createElement('div');
  titleRow.className = 'title-row';
  const name = document.createElement('h3');
  name.textContent = t.name;
  const grade = document.createElement('span');
  grade.className = `grade grade-${t.grade}`;
  grade.textContent = gradeLabel(t.grade);
  titleRow.append(name, grade);

  const desc = document.createElement('p');
  desc.className = 'official';
  desc.textContent = t.description;

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = `${kindLabel(t)} · Stage ${t.stage}${t.missable ? ' · MISSABLE — do it before it passes' : ''}`;

  const guide = document.createElement('p');
  guide.className = 'guide';
  guide.textContent = t.guide;

  const sources = document.createElement('p');
  sources.className = 'sources';
  sources.textContent = `Sources: ${t.sources.join('; ')}`;

  body.append(titleRow, desc, meta, guide, sources);
  card.append(box, body);
  return card;
}

function spoilerCard(t) {
  const card = document.createElement('article');
  card.className = 'card is-hidden-story';
  const body = document.createElement('div');
  body.className = 'card-body';
  const name = document.createElement('h3');
  name.textContent = 'Story trophy — hidden until earned';
  const note = document.createElement('p');
  note.className = 'guide';
  note.textContent = 'Spoiler-safe mode hides this story trophy. Earn it in the game, then tick it off here to reveal it.';
  body.append(name, note);
  card.append(body);
  return card;
}

function renderAll() {
  renderRoadmap();
  renderProgress();
  const q = searchInput.value.trim().toLowerCase();
  const kind = kindSelect.value;
  const grade = gradeSelect.value;
  const hideEarned = hideEarnedBox.checked;
  const spoiler = spoilerBox.checked;

  const shown = [];
  list.replaceChildren();
  for (const t of trophies) {
    if (hideEarned && earned.has(t.name)) continue;
    if (grade !== 'all' && t.grade !== grade) continue;
    if (kind === 'missable' && !t.missable) continue;
    if (kind === 'online') continue;
    if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) continue;
    if (q && !(t.name.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) continue;
    shown.push(t);
    if (spoiler && isStorySpoiler(t) && !earned.has(t.name)) {
      list.append(spoilerCard(t));
    } else {
      list.append(trophyCard(t));
    }
  }
  countLine.textContent =
    shown.length === trophies.length
      ? `Showing all ${trophies.length} trophies.`
      : `Showing ${shown.length} of ${trophies.length} trophies.`;
}

document.getElementById('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify({ app: 'leonida-trophy-guide', earned: [...earned] }, null, 2)], { type: 'application/json' }),
  );
  a.download = 'leonida-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    const valid = new Set(trophies.map((t) => t.name));
    earned = new Set((names ?? []).filter((n) => valid.has(n)));
    save();
    renderAll();
  } catch {
    alert('That file is not a Leonida Trophy Guide progress file.');
  }
  e.target.value = '';
});

searchInput.addEventListener('input', renderAll);
kindSelect.addEventListener('change', renderAll);
gradeSelect.addEventListener('change', renderAll);
hideEarnedBox.addEventListener('change', renderAll);
spoilerBox.addEventListener('change', renderAll);

// Shareable views: ?kind=missable&grade=silver&spoiler=1&hide-earned=1 set the
// filters on load, so a filtered view can be linked to.
const params = new URLSearchParams(location.search);
if (params.get('kind') && [...kindSelect.options].some((o) => o.value === params.get('kind'))) kindSelect.value = params.get('kind');
if (params.get('grade') && [...gradeSelect.options].some((o) => o.value === params.get('grade'))) gradeSelect.value = params.get('grade');
if (params.get('spoiler') === '1') spoilerBox.checked = true;
if (params.get('hide-earned') === '1') hideEarnedBox.checked = true;
if (params.get('q')) searchInput.value = params.get('q');

renderAll();
