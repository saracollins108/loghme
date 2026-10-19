import Reveal from './Reveal.jsx';

export default function SectionHeading({ label, title, sub, center = true }) {
  return (
    <Reveal className={`section-heading${center ? ' centered' : ''}`}>
      {label && <span className="section-label">{label}</span>}
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </Reveal>
  );
}
