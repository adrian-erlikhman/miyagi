/* The stage on the /learn/ pages: one short lesson the visitor does in the page, checked the way
   miyagi checks it (island, "Not yet" card, Hint / Explain / Show me), plus the waitlist field.
   Three labs: python (a small interpreter), neuron (a NumPy expression) and git (a pretend repository).
   Nothing here talks to a server except the waitlist form, which posts to the same Loops form as the home page.
   Source: site-mock/search-pages/lab.js. build.mjs copies it to learn/lab.js. */
(function () {
  'use strict';
  var d = document;
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || d).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function code(s) { return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>'); }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  var REDUCE = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- the waitlist: same Loops form as the home page, with this page as the source ---------- */
  var LOOPS = 'https://app.loops.so/api/newsletter-form/cmwrg5woo0x9d0jz5hchpdqwl';
  var SOURCE = 'miyagi.study' + location.pathname.replace(/\/$/, '');
  $$('form.join').forEach(function (f) {
    var em = $('input', f), bt = $('button', f), sub = d.getElementById(f.getAttribute('data-sub')), rest = sub.innerHTML, busy = false, joined = false;
    function say(msg, bad) {
      sub.innerHTML = msg ? '<b>' + msg + '</b>' : rest;
      if (bad) { f.classList.remove('bad'); void f.offsetWidth; f.classList.add('bad'); }
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = em.value.trim();
      if (busy) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { say('that email looks off', true); em.focus(); return; }
      busy = true; bt.disabled = true;
      fetch(LOOPS, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'userGroup=waitlist&source=' + encodeURIComponent(SOURCE) + '&email=' + encodeURIComponent(v) })
        .then(function (r) { return r.json().catch(function () { return { success: r.ok }; }).then(function (j) { j.status = r.status; return j; }); })
        .then(function (j) {
          if (j.success) { em.value = ''; joined = true; say("you're on the waitlist. we'll email you when it opens."); return; }
          say(j.status === 429 ? 'too many tries, wait a minute' : /already/i.test(j.message || '') ? "you're already on it" : "couldn't add you, try again", true);
        }, function () { say("couldn't reach the waitlist, try again", true); })
        .then(function () { busy = false; bt.disabled = false; });
    });
    em.addEventListener('input', function () { if ($('b', sub) || joined) { joined = false; say(''); } });
  });
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-join]');
    if (!a) return;
    var i = $('#join input');
    if (!i) return;
    e.preventDefault();
    i.scrollIntoView({ block: 'center', behavior: REDUCE ? 'auto' : 'smooth' });
    i.focus({ preventScroll: true });
  });

  /* ---------- the stage ---------- */
  var stage = $('#stage'), dataEl = $('#lab-data');
  if (!stage || !dataEl) return;
  var D = JSON.parse(dataEl.textContent), N = D.steps.length, step = 0, finished = false, timer = 0, typing = 0, lab;
  var isl = $('#isl'), islTx = $('#islTx'), card = $('#islCard'), panOf = $('#panOf'), panSay = $('#panSay'), dots = $$('#panDots i'),
    btn = $('#btnCheck'), pads = $$('.tree [data-g]'), row = $('tr[data-demo]');
  var X = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 2.5l7 7m0-7l-7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  function watch() {
    clearTimeout(timer);
    isl.classList.remove('open');
    isl.classList.toggle('fin', finished);
    islTx.textContent = finished ? 'Lesson ' + D.lesson + ' passed' : 'Watching · step ' + (step + 1) + ' of ' + N;
  }
  // kind: notyet | hint | explain | ok
  function show(kind, o) {
    clearTimeout(timer);
    var head = kind === 'notyet' ? '<i></i>Not yet' : kind === 'ok' ? '<i class="ok"></i><span class="gr">' + esc(o.head) + '</span>'
      : '<span class="tg ' + (kind === 'hint' ? 'pink' : 'sky') + '">' + (kind === 'hint' ? 'Hint' : 'Explain') + '</span>';
    card.innerHTML = '<div class="ic-h">' + head + '</div>' + (o.title ? '<b>' + code(o.title) + '</b>' : '') + (o.text ? '<p>' + code(o.text) + '</p>' : '') +
      (o.yours != null ? '<div class="cmp"><div><small>Yours</small><code>' + esc(o.yours) + '</code></div><div><small>Expected</small><code>' + esc(o.expected) + '</code></div></div>' : '') +
      (kind === 'ok' ? '' : '<button type="button" class="ic-x" aria-label="Close">' + X + '</button>');
    isl.setAttribute('data-kind', kind);
    isl.classList.add('open');
  }
  function edited() { if (isl.classList.contains('open') && isl.getAttribute('data-kind') !== 'ok') watch(); btn.classList.remove('nudge'); }
  function paint() {
    panOf.textContent = finished ? 'Lesson ' + D.lesson + ' of ' + D.of : 'Step ' + (step + 1) + ' of ' + N;
    dots.forEach(function (el, i) { el.className = finished || i < step ? 'ok' : i === step ? 'cur' : ''; });
    panSay.innerHTML = finished ? esc(D.done) : code(D.steps[step].say);
    stage.classList.toggle('fin', finished);
    var on = Math.round(pads.length * (finished ? N : step) / N);
    pads.forEach(function (g, i) { g.classList.toggle('on', i < on); });
    if (row) row.classList.toggle('ok', finished);
  }
  // Steps up to `upto` (a count) are done.
  function pass(upto) {
    if (finished || upto <= step) return;
    clearInterval(typing);
    if (upto >= N) {
      finished = true; paint();
      show('ok', { head: 'Lesson ' + D.lesson + ' passed', title: D.passLine });
      timer = setTimeout(watch, 5200);
      return;
    }
    step = upto; paint();
    show('ok', { head: 'Step ' + upto + ' done', title: 'Good. Now the next one.' });
    timer = setTimeout(watch, 1700);
  }
  function check() {
    if (finished) return;
    btn.classList.remove('nudge');
    var r = lab.check(step);
    if (r.ok) pass(r.upto); else show('notyet', r);
  }
  function type(text, put, done) {
    clearInterval(typing);
    if (REDUCE || !text) { put(text); if (done) done(); return; }
    var i = 0;
    typing = setInterval(function () {
      i++; put(text.slice(0, i));
      if (i >= text.length) { clearInterval(typing); if (done) done(); }
    }, 24);
  }
  function nudge() { if (!finished) btn.classList.add('nudge'); }

  stage.addEventListener('click', function (e) {
    var t = e.target.closest('button');
    if (!t) return;
    if (t === btn) return check();
    if (t.classList.contains('ic-x')) return watch();
    var a = t.getAttribute('data-act');
    if (a === 'hint') show('hint', { text: D.steps[step].hint });
    if (a === 'explain') show('explain', { text: D.steps[step].explain });
    if (a === 'show') { watch(); lab.show(step); }
    if (a === 'reset') { clearInterval(typing); lab.reset(); step = 0; finished = false; paint(); watch(); lab.focus(); }
  });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isl.classList.contains('open')) watch(); });

  /* ---------- a small Python: numbers, text, variables, print ---------- */
  function PyErr(type, msg) { this.type = type; this.msg = msg; this.line = 0; }
  var PYST = /^(def|if|elif|else|for|while|import|from|class|return|with|try|except|global|pass|break|continue|assert|del|raise)$/;
  var PYKW = /^(and|or|not|in|is|lambda|True|False|None|input|len|range|list|dict|type|open)$/;
  var TN = { i: 'int', f: 'float', s: 'str', n: 'NoneType' };

  function pyLex(s) {
    var t = [], i = 0, m, c, r;
    function str(at) {
      var q = s[at], j = at + 1, v = '';
      while (j < s.length && s[j] !== q) {
        if (s[j] === '\\' && j + 1 < s.length) { j++; v += s[j] === 'n' ? '\n' : s[j] === 't' ? '\t' : s[j]; } else v += s[j];
        j++;
      }
      if (j >= s.length) throw new PyErr('SyntaxError', 'unterminated string literal');
      return { v: v, end: j + 1 };
    }
    while (i < s.length) {
      c = s[i];
      if (c === ' ' || c === '\t' || c === ' ') { i++; continue; }
      if (c === '#') break;
      if ((m = /^(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?/.exec(s.slice(i)))) { t.push({ t: 'num', v: +m[0], f: /[.eE]/.test(m[0]) }); i += m[0].length; continue; }
      if ((m = /^[A-Za-z_]\w*/.exec(s.slice(i)))) {
        c = s[i + m[0].length];
        if ((c === '"' || c === "'") && /^[fF]$/.test(m[0])) { r = str(i + 1); t.push({ t: 'fstr', v: r.v }); i = r.end; continue; }
        t.push({ t: 'name', v: m[0] }); i += m[0].length; continue;
      }
      if (c === '"' || c === "'") { r = str(i); t.push({ t: 'str', v: r.v }); i = r.end; continue; }
      if ((m = /^(\*\*|\/\/|\+=|-=|\*=|\/=|==|!=|<=|>=|[-+*\/%@(),=<>:\[\]{}.])/.exec(s.slice(i)))) { t.push({ t: 'op', v: m[0] }); i += m[0].length; continue; }
      throw new PyErr('SyntaxError', 'invalid syntax');
    }
    return t;
  }
  function pyFloat(v) { return v !== v ? 'nan' : !isFinite(v) ? (v < 0 ? '-inf' : 'inf') : Number.isInteger(v) && Math.abs(v) < 1e16 ? v.toFixed(1) : String(v); }
  function pyStr(x) { return x.k === 'f' ? pyFloat(x.v) : x.k === 'n' ? 'None' : String(x.v); }
  function pyBin(o, a, b) {
    if (o === '+' && a.k === 's' && b.k === 's') return { k: 's', v: a.v + b.v };
    if (o === '+' && a.k === 's') throw new PyErr('TypeError', 'can only concatenate str (not "' + TN[b.k] + '") to str');
    if (o === '*' && a.k === 's' && b.k === 'i') return { k: 's', v: new Array(Math.max(0, b.v) + 1).join(a.v) };
    if (a.k === 's' || b.k === 's' || a.k === 'n' || b.k === 'n') throw new PyErr('TypeError', 'unsupported operand type(s) for ' + o + ": '" + TN[a.k] + "' and '" + TN[b.k] + "'");
    var f = a.k === 'f' || b.k === 'f', x = a.v, y = b.v;
    if ((o === '/' || o === '//' || o === '%') && y === 0) throw new PyErr('ZeroDivisionError', 'division by zero');
    if (o === '+') return { k: f ? 'f' : 'i', v: x + y };
    if (o === '-') return { k: f ? 'f' : 'i', v: x - y };
    if (o === '*') return { k: f ? 'f' : 'i', v: x * y };
    if (o === '/') return { k: 'f', v: x / y };
    if (o === '//') return { k: f ? 'f' : 'i', v: Math.floor(x / y) };
    if (o === '%') return { k: f ? 'f' : 'i', v: x - y * Math.floor(x / y) };
    return { k: f || y < 0 ? 'f' : 'i', v: Math.pow(x, y) };
  }
  function pyCall(name, a, env, out) {
    function num(i) { if (!a[i] || (a[i].k !== 'i' && a[i].k !== 'f')) throw new PyErr('TypeError', name + '() needs a number'); return a[i].v; }
    if (name === 'print') { out.push(a.map(pyStr).join(' ')); return { k: 'n' }; }
    if (name === 'round') { if (a.length > 1) { var m = Math.pow(10, num(1)); return { k: 'f', v: Math.round(num(0) * m) / m }; } return { k: 'i', v: Math.round(num(0)) }; }
    if (name === 'int') return { k: 'i', v: a[0] && a[0].k === 's' ? parseInt(a[0].v, 10) : Math.trunc(num(0)) };
    if (name === 'float') return { k: 'f', v: a[0] && a[0].k === 's' ? parseFloat(a[0].v) : num(0) };
    if (name === 'str') return { k: 's', v: a[0] ? pyStr(a[0]) : '' };
    if (name === 'abs') return { k: a[0] && a[0].k === 'i' ? 'i' : 'f', v: Math.abs(num(0)) };
    if (has(env, name)) throw new PyErr('TypeError', "'" + TN[env[name].k] + "' object is not callable");
    if (PYKW.test(name) || PYST.test(name)) throw new PyErr('Limit', name);
    throw new PyErr('NameError', "name '" + name + "' is not defined");
  }
  function pyFstr(s, env, out) {
    return s.replace(/\{\{|\}\}|\{([^{}]*)\}/g, function (m, e) {
      if (m === '{{') return '{';
      if (m === '}}') return '}';
      var spec = '', k = e.lastIndexOf(':');
      if (k > -1 && !/[()'"]/.test(e.slice(k))) { spec = e.slice(k + 1); e = e.slice(0, k); }
      var v = pyEval(pyLex(e), env, out), f = /^,?\.(\d+)f$/.exec(spec);
      return f && v.k !== 's' && v.k !== 'n' ? v.v.toFixed(+f[1]) : pyStr(v);
    });
  }
  function pyEval(toks, env, out) {
    var p = 0;
    function peek(v) { return p < toks.length && toks[p].t === 'op' && toks[p].v === v; }
    function eat(v) { if (peek(v)) { p++; return true; } return false; }
    function syn(msg) { throw new PyErr('SyntaxError', msg || 'invalid syntax'); }
    function expr() { var a = term(); for (;;) { if (eat('+')) a = pyBin('+', a, term()); else if (eat('-')) a = pyBin('-', a, term()); else return a; } }
    function term() { var a = unary(), o; for (;;) { o = peek('*') ? '*' : peek('/') ? '/' : peek('//') ? '//' : peek('%') ? '%' : ''; if (!o) return a; p++; a = pyBin(o, a, unary()); } }
    function unary() {
      if (eat('-')) { var a = unary(); if (a.k !== 'i' && a.k !== 'f') throw new PyErr('TypeError', "bad operand type for unary -: '" + TN[a.k] + "'"); return { k: a.k, v: -a.v }; }
      if (eat('+')) return unary();
      var b = atom();
      if (eat('**')) b = pyBin('**', b, unary());
      return b;
    }
    function atom() {
      var t = toks[p], a;
      if (!t) syn();
      if (t.t === 'num') { p++; return { k: t.f ? 'f' : 'i', v: t.v }; }
      if (t.t === 'str') { p++; return { k: 's', v: t.v }; }
      if (t.t === 'fstr') { p++; return { k: 's', v: pyFstr(t.v, env, out) }; }
      if (t.t === 'name') {
        p++;
        if (eat('(')) {
          a = [];
          if (!peek(')')) { do { a.push(expr()); } while (eat(',') && !peek(')')); }
          if (!eat(')')) syn(p >= toks.length ? "'(' was never closed" : 'invalid syntax');
          return pyCall(t.v, a, env, out);
        }
        if (has(env, t.v)) return env[t.v];
        if (t.v === 'print' && p < toks.length) syn("Missing parentheses in call to 'print'. Did you mean print(...)?");
        if (PYKW.test(t.v) || PYST.test(t.v)) throw new PyErr('Limit', t.v);
        throw new PyErr('NameError', "name '" + t.v + "' is not defined");
      }
      if (eat('(')) { a = expr(); if (!eat(')')) syn(p >= toks.length ? "'(' was never closed" : 'invalid syntax'); return a; }
      if (t.t === 'op' && /^(==|!=|<=|>=|<|>|:|\[|\{|\.)$/.test(t.v)) throw new PyErr('Limit', t.v);
      syn();
    }
    var v = expr();
    if (p < toks.length) { if (toks[p].t === 'op' && /^(==|!=|<=|>=|<|>|:|\[|\{|\.|@)$/.test(toks[p].v)) throw new PyErr('Limit', toks[p].v); syn(); }
    return v;
  }
  function pyRun(src) {
    var env = {}, out = [], err = null, L = src.replace(/\r/g, '').split('\n'), i, toks, a, b, val;
    for (i = 0; i < L.length && !err; i++) {
      try {
        toks = pyLex(L[i]);
        if (!toks.length) continue;
        if (/^[ \t]/.test(L[i])) throw new PyErr('IndentationError', 'unexpected indent');
        a = toks[0]; b = toks[1];
        if (a.t === 'name' && PYST.test(a.v)) throw new PyErr('Limit', a.v);
        if (a.t === 'name' && b && b.t === 'op' && /^(=|\+=|-=|\*=|\/=)$/.test(b.v)) {
          val = pyEval(toks.slice(2), env, out);
          if (b.v === '=') env[a.v] = val;
          else { if (!has(env, a.v)) throw new PyErr('NameError', "name '" + a.v + "' is not defined"); env[a.v] = pyBin(b.v[0], env[a.v], val); }
        } else pyEval(toks, env, out);
      } catch (e) { if (!(e instanceof PyErr)) throw e; e.line = i + 1; err = e; }
    }
    return { env: env, out: out, err: err };
  }
  function pyTrace(e, file) {
    if (e.type === 'SyntaxError' || e.type === 'IndentationError') return '  File "' + file + '", line ' + e.line + '\n' + e.type + ': ' + e.msg;
    return 'Traceback (most recent call last):\n  File "' + file + '", line ' + e.line + ', in <module>\n' + e.type + ': ' + e.msg;
  }
  var PYWHY = {
    NameError: 'A name has to be set before a line can use it. Check the spelling.',
    SyntaxError: 'Python could not read that line. Look for a missing bracket or quote.',
    IndentationError: 'Lines in this file start at the left edge, with no spaces before them.',
    TypeError: 'Text and numbers do not mix like that.',
    ZeroDivisionError: 'Something is being divided by zero.'
  };
  function pyHl(src) {
    var re = /(#.*$)|(f?(?:"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?))|\b(\d+\.?\d*)\b|\b(print|round|int|float|str|abs)\b(?=\()|\b([A-Za-z_]\w*)\b/gm, out = '', last = 0, m;
    while ((m = re.exec(src))) {
      if (!m[0]) { re.lastIndex++; continue; }
      out += esc(src.slice(last, m.index)) + '<i class="' + (m[1] ? 'hc' : m[2] ? 'hs' : m[3] ? 'hm' : m[4] ? 'hf' : 'hv') + '">' + esc(m[0]) + '</i>';
      last = re.lastIndex;
    }
    return out + esc(src.slice(last));
  }

  var LABS = {};

  /* ---------- lab: python (tip.py) ---------- */
  LABS.python = function () {
    var ta = $('#edTa'), hl = $('#edHl'), nums = $('#edN'), term = $('#termOut'), file = D.file, idle = term.innerHTML, SOL = [], acc = '';
    D.steps.forEach(function (s) { acc += s.show; SOL.push(acc); });
    function sync() {
      var v = ta.value, n = Math.max(7, v.split('\n').length), a = [], i;
      for (i = 1; i <= n; i++) a.push(i);
      nums.textContent = a.join('\n');
      hl.innerHTML = pyHl(v) + '\n';
      hl.scrollLeft = ta.scrollLeft;
    }
    function run() {
      var r = pyRun(ta.value), h = '<span class="dim">$</span> python3 ' + esc(file) + '\n' + esc(r.out.join('\n')) + (r.out.length ? '\n' : '');
      if (r.err) h += r.err.type === 'Limit' ? '<span class="dim">this page runs a small part of python: numbers, variables and print.</span>' : '<span class="er">' + esc(pyTrace(r.err, file)) + '</span>';
      term.innerHTML = h;
      return r;
    }
    function n(x) { return x && (x.k === 'i' || x.k === 'f') ? x.v : null; }
    function miss(name, val, env) {
      var want = name.replace(/_/g, '').toLowerCase(), k;
      for (k in env) if (has(env, k) && k !== name && k.replace(/_/g, '').toLowerCase() === want)
        return { title: 'The name has to be `' + name + '`', text: 'You wrote `' + k + '`. Names have to match exactly.', yours: k + ' = ' + pyStr(env[k]), expected: name + ' = ' + val };
      return { title: '`' + name + '` is not set yet', text: 'Add a line that sets `' + name + '` to ' + val + '.', yours: 'no ' + name, expected: name + ' = ' + val };
    }
    ta.addEventListener('input', function () { sync(); edited(); });
    ta.addEventListener('scroll', function () { hl.scrollLeft = ta.scrollLeft; });
    ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); check(); } });
    sync();
    return {
      check: function (s) {
        if (!ta.value.trim()) return { title: 'Nothing to check yet', text: 'Type the lines for this step in `' + file + '`.' };
        var r = run(), e = r.err, env = r.env;
        if (e && e.type === 'Limit') return { title: 'That is more Python than this page runs', text: 'Numbers, variables and print are enough for this lesson. The app runs the real thing.' };
        if (e) return { title: 'Python stopped on line ' + e.line, text: PYWHY[e.type] || '', yours: e.type + ': ' + e.msg, expected: 'Runs with no error' };
        var bill = n(env.bill), tp = n(env.tip_percent), total = n(env.total), last = r.out.length ? r.out[r.out.length - 1] : '';
        var ok0 = bill === 40 && tp === 20, ok1 = ok0 && total != null && Math.abs(total - 48) < 1e-9,
          ok2 = ok1 && /(^|[^\d.])48(\.0+)?($|[^\d.])/m.test(r.out.join('\n')), upto = ok2 ? 3 : ok1 ? 2 : ok0 ? 1 : 0;
        if (upto > s) return { ok: true, upto: upto };
        if (!ok0) {
          if (bill == null) return miss('bill', '40', env);
          if (bill !== 40) return { title: '`bill` should be 40', text: 'The lesson checks a 40 dollar bill.', yours: 'bill = ' + pyStr(env.bill), expected: 'bill = 40' };
          if (tp == null) return miss('tip_percent', '20', env);
          return { title: '`tip_percent` should be 20', text: tp === 0.2 ? 'Keep it as 20 here. The next step turns it into a share of the bill.' : 'The lesson checks a tip of 20 percent.', yours: 'tip_percent = ' + pyStr(env.tip_percent), expected: 'tip_percent = 20' };
        }
        if (!ok1) {
          if (total == null) return has(env, 'total') ? { title: '`total` should be a number', text: 'Add the tip to the bill.', yours: 'total = ' + pyStr(env.total), expected: 'total = 48.0' }
            : { title: '`total` is not set yet', text: 'Work out the tip first, then add it to the bill.', yours: 'no total', expected: 'total = 48.0' };
          return { title: '`total` should come to 48', yours: 'total = ' + pyStr(env.total), expected: 'total = 48.0',
            text: total === 840 ? 'That is 20 times the bill. 20 percent is 20 out of 100.' : total === 8 ? 'That is the tip alone. Add it to the bill.' : total === 60 ? 'The tip is 20 percent of the bill, not 20 dollars.' : 'The tip is `bill * tip_percent / 100`. The total is the bill plus the tip.' };
        }
        if (!r.out.length) return { title: 'Nothing printed yet', text: 'The file runs, but nothing reaches the terminal.', yours: '(no output)', expected: '48.0' };
        return { title: 'That is not the total', text: 'Print the variable `total`.', yours: last.length > 26 ? last.slice(0, 25) + '…' : last, expected: '48.0' };
      },
      show: function (s) {
        var target = SOL[s], cur = ta.value.replace(/\s+$/, ''), start = target.indexOf(cur) === 0 ? cur : (s ? SOL[s - 1] : '');
        type(target.slice(start.length), function (part) { ta.value = start + part; sync(); }, function () { nudge(); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); });
      },
      reset: function () { ta.value = ''; sync(); term.innerHTML = idle; },
      focus: function () { ta.focus({ preventScroll: true }); }
    };
  };

  /* ---------- lab: neuron (one NumPy expression) ---------- */
  function nnStr(v) {
    if (typeof v === 'number') return pyFloat(v);
    if (!Array.isArray(v)) return String(v);
    var parts = v.map(function (x) { var s = String(x), k = s.indexOf('.'); return k < 0 ? [s, ''] : [s.slice(0, k), s.slice(k + 1)]; }), fr = 0, w = 0;
    parts.forEach(function (q) { fr = Math.max(fr, q[1].length); });
    var cells = parts.map(function (q) { var s = q[0] + '.' + q[1]; while (s.length < q[0].length + 1 + fr) s += ' '; w = Math.max(w, s.length); return s; });
    return '[' + cells.map(function (s) { while (s.length < w) s = ' ' + s; return s; }).join(' ') + ']';
  }
  function nnEval(src, E) {
    var toks = pyLex(src), p = 0;
    function peek(v) { return p < toks.length && toks[p].t === 'op' && toks[p].v === v; }
    function eat(v) { if (peek(v)) { p++; return true; } return false; }
    function syn() { throw new PyErr('SyntaxError', 'invalid syntax'); }
    function tn(v) { return Array.isArray(v) ? 'numpy.ndarray' : typeof v === 'number' ? 'float' : typeof v === 'function' ? 'function' : 'module'; }
    function val(v, o) { if (typeof v !== 'number' && !Array.isArray(v)) throw new PyErr('TypeError', "unsupported operand type(s) for " + o + ": '" + tn(v) + "'"); return v; }
    function ew(o, a, b) {
      val(a, o); val(b, o);
      function f(x, y) { return o === '+' ? x + y : o === '-' ? x - y : o === '*' ? x * y : o === '/' ? x / y : Math.pow(x, y); }
      var A = Array.isArray(a), B = Array.isArray(b);
      if (A && B) { if (a.length !== b.length) throw new PyErr('ValueError', 'operands could not be broadcast together with shapes (' + a.length + ',) (' + b.length + ',)'); return a.map(function (x, i) { return f(x, b[i]); }); }
      if (A) return a.map(function (x) { return f(x, b); });
      if (B) return b.map(function (y) { return f(a, y); });
      return f(a, b);
    }
    function fsum(a) { val(a[0], 'sum'); return Array.isArray(a[0]) ? a[0].reduce(function (s, x) { return s + x; }, 0) : a[0]; }
    function fdot(a) {
      if (a.length < 2) throw new PyErr('TypeError', 'dot() missing required argument');
      var x = val(a[0], 'dot'), y = val(a[1], 'dot');
      if (Array.isArray(x) && Array.isArray(y)) { if (x.length !== y.length) throw new PyErr('ValueError', 'shapes (' + x.length + ',) and (' + y.length + ',) not aligned'); return fsum([ew('*', x, y)]); }
      return ew('*', x, y);
    }
    function fmat(a) { if (!Array.isArray(a[0]) || !Array.isArray(a[1])) throw new PyErr('ValueError', 'matmul: Input operand does not have enough dimensions'); return fdot(a); }
    var NP = { dot: fdot, inner: fdot, vdot: fdot, matmul: fmat, sum: fsum, multiply: function (a) { return ew('*', a[0], a[1]); }, add: function (a) { return ew('+', a[0], a[1]); }, array: function (a) { return a[0]; } };
    function attr(a, k) {
      if (a === NP) { if (has(NP, k)) return NP[k]; throw new PyErr('AttributeError', "module 'numpy' has no attribute '" + k + "'"); }
      if (Array.isArray(a)) {
        if (k === 'dot') return function (g) { return fdot([a, g[0]]); };
        if (k === 'sum') return function () { return fsum([a]); };
        if (k === 'T') return a;
      }
      throw new PyErr('AttributeError', "'" + tn(a) + "' object has no attribute '" + k + "'");
    }
    function expr() { var a = term(); for (;;) { if (eat('+')) a = ew('+', a, term()); else if (eat('-')) a = ew('-', a, term()); else return a; } }
    function term() { var a = unary(); for (;;) { if (eat('*')) a = ew('*', a, unary()); else if (eat('/')) a = ew('/', a, unary()); else if (eat('@')) a = fmat([a, unary()]); else return a; } }
    function unary() { if (eat('-')) return ew('*', -1, unary()); if (eat('+')) return unary(); var a = post(); if (eat('**')) a = ew('**', a, unary()); return a; }
    function list(close) { var L = []; if (!peek(close)) { do { L.push(expr()); } while (eat(',') && !peek(close)); } if (!eat(close)) syn(); return L; }
    function post() {
      var a = prim(), t, i, k;
      for (;;) {
        if (eat('.')) { t = toks[p++]; if (!t || t.t !== 'name') syn(); a = attr(a, t.v); }
        else if (eat('(')) { i = list(')'); if (typeof a !== 'function') throw new PyErr('TypeError', "'" + tn(a) + "' object is not callable"); a = a(i); }
        else if (eat('[')) {
          i = expr(); if (!eat(']')) syn();
          if (!Array.isArray(a)) throw new PyErr('TypeError', "'" + tn(a) + "' object is not subscriptable");
          if (typeof i !== 'number' || i % 1) throw new PyErr('IndexError', 'only integers are valid indices');
          k = i < 0 ? a.length + i : i;
          if (k < 0 || k >= a.length) throw new PyErr('IndexError', 'index ' + i + ' is out of bounds for axis 0 with size ' + a.length);
          a = a[k];
        } else return a;
      }
    }
    function prim() {
      var t = toks[p], a;
      if (!t) syn();
      if (t.t === 'num') { p++; return t.v; }
      if (t.t === 'name') {
        p++;
        if (t.v === 'np') return NP;
        if (has(E, t.v)) return E[t.v];
        if (t.v === 'sum') return fsum;
        if (t.v === 'len') return function (g) { return Array.isArray(g[0]) ? g[0].length : 1; };
        throw new PyErr('NameError', "name '" + t.v + "' is not defined");
      }
      if (eat('(')) { a = expr(); if (!eat(')')) syn(); return a; }
      if (eat('[')) return list(']');
      syn();
    }
    var v = expr();
    if (p < toks.length) syn();
    return v;
  }
  LABS.neuron = function () {
    var inp = $('#nnIn'), out = $('#nnOut');
    var A = { x: [1, 2, 3], w: [0.5, -1, 0.5], b: 0.5 }, B = { x: [2, 0, 1], w: [1, 1, 1], b: 1 };
    function near(a, b) { return typeof a === 'number' && Math.abs(a - b) < 1e-9; }
    inp.addEventListener('input', edited);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); check(); } });
    return {
      check: function (s) {
        var src = inp.value.trim(), want = s ? '0.5' : '0.0', v, v2, e;
        if (!src) { out.textContent = ''; return { title: 'The return line is empty', text: 'Type what `neuron` should give back.' }; }
        try { v = nnEval(src, A); } catch (er) {
          if (!(er instanceof PyErr)) throw er;
          e = er; out.innerHTML = '<span class="er">' + esc(e.type + ': ' + e.msg) + '</span>';
          return { title: e.type === 'NameError' ? 'That name does not exist here' : 'Python could not run that line', yours: e.type + ': ' + e.msg, expected: want,
            text: e.type === 'NameError' ? 'Inside `neuron` you have `x`, `w`, `b` and `np`.' : e.type === 'SyntaxError' ? 'Look for a missing bracket or a stray character.' : 'Check what each part gives back.' };
        }
        if (typeof v === 'function' || (typeof v === 'object' && !Array.isArray(v))) { out.textContent = ''; return { title: 'That is a function, not a number', text: 'Call it with the two arrays: `np.dot(x, w)`.' }; }
        out.textContent = nnStr(v);
        if (Array.isArray(v)) return { title: 'That returns ' + v.length + ' numbers', text: 'Multiplying the arrays gives one result for each input. A neuron also adds them into one number.', yours: nnStr(v), expected: want };
        try { v2 = nnEval(src, B); } catch (er2) { v2 = NaN; }
        var dot = near(v, 0) && near(v2, 3), full = near(v, 0.5) && near(v2, 4);
        if (full) return { ok: true, upto: 2 };
        if (dot && s === 0) return { ok: true, upto: 1 };
        if (dot) return { title: 'The bias is missing', text: 'The weighted sum is right. Now add `b`.', yours: '0.0', expected: '0.5' };
        if (near(v, s ? 0.5 : 0)) return { title: 'Right number, wrong reason', text: 'It gives ' + want + ' for these inputs but not for others. Build it from `x`, `w`' + (s ? ' and `b`.' : '.'), yours: 'fits one case', expected: 'fits any inputs' };
        return { title: s ? 'Not 0.5 yet' : 'Not the dot product yet', text: 'Multiply each input by its weight and add the three results' + (s ? ', then add `b`.' : '.'), yours: nnStr(v), expected: want };
      },
      show: function (s) { type(D.steps[s].show, function (part) { inp.value = part; }, function () { nudge(); inp.focus(); }); },
      reset: function () { inp.value = ''; out.textContent = ''; },
      focus: function () { inp.focus({ preventScroll: true }); }
    };
  };

  /* ---------- lab: git (a pretend repository with one untracked file) ---------- */
  LABS.git = function () {
    var box = $('#tty'), log = $('#ttyOut'), inp = $('#ttyIn'), hist = [], hi = 0, S;
    var PS = '<span class="dim">cookbook %</span> ', HASH = '3f2a91c';
    var FILE = '# Pancakes\n\n- 1 cup flour\n- 1 egg\n- 1 cup milk\n- a pinch of salt';
    var NOTE = '<span class="dim">this page knows status, add, commit, log and diff. the app works in your real terminal.</span>';
    function fresh() { S = { ran: false, staged: false, commits: [] }; log.innerHTML = PS + 'ls\npancakes.md\n'; }
    function put(h) { log.innerHTML += h; box.scrollTop = box.scrollHeight; }
    function words(s) { var a = [], m, re = /"([^"]*)"?|'([^']*)'?|(\S+)/g; while ((m = re.exec(s))) a.push(m[1] != null ? m[1] : m[2] != null ? m[2] : m[3]); return a; }
    function status(commit) {
      if (S.commits.length) return 'On branch main\nnothing to commit, working tree clean';
      if (S.staged) return 'On branch main\n\nNo commits yet\n\nChanges to be committed:\n  (use "git rm --cached &lt;file&gt;..." to unstage)\n\t<span class="g">new file:   pancakes.md</span>\n';
      return 'On branch main\n\n' + (commit ? 'Initial commit' : 'No commits yet') + '\n\nUntracked files:\n  (use "git add &lt;file&gt;..." to include in what will be committed)\n\t<span class="r">pancakes.md</span>\n\nnothing added to commit but untracked files present (use "git add" to track)';
    }
    function git(a) {
      var c = a[0], f = a.slice(1), i, msg, bad;
      if (!c) return 'usage: git &lt;command&gt; [&lt;args&gt;]';
      if (c === 'status') { S.ran = true; return status(); }
      if (c === 'add') {
        if (!f.length) return "Nothing specified, nothing added.\nhint: Maybe you wanted to say 'git add .'?";
        bad = f.filter(function (x) { return !/^(\.|-A|--all|\*|(\.\/)?pancakes\.md)$/.test(x); })[0];
        if (bad) return "fatal: pathspec '" + esc(bad) + "' did not match any files";
        if (!S.commits.length) S.staged = true;
        return '';
      }
      if (c === 'commit') {
        if (!S.staged) return status(true);
        i = f.indexOf('-m'); if (i < 0) i = f.indexOf('-am');
        if (i < 0) { for (i = 0; i < f.length; i++) if (/^(-m|--message=)./.test(f[i])) { msg = f[i].replace(/^(-m|--message=)/, ''); break; } if (msg == null) return '<span class="dim">this page has no editor for the message. add one with -m "your message".</span>'; }
        else { if (f.length <= i + 1) return "error: switch `m' requires a value"; msg = f.slice(i + 1).join(' '); }
        if (!msg.trim()) return 'Aborting commit due to empty commit message.';
        S.commits.push(msg); S.staged = false;
        return '[main (root-commit) ' + HASH + '] ' + esc(msg) + '\n 1 file changed, 6 insertions(+)\n create mode 100644 pancakes.md';
      }
      if (c === 'log') {
        if (!S.commits.length) return "fatal: your current branch 'main' does not have any commits yet";
        return f.indexOf('--oneline') > -1 ? '<span class="y">' + HASH + '</span> ' + esc(S.commits[0])
          : '<span class="y">commit 3f2a91c8d0e4b7a65c1f9e2d4a8b6c0e7f1d3a59</span> (HEAD -&gt; main)\nAuthor: you &lt;you@example.com&gt;\n\n    ' + esc(S.commits[0]) + '\n';
      }
      if (c === 'diff') return S.staged && (f.indexOf('--staged') > -1 || f.indexOf('--cached') > -1) ? 'diff --git a/pancakes.md b/pancakes.md\nnew file mode 100644\n--- /dev/null\n+++ b/pancakes.md\n@@ -0,0 +1,6 @@\n<span class="g">' + esc(FILE.replace(/^/gm, '+')) + '</span>' : '';
      if ((c === 'restore' && f[0] === '--staged') || c === 'reset' || (c === 'rm' && f[0] === '--cached')) { if (!S.commits.length) S.staged = false; return ''; }
      if (c === 'branch') return S.commits.length ? '* <span class="g">main</span>' : '';
      if (c === 'init') return 'Reinitialized existing Git repository in /Users/you/cookbook/.git/';
      if (c === '--version' || c === 'version') return 'git version 2.39.5 (Apple Git-154)';
      if (/^(push|pull|fetch|clone|switch|checkout|merge|rebase|stash|remote|tag|show|config|help|--help|restore|rm|mv)$/.test(c)) return NOTE;
      return "git: '" + esc(c) + "' is not a git command. See 'git --help'.";
    }
    function sh(a) {
      var c = a[0];
      if (c === 'ls') return /a/.test(a[1] || '') && a[1][0] === '-' ? '.  ..  .git  pancakes.md' : 'pancakes.md';
      if (c === 'cat') return !a[1] ? '' : /^(\.\/)?pancakes\.md$/.test(a[1]) ? esc(FILE) : 'cat: ' + esc(a[1]) + ': No such file or directory';
      if (c === 'pwd') return '/Users/you/cookbook';
      if (c === 'whoami') return 'you';
      if (c === 'echo') return esc(a.slice(1).join(' '));
      if (c === 'clear') return null;
      if (c === 'cd') return '<span class="dim">this page stays in cookbook.</span>';
      return 'zsh: command not found: ' + esc(c);
    }
    function upto() { return S.commits.length ? 3 : S.staged ? 2 : S.ran ? 1 : 0; }
    function exec(line) {
      var a = words(line), o;
      put(PS + esc(line) + '\n');
      if (!a.length) return;
      o = a[0] === 'git' ? git(a.slice(1)) : sh(a);
      if (o === null) log.innerHTML = ''; else if (o) put(o + '\n');
      if (upto() > step) pass(upto());
    }
    inp.addEventListener('input', edited);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); var v = inp.value; inp.value = ''; if (v.trim()) { hist.push(v); } hi = hist.length; clearInterval(typing); exec(v); }
      if (e.key === 'ArrowUp' && hi > 0) { e.preventDefault(); inp.value = hist[--hi]; }
      if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ''; }
    });
    box.addEventListener('click', function () { if (!String(window.getSelection())) inp.focus({ preventScroll: true }); });
    fresh();
    return {
      check: function (s) {
        if (upto() > s) return { ok: true, upto: upto() };
        if (s === 0) return { title: 'Nothing run yet', text: 'Type the command after `cookbook %` and press return.', yours: 'no command', expected: 'git status' };
        if (s === 1) return { title: '`pancakes.md` is not staged', text: 'Git still lists it as untracked.', yours: 'untracked', expected: 'staged' };
        return { title: 'No commit yet', text: 'The file is staged and waiting.', yours: '0 commits', expected: '1 commit' };
      },
      show: function (s) { type(D.steps[s].show, function (part) { inp.value = part; }, function () { inp.focus({ preventScroll: true }); }); },
      reset: function () { hist = []; hi = 0; inp.value = ''; fresh(); },
      focus: function () { inp.focus({ preventScroll: true }); }
    };
  };

  lab = LABS[D.kind]();
  paint(); watch();
  // For tests: the engines, without the page.
  window.miyagiLab = { pyRun: pyRun, nnEval: nnEval, nnStr: nnStr, check: check, state: function () { return { step: step, finished: finished }; } };
})();
