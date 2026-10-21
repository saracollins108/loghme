export default function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <svg className="logo-mark" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
        <circle cx="15" cy="16" r="12" fill="var(--terracotta)" />
        <circle cx="25" cy="7" r="7" fill={light ? 'var(--olive-deep)' : 'var(--ivory)'} />
      </svg>
      <span className="logo-text">لقمه</span>
    </span>
  );
}
