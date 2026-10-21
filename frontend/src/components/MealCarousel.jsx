import { useEffect, useRef, useState } from 'react';
import { ChevronIcon } from './Icons.jsx';
import { faNum } from '../utils/format.js';

export default function MealCarousel({ children, ariaLabel = 'کشوی غذاها' }) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const dragState = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = Math.abs(el.scrollWidth - el.clientWidth);
    const current = Math.abs(el.scrollLeft);
    setAtStart(current <= 4);
    setAtEnd(maxScroll - current <= 4);
  };

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return undefined;
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [children]);

  const scrollByCards = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  const onPointerDown = (event) => {
    if (event.pointerType !== 'mouse') return;
    const el = trackRef.current;
    dragState.current = { down: true, startX: event.clientX, startScroll: el.scrollLeft, moved: false };
    el.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    const state = dragState.current;
    if (!state.down) return;
    const delta = event.clientX - state.startX;
    if (Math.abs(delta) > 5) state.moved = true;
    trackRef.current.scrollLeft = state.startScroll + delta;
  };

  const endDrag = () => {
    dragState.current.down = false;
  };

  const onClickCapture = (event) => {
    if (dragState.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragState.current.moved = false;
    }
  };

  return (
    <div className="carousel">
      <button
        type="button"
        className="carousel-arrow carousel-arrow--start"
        aria-label="غذاهای قبلی"
        disabled={atStart}
        onClick={() => scrollByCards(1)}
      >
        <ChevronIcon direction="right" />
      </button>
      <div
        ref={trackRef}
        className="carousel-track"
        role="group"
        aria-label={ariaLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
      >
        {children}
      </div>
      <button
        type="button"
        className="carousel-arrow carousel-arrow--end"
        aria-label="غذاهای بعدی"
        disabled={atEnd}
        onClick={() => scrollByCards(-1)}
      >
        <ChevronIcon direction="left" />
      </button>
      <span className="visually-hidden" aria-live="polite">
        {faNum(1)} از {faNum(1)}
      </span>
    </div>
  );
}
