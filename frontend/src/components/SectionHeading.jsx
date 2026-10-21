import Reveal from './Reveal.jsx';

export default function SectionHeading({ label, title, subtitle, align = 'center' }) {
  return (
    <Reveal className={`section-heading section-heading--${align}`}>
      {label ? <p className="section-label">{label}</p> : null}
      {title ? <h2 className="section-title">{title}</h2> : null}
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </Reveal>
  );
}
