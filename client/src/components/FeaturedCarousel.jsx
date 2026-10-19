import { useCallback, useRef, useState } from 'react';
import ProductCard from './ProductCard.jsx';

// Horizontal, RTL-aware scroll-snap carousel with mouse drag support.
export default function FeaturedCarousel({ products }) {
  const trackRef = useRef(null);
  const drag = useRef(null);
  const [dragging, setDragging] = useState(false);

  const stepOf = () => {
    const card = trackRef.current?.querySelector('.product-card');
    return (card?.offsetWidth || 300) + 24;
  };

  // In RTL, scrolling toward later cards means a negative scrollLeft delta.
  const next = useCallback(() => trackRef.current?.scrollBy({ left: -stepOf(), behavior: 'smooth' }), []);
  const prev = useCallback(() => trackRef.current?.scrollBy({ left: stepOf(), behavior: 'smooth' }), []);

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
    setDragging(true);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    trackRef.current.scrollLeft = drag.current.left + dx;
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };
  const onClickCapture = (e) => {
    if (drag.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="carousel">
      <div className="carousel-nav">
        <button className="carousel-btn" aria-label="غذاهای بعدی" onClick={next}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button className="carousel-btn" aria-label="غذاهای قبلی" onClick={prev}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div
        ref={trackRef}
        className={`carousel-track${dragging ? ' dragging' : ''}`}
        tabIndex="0"
        role="region"
        aria-label="غذاهای پیشنهادی — برای مرور با کلیدهای جهت‌دار اسکرول کنید"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') next();
          if (e.key === 'ArrowRight') prev();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
      >
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} themeIndex={i} />
        ))}
      </div>
    </div>
  );
}
