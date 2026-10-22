import Link from "next/link";
import { brand } from "@/lib/content";

export default function ProjectHeader({ title }: { title: string }) {
  return (
    <header className="project-header">
      <Link href="/" className="project-header__back">
        <span aria-hidden="true">←</span> {brand.name}
      </Link>
      <span className="project-header__title">{title}</span>
    </header>
  );
}