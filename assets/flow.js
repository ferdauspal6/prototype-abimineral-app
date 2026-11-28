(function () {
  'use strict';

  const DATA = window.FLOW_DATA;
  if (!DATA) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const shell = $('#flowShell');
  const viewport = $('#flowViewport');
  const world = $('#flowWorld');
  const lanesEl = $('#flowLanes');
  const nodesEl = $('#flowNodes');
  const edgesEl = $('#flowEdges');
  const drawer = $('#flowDrawer');
  const modal = $('#flowModal');
  const printEl = $('#flowPrint');
  const searchInput = $('#flowSearch');
  const viewSelect = $('#flowView');
  const coaBtn = $('#flowCoaToggle');
  const zoomLabel = $('#flowZoomLabel');

  const state = {
    x: 0,
    y: 0,
    scale: 0.8,
    coa: false,
    view: 'all',
    query: '',
    selected: null,
    dragging: null,
    panning: null,
    moved: false
  };

  const laneById = Object.fromEntries(DATA.lanes.map(lane => [lane.id, lane]));
  const nodeById = Object.fromEntries(DATA.nodes.map(node => [node.id, node]));
  const initialPositions = Object.fromEntries(DATA.nodes.map(node => [node.id, { x: node.x, y: node.y }]));

  const laneColors = {
    master: '#64748b',
    order: '#2563eb',
    invoice: '#4f46e5',
    delivery: '#0891b2',
    ar: '#d97706',
    returns: '#e11d48',
    accounting: '#7c3aed'
  };

  const edgeColors = {
    flow: '#93b4f5',
    reference: '#cbd5e1',
    formula: '#fbbf24',
    journal: '#c4b5fd'
  };

  function icon(name, cls = '') {
    return `<svg class="flow-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function nodeVisible(node) {
    if (node.lane === 'accounting') return state.coa;
    if (state.view === 'all') return true;
    if (state.view === 'order') return ['master', 'order', 'invoice'].includes(node.lane);
    if (state.view === 'delivery') return ['order', 'invoice', 'delivery'].includes(node.lane);
    if (state.view === 'ar') return ['delivery', 'ar'].includes(node.lane);
    if (state.view === 'return') return ['invoice', 'returns'].includes(node.lane);
    if (state.view === 'accounting') return state.coa;
    return true;
  }

  function edgeVisible(edge) {
    if (edge.type === 'journal' && !state.coa) return false;
    const from = nodeById[edge.from];
    const to = nodeById[edge.to];
    if (!from || !to) return false;
    return nodeVisible(from) && nodeVisible(to);
  }

  function renderLanes() {
    lanesEl.innerHTML = DATA.lanes.map(lane => `
      <div class="flow-lane" data-lane="${lane.id}" data-tone="${lane.tone}" style="left:${lane.x}px;width:${lane.width}px">
        <div class="flow-lane-head"><b>${escapeHtml(lane.title)}</b><span>${escapeHtml(lane.hint)}</span></div>
      </div>
    `).join('');
  }

  function nodeMarkup(node) {
    const laneTone = laneColors[node.lane] || '#64748b';
    const formulas = (node.formulas || []).slice(0, 1);
    const coa = (node.coa || []).slice(0, 2);
    const accountSide = node.type === 'account' && node.side ? `<span class="flow-account-side">${escapeHtml(node.side)}</span>` : '';
    return `
      <article class="flow-node" data-id="${escapeHtml(node.id)}" data-type="${escapeHtml(node.type || 'entity')}" style="left:${node.x}px;top:${node.y}px;width:${node.w || 300}px;--rail:${laneTone}">
        <div class="flow-node-top">
          <div class="flow-node-icon">${icon(node.icon || 'file')}</div>
          <div class="flow-node-title">
            <div class="kicker">${escapeHtml(node.kicker || '')}</div>
            <h3>${escapeHtml(node.title)}</h3>
          </div>
        </div>
        <span class="flow-role" data-role="${escapeHtml(node.role || 'Sistem')}">${escapeHtml(node.role || 'Sistem')}</span>
        <p class="flow-summary">${escapeHtml(node.summary || '')}</p>
        ${(node.tags || []).length ? `<div class="flow-tags">${node.tags.slice(0, 4).map(tag => `<span class="flow-tag">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
        ${formulas.length ? `<div class="flow-formula-mini"><b>${escapeHtml(formulas[0].label)}</b><br><code>${escapeHtml(formulas[0].expr)}</code></div>` : ''}
        ${coa.length ? `<div class="flow-coa-chips">${coa.map(item => `<span class="flow-coa-chip">${escapeHtml(item.code)}</span>`).join('')}</div>` : ''}
        ${accountSide}
      </article>
    `;
  }

  function renderNodes() {
    nodesEl.innerHTML = DATA.nodes.map(nodeMarkup).join('');
    $$('.flow-node', nodesEl).forEach(el => {
      el.addEventListener('pointerdown', onNodePointerDown);
      el.addEventListener('pointerenter', () => highlightNode(el.dataset.id));
      el.addEventListener('pointerleave', clearHighlight);
    });
    applyVisibility();
  }

  function markerDefs() {
    return `
      <defs>
        ${Object.entries(edgeColors).map(([type, color]) => `
          <marker id="flow-arrow-${type}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"></path>
          </marker>
        `).join('')}
      </defs>
    `;
  }

  function edgeGeometry(edge) {
    const from = nodeById[edge.from];
    const to = nodeById[edge.to];
    if (!from || !to) return null;
    const fw = from.w || 300;
    const tw = to.w || 300;
    const fh = $(`.flow-node[data-id="${from.id}"]`)?.offsetHeight || 150;
    const th = $(`.flow-node[data-id="${to.id}"]`)?.offsetHeight || 150;
    const fx = from.x, fy = from.y;
    const tx = to.x, ty = to.y;
    const gapX = tx - (fx + fw);
    const gapXBack = fx - (tx + tw);
    if (gapX > 30) {
      return horizontalPath(fx + fw, fy + fh / 2, tx, ty + th / 2, 1);
    }
    if (gapXBack > 30) {
      return horizontalPath(fx, fy + fh / 2, tx + tw, ty + th / 2, -1);
    }
    return verticalPath(fx + fw / 2, fy + (ty > fy ? fh : 0), tx + tw / 2, ty + (ty > fy ? 0 : th), ty > fy ? 1 : -1);
  }

  function horizontalPath(x1, y1, x2, y2, dir) {
    const dx = Math.max(60, Math.abs(x2 - x1) * 0.45) * dir;
    const c1x = x1 + dx;
    const c1y = y1;
    const c2x = x2 - dx;
    const c2y = y2;
    const path = `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
    return { path, x1, y1, c1x, c1y, c2x, c2y, x2, y2 };
  }

  function verticalPath(x1, y1, x2, y2, dir) {
    const dy = Math.max(50, Math.abs(y2 - y1) * 0.45) * dir;
    const c1x = x1;
    const c1y = y1 + dy;
    const c2x = x2;
    const c2y = y2 - dy;
    const path = `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
    return { path, x1, y1, c1x, c1y, c2x, c2y, x2, y2 };
  }

  function cubicPoint(g, t) {
    const mt = 1 - t;
    return {
      x: mt * mt * mt * g.x1 + 3 * mt * mt * t * g.c1x + 3 * mt * t * t * g.c2x + t * t * t * g.x2,
      y: mt * mt * mt * g.y1 + 3 * mt * mt * t * g.c1y + 3 * mt * t * t * g.c2y + t * t * t * g.y2
    };
  }

  function renderEdges() {
    const parts = [markerDefs()];
    DATA.edges.forEach(edge => {
      if (!edgeVisible(edge)) return;
      const g = edgeGeometry(edge);
      if (!g) return;
      const id = `edge-${edge.from}-${edge.to}-${edge.type}`;
      parts.push(`<path id="${id}" class="flow-edge" data-type="${edge.type}" data-from="${edge.from}" data-to="${edge.to}" d="${g.path}" marker-end="url(#flow-arrow-${edge.type})"></path>`);
      if (edge.label) {
        const p = cubicPoint(g, 0.5);
        parts.push(`<text class="flow-edge-label" data-edge="${id}" x="${p.x}" y="${p.y - 5}" text-anchor="middle">${escapeHtml(edge.label)}</text>`);
      }
    });
    edgesEl.innerHTML = parts.join('');
  }

  function applyVisibility() {
    $$('.flow-lane', lanesEl).forEach(el => {
      const laneId = el.dataset.lane;
      const visible = laneId === 'accounting' ? state.coa : laneVisible(laneId);
      el.style.display = visible ? '' : 'none';
    });
    $$('.flow-node', nodesEl).forEach(el => {
      const node = nodeById[el.dataset.id];
      el.style.display = node && nodeVisible(node) ? '' : 'none';
    });
    renderEdges();
  }

  function laneVisible(laneId) {
    if (laneId === 'accounting') return state.coa;
    if (state.view === 'all') return true;
    if (state.view === 'order') return ['master', 'order', 'invoice'].includes(laneId);
    if (state.view === 'delivery') return ['order', 'invoice', 'delivery'].includes(laneId);
    if (state.view === 'ar') return ['delivery', 'ar'].includes(laneId);
    if (state.view === 'return') return ['invoice', 'returns'].includes(laneId);
    if (state.view === 'accounting') return laneId === 'accounting';
    return true;
  }

  function applyTransform() {
    world.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
    zoomLabel.textContent = Math.round(state.scale * 100) + '%';
    world.classList.toggle('zoom-far', state.scale < 0.62);
    world.classList.toggle('zoom-mid', state.scale >= 0.62 && state.scale < 0.92);
    world.classList.toggle('zoom-near', state.scale >= 0.92);
  }

  function visibleBounds() {
    const nodes = DATA.nodes.filter(node => nodeVisible(node));
    if (!nodes.length) return { x: 0, y: 0, width: 1200, height: 800 };
    const minX = Math.min(...nodes.map(n => n.x));
    const minY = Math.min(...nodes.map(n => n.y));
    const maxX = Math.max(...nodes.map(n => n.x + (n.w || 300)));
    const maxY = Math.max(...nodes.map(n => n.y + 180));
    return { x: minX, y: minY, width: Math.max(400, maxX - minX), height: Math.max(300, maxY - minY) };
  }

  function sizeShell() {
    const header = document.querySelector('.flow-header');
    if (!header || !shell) return;
    shell.style.height = Math.max(420, window.innerHeight - header.offsetHeight) + 'px';
  }

  function fitView() {
    const bounds = visibleBounds();
    const rect = viewport.getBoundingClientRect();
    const pad = window.innerWidth < 700 ? 22 : 64;
    const minScale = window.innerWidth < 700 ? 0.44 : 0.3;
    const scale = Math.max(minScale, Math.min(1.05, Math.min((rect.width - pad * 2) / bounds.width, (rect.height - pad * 2) / bounds.height)));
    state.scale = scale;
    state.x = (rect.width - bounds.width * scale) / 2 - bounds.x * scale;
    state.y = (rect.height - bounds.height * scale) / 2 - bounds.y * scale;
    applyTransform();
  }

  function zoomAt(factor, clientX, clientY) {
    const rect = viewport.getBoundingClientRect();
    const px = clientX == null ? rect.width / 2 : clientX - rect.left;
    const py = clientY == null ? rect.height / 2 : clientY - rect.top;
    const worldX = (px - state.x) / state.scale;
    const worldY = (py - state.y) / state.scale;
    const next = Math.max(0.28, Math.min(1.7, state.scale * factor));
    state.scale = next;
    state.x = px - worldX * next;
    state.y = py - worldY * next;
    applyTransform();
  }

  function onNodePointerDown(event) {
    if (event.button !== 0) return;
    const el = event.currentTarget;
    if (event.target.closest('button, a, input, select, textarea')) return;
    event.stopPropagation();
    const node = nodeById[el.dataset.id];
    if (!node) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = node.x;
    const originY = node.y;
    let moved = false;
    el.classList.add('dragging');
    try { el.setPointerCapture?.(event.pointerId); } catch (e) {}

    const move = e => {
      const dx = (e.clientX - startX) / state.scale;
      const dy = (e.clientY - startY) / state.scale;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
      if (!moved) return;
      node.x = Math.round(originX + dx);
      node.y = Math.round(originY + dy);
      el.style.left = node.x + 'px';
      el.style.top = node.y + 'px';
      renderEdges();
    };
    const up = () => {
      el.classList.remove('dragging');
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      if (!moved) openDrawer(node.id);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  }

  function startPan(event) {
    if (event.button !== 0) return;
    if (event.target.closest('.flow-node, .flow-drawer, .flow-zoom, .flow-legend, button, a, input, select')) return;
    event.preventDefault();
    const start = { x: event.clientX, y: event.clientY, ox: state.x, oy: state.y };
    viewport.classList.add('panning');
    try { viewport.setPointerCapture?.(event.pointerId); } catch (e) {}
    const move = e => {
      state.x = start.ox + (e.clientX - start.x);
      state.y = start.oy + (e.clientY - start.y);
      applyTransform();
    };
    const up = () => {
      viewport.classList.remove('panning');
      viewport.removeEventListener('pointermove', move);
      viewport.removeEventListener('pointerup', up);
      viewport.removeEventListener('pointercancel', up);
    };
    viewport.addEventListener('pointermove', move);
    viewport.addEventListener('pointerup', up);
    viewport.addEventListener('pointercancel', up);
  }

  function highlightNode(id) {
    const related = new Set([id]);
    DATA.edges.forEach(edge => {
      if (!edgeVisible(edge)) return;
      if (edge.from === id) related.add(edge.to);
      if (edge.to === id) related.add(edge.from);
    });
    $$('.flow-node', nodesEl).forEach(el => {
      if (el.style.display === 'none') return;
      el.classList.toggle('is-dimmed', !related.has(el.dataset.id));
    });
    $$('.flow-edge', edgesEl).forEach(el => {
      const active = el.dataset.from === id || el.dataset.to === id;
      el.classList.toggle('is-dimmed', !active);
    });
    $$('.flow-edge-label', edgesEl).forEach(el => {
      el.style.opacity = '0.35';
    });
  }

  function clearHighlight() {
    $$('.flow-node.is-dimmed', nodesEl).forEach(el => el.classList.remove('is-dimmed'));
    $$('.flow-edge.is-dimmed', edgesEl).forEach(el => el.classList.remove('is-dimmed'));
    $$('.flow-edge-label', edgesEl).forEach(el => { el.style.opacity = ''; });
  }

  function openDrawer(id) {
    const node = nodeById[id];
    if (!node) return;
    state.selected = id;
    $$('.flow-node', nodesEl).forEach(el => el.classList.toggle('selected', el.dataset.id === id));
    const detail = node.detail || {};
    const formulas = node.formulas || [];
    const coa = node.coa || [];
    const lines = detail.lines || [];
    const related = DATA.edges
      .filter(edge => edge.from === id || edge.to === id)
      .map(edge => nodeById[edge.from === id ? edge.to : edge.from])
      .filter(Boolean)
      .filter((node, index, list) => list.findIndex(item => item.id === node.id) === index)
      .slice(0, 8);

    const fields = (detail.fields || []).map(field => `<span class="drawer-field">${escapeHtml(field)}</span>`).join('');
    const formulaHtml = formulas.map(item => `
      <div class="drawer-formula"><div class="label">${escapeHtml(item.label)}</div><code>${escapeHtml(item.expr)}</code></div>
    `).join('');
    const coaRows = (lines.length ? lines : coa).map(item => `
      <div class="drawer-coa-row">
        <span class="side ${item.side === 'Dr' ? 'debit' : 'credit'}">${escapeHtml(item.side)}</span>
        <code>${escapeHtml(item.code || '')}</code>
        <span>${escapeHtml(item.name || '')}</span>
        ${item.note ? `<span class="text-slate-400" style="margin-left:auto;font-size:10px">${escapeHtml(item.note)}</span>` : ''}
      </div>
    `).join('');
    const relatedHtml = related.map(item => `<button class="related-chip" data-related="${escapeHtml(item.id)}">${escapeHtml(item.title)}</button>`).join('');

    drawer.innerHTML = `
      <div class="flow-drawer-head">
        <div class="flow-node-icon">${icon(node.icon || 'file')}</div>
        <div><div class="kicker">${escapeHtml(node.kicker || node.type || '')}</div><h2>${escapeHtml(node.title)}</h2></div>
        <button class="flow-drawer-close" id="flowDrawerClose" aria-label="Tutup detail">${icon('x')}</button>
      </div>
      <div class="flow-drawer-body">
        <div class="drawer-section">
          <h3>Ringkasan</h3>
          <p class="drawer-copy">${escapeHtml(node.summary || '')}</p>
        </div>
        ${(node.tags || []).length ? `<div class="drawer-section"><h3>Penanda</h3><div class="flow-tags">${node.tags.map(tag => `<span class="flow-tag">${escapeHtml(tag)}</span>`).join('')}</div></div>` : ''}
        ${fields ? `<div class="drawer-section"><h3>Data / field</h3><div class="drawer-fields">${fields}</div></div>` : ''}
        ${formulaHtml ? `<div class="drawer-section"><h3>Rumus</h3>${formulaHtml}</div>` : ''}
        ${detail.example ? `<div class="drawer-section"><h3>Contoh</h3><div class="drawer-example">${escapeHtml(detail.example)}</div></div>` : ''}
        ${coaRows ? `<div class="drawer-section"><h3>Akun COA</h3><div class="drawer-coa">${coaRows}</div></div>` : ''}
        ${(detail.notes || []).length ? `<div class="drawer-section"><h3>Catatan sistem</h3><ul class="drawer-list">${detail.notes.map(note => `<li>${escapeHtml(note)}</li>`).join('')}</ul></div>` : ''}
        ${relatedHtml ? `<div class="drawer-section"><h3>Terkait</h3><div class="drawer-related">${relatedHtml}</div></div>` : ''}
        ${node.simulation ? `<div class="drawer-actions"><button class="flow-btn primary" id="flowSimulation">${icon('calculator')} Lihat Simulasi</button></div>` : ''}
      </div>
    `;
    drawer.classList.add('open');
    $('#flowDrawerClose')?.addEventListener('click', closeDrawer);
    $$('[data-related]', drawer).forEach(btn => btn.addEventListener('click', () => focusNode(btn.dataset.related)));
    $('#flowSimulation')?.addEventListener('click', () => openSimulation(node.simulation));
  }

  function closeDrawer() {
    state.selected = null;
    drawer.classList.remove('open');
    $$('.flow-node.selected', nodesEl).forEach(el => el.classList.remove('selected'));
  }

  function focusNode(id) {
    const node = nodeById[id];
    if (!node) return;
    if (!nodeVisible(node)) {
      state.view = 'all';
      viewSelect.value = 'all';
      if (node.lane === 'accounting') setCoa(true);
      applyVisibility();
    }
    const rect = viewport.getBoundingClientRect();
    const width = node.w || 300;
    state.scale = Math.max(0.7, Math.min(1.05, state.scale));
    state.x = rect.width / 2 - (node.x + width / 2) * state.scale;
    state.y = rect.height / 2 - (node.y + 90) * state.scale;
    applyTransform();
    openDrawer(id);
  }

  function openSimulation(key) {
    const sim = DATA.simulations[key];
    if (!sim) return;
    const body = sim.months
      ? `<div class="sim-grid">${sim.months.map(month => `
          <div class="sim-month"><h3>${escapeHtml(month.title)}</h3>
            ${month.steps.map(step => `<div class="sim-step ${step.strong ? 'strong' : ''}"><div class="label">${escapeHtml(step.label)}</div><div class="value">${escapeHtml(step.value)}</div>${step.note ? `<div class="note">${escapeHtml(step.note)}</div>` : ''}</div>`).join('')}
          </div>`).join('')}</div>`
      : `<div class="sim-single">${sim.steps.map(step => `<div class="sim-step ${step.strong ? 'strong' : ''}"><div class="label">${escapeHtml(step.label)}</div><div class="value">${escapeHtml(step.value)}</div>${step.note ? `<div class="note">${escapeHtml(step.note)}</div>` : ''}</div>`).join('')}</div>`;
    modal.innerHTML = `
      <div class="flow-modal-panel">
        <div class="flow-modal-head">
          <div><h2>${escapeHtml(sim.title)}</h2><p>${escapeHtml(sim.subtitle || '')}</p></div>
          <button class="flow-drawer-close" id="flowModalClose" aria-label="Tutup simulasi">${icon('x')}</button>
        </div>
        <div class="flow-modal-body">
          ${body}
          ${sim.formula ? `<div class="sim-formula"><b>Rumus:</b> ${escapeHtml(sim.formula)}</div>` : ''}
          ${sim.footer ? `<div class="sim-footer">${escapeHtml(sim.footer)}</div>` : ''}
        </div>
        <div class="flow-modal-foot"><button class="flow-btn primary" id="flowModalDone">Tutup</button></div>
      </div>
    `;
    modal.classList.add('open');
    $('#flowModalClose')?.addEventListener('click', closeModal);
    $('#flowModalDone')?.addEventListener('click', closeModal);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.innerHTML = '';
  }

  function setCoa(on) {
    state.coa = !!on;
    if (!state.coa && state.view === 'accounting') {
      state.view = 'all';
      if (viewSelect) viewSelect.value = 'all';
    }
    coaBtn.setAttribute('aria-pressed', state.coa ? 'true' : 'false');
    coaBtn.classList.toggle('active', state.coa);
    coaBtn.innerHTML = `${icon(state.coa ? 'eye' : 'eye-off')} <span>${state.coa ? 'Sembunyikan Jurnal' : 'Tampilkan Jurnal'}</span>`;
    applyVisibility();
    if (state.coa) {
      const lane = DATA.lanes.find(item => item.id === 'accounting');
      const rect = viewport.getBoundingClientRect();
      state.scale = Math.min(0.82, Math.max(0.52, state.scale));
      state.x = rect.width - (lane.x + lane.width) * state.scale - 24;
      state.y = 74 - 100 * state.scale;
      applyTransform();
    } else {
      fitView();
    }
  }

  function applySearch() {
    const q = state.query.trim().toLowerCase();
    if (!q) {
      clearHighlight();
      return;
    }
    const matches = new Set();
    DATA.nodes.forEach(node => {
      const haystack = [node.title, node.kicker, node.summary, ...(node.tags || []), ...(node.formulas || []).map(f => f.label + ' ' + f.expr), ...(node.detail?.fields || []), ...(node.coa || []).map(c => c.code + ' ' + c.name)]
        .join(' ')
        .toLowerCase();
      if (haystack.includes(q)) matches.add(node.id);
    });
    $$('.flow-node', nodesEl).forEach(el => {
      if (el.style.display === 'none') return;
      el.classList.toggle('is-dimmed', !matches.has(el.dataset.id));
      el.classList.toggle('search-hit', matches.has(el.dataset.id));
    });
    $$('.flow-edge', edgesEl).forEach(el => {
      el.classList.toggle('is-dimmed', !(matches.has(el.dataset.from) && matches.has(el.dataset.to)));
    });
  }

  function buildPrint() {
    const visibleNodes = DATA.nodes.filter(node => node.type !== 'account');
    const lanes = DATA.lanes.filter(lane => lane.id !== 'accounting');
    const laneSections = lanes.map(lane => {
      const cards = visibleNodes.filter(node => node.lane === lane.id).map(node => `
        <div class="print-card">
          <b>${escapeHtml(node.title)}</b>
          <span>${escapeHtml(node.summary || '')}</span>
          ${(node.formulas || []).slice(0, 1).map(f => `<code>${escapeHtml(f.label)}: ${escapeHtml(f.expr)}</code>`).join('')}
          ${(node.coa || []).length ? `<code>${node.coa.map(c => `${c.side} ${c.code}`).join(' · ')}</code>` : ''}
        </div>
      `).join('');
      return `<div class="print-lane"><div class="print-lane-head">${escapeHtml(lane.title)}</div><div class="print-grid">${cards}</div></div>`;
    }).join('');

    const formulaRows = DATA.nodes
      .filter(node => (node.formulas || []).length)
      .map(node => `<tr><td>${escapeHtml(node.title)}</td><td>${node.formulas.map(f => `<b>${escapeHtml(f.label)}</b><br>${escapeHtml(f.expr)}`).join('<br><br>')}</td></tr>`)
      .join('');

    const coaRows = DATA.nodes
      .filter(node => (node.detail?.lines || node.coa || []).length)
      .map(node => {
        const lines = node.detail?.lines || node.coa || [];
        return `<tr><td>${escapeHtml(node.title)}</td><td>${lines.map(line => `${line.side} ${line.code} ${line.name}`).join('<br>')}</td></tr>`;
      })
      .join('');

    const edgeRows = DATA.edges
      .filter(edge => edge.type !== 'journal')
      .map(edge => `<tr><td>${escapeHtml(nodeById[edge.from]?.title || edge.from)}</td><td>${escapeHtml(edge.label || '')}</td><td>${escapeHtml(nodeById[edge.to]?.title || edge.to)}</td><td>${escapeHtml(edge.type)}</td></tr>`)
      .join('');

    printEl.innerHTML = `
      <div class="print-page">
        <div class="print-title">${escapeHtml(DATA.meta.title)} — ABI Mineral System</div>
        <div class="print-subtitle">${escapeHtml(DATA.meta.subtitle)} · versi ${escapeHtml(DATA.meta.version)}</div>
        ${laneSections}
      </div>
      <div class="print-page">
        <div class="print-title">Rumus &amp; Perhitungan</div>
        <table class="print-table"><thead><tr><th style="width:28%">Kartu</th><th>Rumus</th></tr></thead><tbody>${formulaRows}</tbody></table>
        <div class="print-section-title">Mapping Chart of Accounts</div>
        <table class="print-table"><thead><tr><th style="width:28%">Transaksi</th><th>Jurnal</th></tr></thead><tbody>${coaRows}</tbody></table>
      </div>
      <div class="print-page">
        <div class="print-title">Daftar Relasi</div>
        <table class="print-table"><thead><tr><th>Dari</th><th>Label</th><th>Ke</th><th>Tipe</th></tr></thead><tbody>${edgeRows}</tbody></table>
      </div>
    `;
  }

  function init() {
    sizeShell();
    renderLanes();
    renderNodes();
    if (window.innerWidth < 700) {
      state.view = 'order';
      if (viewSelect) viewSelect.value = 'order';
    }
    setCoa(false);
    applyTransform();
    fitView();
    buildPrint();

    viewport.addEventListener('pointerdown', startPan);
    viewport.addEventListener('wheel', event => {
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.1 : 0.9;
      zoomAt(factor, event.clientX, event.clientY);
    }, { passive: false });

    searchInput?.addEventListener('input', event => {
      state.query = event.target.value;
      applySearch();
    });
    viewSelect?.addEventListener('change', event => {
      state.view = event.target.value;
      if (state.view === 'accounting') setCoa(true);
      applyVisibility();
      clearHighlight();
      fitView();
    });
    coaBtn?.addEventListener('click', () => setCoa(!state.coa));
    $('#flowZoomIn')?.addEventListener('click', () => zoomAt(1.14));
    $('#flowZoomOut')?.addEventListener('click', () => zoomAt(0.88));
    $('#flowFit')?.addEventListener('click', fitView);
    $('#flowReset')?.addEventListener('click', () => {
      DATA.nodes.forEach(node => {
        node.x = initialPositions[node.id].x;
        node.y = initialPositions[node.id].y;
        const el = $(`.flow-node[data-id="${node.id}"]`);
        if (el) { el.style.left = node.x + 'px'; el.style.top = node.y + 'px'; }
      });
      renderEdges();
      fitView();
    });
    $('#flowPrintBtn')?.addEventListener('click', () => { buildPrint(); window.print(); });

    drawer.addEventListener('click', event => {
      if (event.target === drawer) closeDrawer();
    });
    modal.addEventListener('click', event => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        if (modal.classList.contains('open')) closeModal();
        else closeDrawer();
      }
      if (event.key === '/' && document.activeElement !== searchInput) {
        event.preventDefault();
        searchInput?.focus();
      }
    });

    window.addEventListener('resize', () => {
      sizeShell();
      if (!state.selected) fitView();
      renderEdges();
    });
    setTimeout(() => { sizeShell(); renderEdges(); if (!state.selected) fitView(); }, 120);
    const headerEl = document.querySelector('.flow-header');
    if (headerEl && window.ResizeObserver) {
      new ResizeObserver(() => { sizeShell(); renderEdges(); }).observe(headerEl);
    }
    if (document.fonts?.ready) document.fonts.ready.then(() => { sizeShell(); renderEdges(); });
    setTimeout(() => { renderEdges(); }, 120);
  }

  init();
})();
