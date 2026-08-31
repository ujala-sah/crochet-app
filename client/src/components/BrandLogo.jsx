export default function BrandLogo({ size = 'md' }) {
  const box = size === 'lg' ? 'h-16 w-16' : 'h-12 w-12';
  return (
    <span className={`logo-stage ${box}`} aria-hidden="true">
      <img src="/images/yarn-tales-logo.png" alt="" className={`logo-spin ${box} rounded-full object-cover`} />
      <img src="/images/yarn-tales-logo.png" alt="" className={`logo-mirror ${box} rounded-full object-cover`} />
    </span>
  );
}
