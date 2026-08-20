/* =========================================================
   Presenter layer — Presence Before Synchronization
   - image slots that degrade to labelled placeholders
   - pacing clock against a per-slide time budget
   - on-screen notes overlay (works from file:// too)
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 1. image slots -------------------------------------------- */
  /* Every <img data-slot> falls back to a dashed placeholder naming the file
     it wants, so the deck is fully presentable before the assets land.      */

  function installSlots() {
    document.querySelectorAll('img[data-slot]').forEach(function (img) {
      img.addEventListener('error', function () {
        if (img.dataset.replaced) return;
        img.dataset.replaced = '1';

        var slot = document.createElement('div');
        slot.className = 'slot';

        var file = document.createElement('div');
        file.className = 'slot-file';
        file.textContent = img.dataset.slot;

        var desc = document.createElement('div');
        desc.className = 'slot-desc';
        desc.textContent = img.dataset.desc || '';

        slot.appendChild(file);
        slot.appendChild(desc);
        img.replaceWith(slot);
      });
      // force the handler for images that already failed before JS ran
      if (img.complete && img.naturalWidth === 0) {
        img.dispatchEvent(new Event('error'));
      }
    });
  }

  /* ---------- 1b. slide header ------------------------------------------- */
  /* One running-head line naming the section the slide belongs to, then the
     slide's own title. body[data-sections] maps the short key used by the
     pacing clock (data-sec) to the sentence shown on the slide, so the wording
     lives in index.html rather than in here. */

  function sectionLabels() {
    var raw = document.body.dataset.sections || '';
    try {
      var obj = JSON.parse(raw);
      if (obj && typeof obj === 'object') return obj;
    } catch (_) { /* fall through to the older pipe-separated form */ }
    var map = {};
    raw.split('|').filter(Boolean).forEach(function (k) { map[k] = k; });
    return map;
  }

  function installTopbars() {
    var labels = sectionLabels();

    document.querySelectorAll('.reveal .slides > section').forEach(function (s) {
      if (s.hasAttribute('data-notopbar')) return;

      var bar = document.createElement('div');
      bar.className = 'topbar';

      var nav = document.createElement('nav');
      nav.className = 'secnav';
      var here = document.createElement('span');
      here.className = 'cur';
      here.textContent = labels[s.dataset.sec] || s.dataset.sec || '';
      nav.appendChild(here);
      bar.appendChild(nav);

      if (s.dataset.title) {
        var h = document.createElement('h2');
        h.className = 'slide-title';
        h.textContent = s.dataset.title;
        if (s.dataset.sub) {
          var sub = document.createElement('span');
          sub.className = 'sub';
          sub.textContent = s.dataset.sub;
          h.appendChild(sub);
        }
        bar.appendChild(h);
      }

      s.insertBefore(bar, s.firstChild);
    });
  }

  /* ---------- 2. timing model ------------------------------------------- */

  var slides = [];        // main-flow slides only
  var arriveAt = [];      // cumulative seconds by which you should reach slide i
  var totalPlanned = 0;

  function buildSchedule() {
    var all = Array.prototype.slice.call(
      document.querySelectorAll('.reveal .slides > section')
    );
    var acc = 0;
    all.forEach(function (s) {
      var dur = parseInt(s.dataset.dur || '0', 10);
      var counted = s.dataset.visibility !== 'uncounted';
      if (counted) {
        slides.push(s);
        arriveAt.push(acc);
        acc += dur;
      }
    });
    totalPlanned = acc;
  }

  /* ---------- 3. pacing clock ------------------------------------------- */

  var started = null;     // ms timestamp, or null before the talk begins
  var paceOn = false;

  /* Once the speaker view is open, THIS window is the projector. Nothing meant
     for the presenter may stay on it — the pacing clock, the notes panel and
     the shortcut bar all belong on the speaker's screen instead. */
  var embedded    = window.self !== window.top;
  var speakerOpen = false;
  var lastBeat    = 0;
  var paceChoice  = null;   // set once the presenter presses T, and then it wins

  function paceShouldShow() {
    if (embedded) return false;             // the speaker view's own previews
    if (paceChoice !== null) return paceChoice;
    return !speakerOpen;
  }

  function applyPace() {
    paceOn = paceShouldShow();
    elPace.classList.toggle('on', paceOn);
    tick();
  }

  function setSpeakerOpen(open) {
    if (speakerOpen === open) return;
    speakerOpen = open;
    paceChoice = null;          // either way, go back to the default for this setup
    if (open) {
      // hand the presenter's furniture over to the speaker window
      notesOn = false;
      elNotes.classList.remove('on');
      document.getElementById('helpBar').classList.remove('on');
    }
    applyPace();
  }

  window.addEventListener('message', function (e) {
    var d;
    try { d = JSON.parse(e.data); } catch (_) { return; }
    if (!d || d.namespace !== 'reveal-notes') return;
    if (d.type === 'connected' || d.type === 'heartbeat') {
      lastBeat = Date.now();
      setSpeakerOpen(true);
    }
  });

  // the speaker view beats once a second; a few missed beats means it is gone
  setInterval(function () {
    if (speakerOpen && Date.now() - lastBeat > 4000) setSpeakerOpen(false);
  }, 1000);

  var elPace  = document.getElementById('pace');
  var elClock = document.getElementById('paceClock');
  var elDelta = document.getElementById('paceDelta');
  var elSec   = document.getElementById('paceSec');

  function mmss(sec) {
    var neg = sec < 0;
    sec = Math.abs(Math.round(sec));
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (neg ? '-' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function currentIndex() {
    var cur = document.querySelector('.reveal .slides > section.present');
    var i = slides.indexOf(cur);
    return i < 0 ? null : i;
  }

  function tick() {
    if (!paceOn) return;

    var elapsed = started ? (Date.now() - started) / 1000 : 0;
    var m = Math.floor(elapsed / 60);
    var s = Math.floor(elapsed % 60);
    elClock.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;

    var i = currentIndex();
    if (i === null) {
      elDelta.textContent = '';
      elDelta.className = 'delta';
      elSec.textContent = 'backup';
      return;
    }

    var sec = slides[i].dataset.sec || '';
    elSec.textContent = sec + '  ·  ' + (i + 1) + '/' + slides.length +
                        '  ·  plan ' + mmss(totalPlanned);

    if (!started) {
      elDelta.textContent = 'ready';
      elDelta.className = 'delta';
      return;
    }

    var drift = elapsed - arriveAt[i];
    elDelta.textContent = (drift >= 0 ? '+' : '') + mmss(drift) +
                          (drift >= 0 ? ' behind' : ' ahead');
    elDelta.className = 'delta ' + (drift > 20 ? 'behind' : drift < -20 ? 'ahead' : '');
  }

  setInterval(tick, 500);

  /* ---------- 4. notes overlay ------------------------------------------ */

  var notesOn = false;
  var elNotes = document.getElementById('notesOverlay');
  var elNotesBody = document.getElementById('notesBody');

  function syncNotes() {
    var cur = document.querySelector('.reveal .slides > section.present');
    var aside = cur ? cur.querySelector('aside.notes') : null;
    elNotesBody.innerHTML = aside ? aside.innerHTML : '<p class="cue">— no notes —</p>';
    elNotes.scrollTop = 0;
  }

  /* ---------- 5. keys ---------------------------------------------------- */
  /* Registered through Reveal rather than on document, because reveal already
     owns most of the keyboard and its own bindings win silently otherwise:
       N  is reveal's "next slide"   -> notes live on I instead
       /  is reveal's blackout       -> we override it, B and . still blank out  */

  function bindKeys() {
    Reveal.addKeyBinding(
      { keyCode: 84, key: 'T', description: 'Pacing clock on this screen' },
      function () { paceChoice = !paceOn; applyPace(); });

    Reveal.addKeyBinding(
      { keyCode: 73, key: 'I', description: 'Speaker notes on this screen' },
      function () {
        notesOn = !notesOn;
        elNotes.classList.toggle('on', notesOn);
        if (notesOn) syncNotes();
      });

    Reveal.addKeyBinding(
      { keyCode: 82, key: 'R', description: 'Reset the timer' },
      function () { started = null; tick(); });

    Reveal.addKeyBinding(
      { keyCode: 191, key: '?', description: 'Shortcuts' },
      function () { document.getElementById('helpBar').classList.toggle('on'); });
  }

  /* ---------- 6. notes edited in the speaker view ------------------------ */
  /* serve.py has already written the change into index.html; this just keeps
     the live DOM (and therefore the N overlay) in step without a reload.     */

  window.addEventListener('message', function (e) {
    var d;
    try { d = JSON.parse(e.data); } catch (_) { return; }
    if (!d || d.namespace !== 'deck-notes' || d.type !== 'updated') return;

    var all = document.querySelectorAll('.reveal .slides > section');
    var section = all[d.index];
    if (!section) return;

    var aside = section.querySelector('aside.notes');
    if (!aside) {
      aside = document.createElement('aside');
      aside.className = 'notes';
      section.appendChild(aside);
    }
    aside.innerHTML = d.html;
    if (notesOn) syncNotes();
  });

  /* ---------- 7. boot ---------------------------------------------------- */

  installTopbars();
  installSlots();
  buildSchedule();

  Reveal.initialize({
    width: 1600,
    height: 900,
    margin: 0.04,
    minScale: 0.2,
    maxScale: 2.0,

    center: false,              // we centre with flexbox instead
    hash: true,
    history: false,
    controls: false,
    progress: true,
    slideNumber: 'c/t',
    showSlideNumber: 'all',
    transition: 'fade',
    transitionSpeed: 'fast',
    backgroundTransition: 'fade',
    overview: true,
    help: false,          // '?' is ours; reveal's own overlay would swallow keys
    pdfSeparateFragments: false,

    plugins: [RevealNotes]
  }).then(function () {
    bindKeys();
    syncNotes();

    Reveal.on('slidechanged', function (ev) {
      // the clock starts the moment you leave the title slide
      if (started === null && ev.indexh > 0) started = Date.now();
      if (notesOn) syncNotes();
      tick();
    });

    applyPace();
  });

  window.addEventListener('load', installSlots);
})();
