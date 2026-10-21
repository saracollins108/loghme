import { useEffect, useRef } from 'react';

export default function Accordion({ items }) {
  const firstRef = useRef(null);

  useEffect(() => {
    if (firstRef.current) firstRef.current.open = true;
  }, []);

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <details
          key={item.question}
          className="accordion-item"
          ref={index === 0 ? firstRef : undefined}
        >
          <summary>
            <span>{item.question}</span>
            <span className="accordion-icon" aria-hidden="true" />
          </summary>
          <div className="accordion-body">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
