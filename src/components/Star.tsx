/** Four-point star — the coral mark from the reference animation. */
export default function Star({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 0C12.7 7 17 11.3 24 12C17 12.7 12.7 17 12 24C11.3 17 7 12.7 0 12C7 11.3 11.3 7 12 0Z" />
    </svg>
  );
}
