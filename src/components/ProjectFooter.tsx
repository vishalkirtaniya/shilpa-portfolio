import Link from "next/link";

export default function ProjectFooter() {
  return (
    <section className="project-footer">
      <Link href="/" className="project-footer__btn">
        <span>← Back to portfolio</span>
      </Link>
    </section>
  );
}