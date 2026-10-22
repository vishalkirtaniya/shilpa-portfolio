export default function Preloader() {
  return (
    <div className="preloader" role="status" aria-label="Loading">
      <span className="preloader__word">Loading</span>
      <span className="preloader__line" />
    </div>
  );
}