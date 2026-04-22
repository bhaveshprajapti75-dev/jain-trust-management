import React, { useState, useRef, useEffect, useCallback } from 'react';

// Generate age list
const MIN_AGE = 1;
const MAX_AGE = 25;
const AGES = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => i + MIN_AGE);

const ITEM_HEIGHT  = 40;  
const VISIBLE      = 3;   

// Single scroll drum
function ScrollDrum({ value, onChange, disabled, label }) {
  const listRef = useRef(null);
  const isMounted = useRef(false);

  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => { valueRef.current = value; }, [value]);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const idx = AGES.indexOf(Number(value));
    if (idx < 0) return;

    const targetScroll = idx * ITEM_HEIGHT;

    if (!isMounted.current) {
      el.scrollTop = targetScroll;
      isMounted.current = true;
    } else {
      if (Math.abs(el.scrollTop - targetScroll) > 2) {
        el.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  }, [value]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let timer;
    
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
        const snapped = AGES[Math.min(Math.max(idx, 0), AGES.length - 1)];
        
        if (snapped !== Number(valueRef.current)) {
          onChangeRef.current(snapped);
        }
      }, 150);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, []); 

  // Stop wheel/touch scroll from leaking to sibling drum or page background
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const stop = (e) => e.stopPropagation();
    el.addEventListener('wheel',      stop, { passive: true });
    el.addEventListener('touchstart', stop, { passive: true });
    el.addEventListener('touchmove',  stop, { passive: true });
    return () => {
      el.removeEventListener('wheel',      stop);
      el.removeEventListener('touchstart', stop);
      el.removeEventListener('touchmove',  stop);
    };
  }, []);

  return (
    <div className="age-drum-wrapper">
      <span className="age-drum-label">{label}</span>

      <div className={`age-drum-container${disabled ? ' age-drum-disabled' : ''}`}>
        {/* Highlight band for centre row */}
        <div className="age-drum-highlight" />

        <ul
          ref={listRef}
          className="age-drum-list"
          style={{ pointerEvents: disabled ? 'none' : 'auto' }}
        >
          {/* 1 padding item top */}
          <li className="age-drum-pad" />

          {AGES.map((age) => (
            <li
              key={age}
              className={`age-drum-item${age === Number(value) ? ' age-drum-item-active' : ''}`}
              onClick={() => {
                if (!disabled && age !== Number(value)) onChange(age);
              }}
            >
              {age} <span className="age-drum-unit">yrs</span>
            </li>
          ))}

          {/* 1 padding item bottom */}
          <li className="age-drum-pad" />
        </ul>

        {/* Fade overlays */}
        <div className="age-drum-fade age-drum-fade-top" />
        <div className="age-drum-fade age-drum-fade-bottom" />
      </div>
    </div>
  );
}

//Main exported component 
export default function AgeRangeSelector({ fromValue, toValue, onFromChange, onToChange, disabled }) {
  const [open,       setOpen]       = useState(false);
  const [panelStyle, setPanelStyle] = useState({});
  const triggerRef  = useRef(null);
  const panelRef    = useRef(null);

  const from = fromValue || 5;
  const to   = toValue   || 15;

  //Always open upward above the trigger
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPanelStyle({
      position : 'fixed',
      left     : rect.left,
      width    : rect.width,
      zIndex   : 9999,
      bottom   : window.innerHeight - rect.top + 4,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, updatePosition]);

  // ── Close on outside click 
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        panelRef.current   && !panelRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const display = fromValue && toValue ? `${fromValue} – ${toValue} yrs` : 'Select Age Range';

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-slate-600">Age Group *</label>

      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`age-range-trigger${open ? ' age-range-trigger-open' : ''}${disabled ? ' age-range-trigger-disabled' : ''}`}
      >
        <span className={fromValue && toValue ? 'age-range-value' : 'age-range-placeholder'}>
          {display}
        </span>
        <svg
          className={`age-range-chevron${open ? ' age-range-chevron-up' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          width="16"
          height="16"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Floating panel — rendered at document root level via fixed positioning */}
      {open && (
        <div ref={panelRef} className="age-range-panel" style={panelStyle}>

          <div className="age-range-drums">
            <ScrollDrum
              label="From"
              value={from}
              onChange={(v) => {
                onFromChange(v);
                if (v > to) onToChange(v); 
              }}
              disabled={false}
            />

            <div className="age-range-sep">
              <span className="age-range-sep-line" />
              <span className="age-range-sep-text">to</span>
              <span className="age-range-sep-line" />
            </div>

            <ScrollDrum
              label="To"
              value={to}
              onChange={(v) => {
                onToChange(v);
                if (v < from) onFromChange(v); 
              }}
              disabled={false}
            />
          </div>

          <button
            type="button"
            className="age-range-done"
            onClick={() => setOpen(false)}
          >
            Done
          </button>
        </div>
      )}

      {/* Injected styles */}
      <style>{`
        /* ── Trigger ─────────────────────────────────────────── */
        .age-range-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          cursor: pointer;
          transition: border-color .2s, box-shadow .2s;
          font-size: 13px;
          width: 100%;
          text-align: left;
        }
        .age-range-trigger:hover:not(.age-range-trigger-disabled) {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,.08);
        }
        .age-range-trigger-open {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 3px rgba(16,185,129,.12) !important;
        }
        .age-range-trigger-disabled {
          background: #f8fafc;
          cursor: not-allowed;
          opacity: .7;
        }
        .age-range-value       { color: #1e293b; font-weight: 500; }
        .age-range-placeholder { color: #94a3b8; }
        .age-range-chevron {
          color: #94a3b8;
          transition: transform .25s;
          flex-shrink: 0;
        }
        .age-range-chevron-up { transform: rotate(180deg); }

        /* ── Floating panel ──────────────────────────────────── */
        .age-range-panel {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 12px 36px rgba(0,0,0,.14), 0 4px 12px rgba(0,0,0,.07);
          padding: 14px 16px 12px;
          animation: agePanelIn .16s ease;
        }
        @keyframes agePanelIn {
          from { opacity:0; transform:translateY(-5px) scale(.97); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }

        /* ── Drums row ───────────────────────────────────────── */
        .age-range-drums {
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
        }

        /* ── Single drum ─────────────────────────────────────── */
        .age-drum-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          flex: 1;
        }
        .age-drum-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: #64748b;
        }
        .age-drum-container {
          position: relative;
          height: ${ITEM_HEIGHT * VISIBLE}px;   /* 3 visible rows */
          width: 100%;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          overflow: hidden;
        }
        .age-drum-disabled { opacity: .5; pointer-events: none; }

        /* selection highlight — centre row */
        .age-drum-highlight {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: ${ITEM_HEIGHT}px;
          transform: translateY(-50%);
          background: rgba(16,185,129,.08);
          border-top: 1.5px solid rgba(16,185,129,.25);
          border-bottom: 1.5px solid rgba(16,185,129,.25);
          pointer-events: none;
          z-index: 2;
        }

        /* scrollable list */
        .age-drum-list {
          height: 100%;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          list-style: none;
          margin: 0;
          padding: 0;
          position: relative;
          z-index: 1;
        }
        .age-drum-list::-webkit-scrollbar { display: none; }

        .age-drum-pad {
          height: ${ITEM_HEIGHT}px;
          scroll-snap-align: none;
        }

        .age-drum-item {
          height: ${ITEM_HEIGHT}px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          font-size: 15px;
          font-weight: 500;
          color: #94a3b8;
          cursor: pointer;
          scroll-snap-align: center;
          transition: color .15s, font-size .15s;
          user-select: none;
        }
        .age-drum-item:hover:not(.age-drum-item-active) { color: #475569; }
        .age-drum-item-active {
          color: #059669;
          font-size: 17px;
          font-weight: 700;
        }
        .age-drum-unit {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .04em;
          opacity: .7;
        }

        /* fade overlays — 1 row tall each */
        .age-drum-fade {
          position: absolute;
          left: 0; right: 0;
          height: ${ITEM_HEIGHT}px;
          pointer-events: none;
          z-index: 3;
        }
        .age-drum-fade-top {
          top: 0;
          background: linear-gradient(to bottom, #f8fafc 0%, transparent 100%);
        }
        .age-drum-fade-bottom {
          bottom: 0;
          background: linear-gradient(to top, #f8fafc 0%, transparent 100%);
        }

        /* ── Separator ───────────────────────────────────────── */
        .age-range-sep {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .age-range-sep-line {
          display: block;
          width: 1px;
          height: 22px;
          background: #e2e8f0;
        }
        .age-range-sep-text {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: #94a3b8;
        }

        /* ── Done button — matches Next button (emerald-600) ─── */
        .age-range-done {
          display: block;
          width: 100%;
          margin-top: 12px;
          padding: 8px 0;
          border-radius: 10px;
          border: none;
          background: #059669;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: .03em;
          transition: background .2s, transform .15s;
          box-shadow: 0 4px 12px rgba(5,150,105,.25);
        }
        .age-range-done:hover  { background: #047857; }
        .age-range-done:active { transform: scale(.97); }
      `}</style>
    </div>
  );
}