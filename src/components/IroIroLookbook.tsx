"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Preloader from "@/components/Preloader";
import ProjectFooter from "@/components/ProjectFooter";
import ProjectHeader from "@/components/ProjectHeader";
import RopeCursor from "@/components/RopeCursor";
import { iroIro } from "@/lib/projects";

export default function IroIroLookbook() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Preloader />;

  return (
    <div className="project theme-paper" data-trail="light">
      <RopeCursor />
      <ProjectHeader title={iroIro.title} />

      {/* Scroller */}
      <section className="project-scroller">
        <div className="project-scroller__track">
          {[...iroIro.scroller, ...iroIro.scroller].map((image, index) => (
            <div className="project-scroller__card" key={`scroller-${index}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 340px, (max-width: 1536px) 500px, 665px"
                className="project__cover"
                priority={index < 2}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="project-container">
        {/* Main heading */}
        <section className="project-heading">
          <h3 className="project-heading__kicker">lookbook</h3>
          <h1 className="project-heading__title">
            IRO IRO&apos;s annual collection- Pyaar
          </h1>
          <h3 className="project-heading__text project__col">
            The lookbook and accompanying collateral showcase IRO IRO&apos;s
            annual collection, &quot;Pyaar&quot;, Inspired by the relationships
            that fuels creativity. the collection encapsulates a sense of
            familiarity and nostalgia, resonating deeply with the audience.
          </h3>
        </section>

        {/* Lookbook pages */}
        <section className="project-pages">
          <div className="project__col">
            <h3 className="project-pages__caption">
              Several pages from the lookbook.
            </h3>
          </div>

          {iroIro.lookbook.map((page, index) => (
            <div className="project__col project-pages__item" key={`lookbook-page-${index}`}>
              <Image
                src={page.src}
                alt={page.alt}
                width={900}
                height={600}
                className="project-pages__img"
                priority={index < 2}
              />
            </div>
          ))}

          <div className="project__col project-pages__software">
            <h3>Softwares used: Adobe InDesign, Adobe Photoshop</h3>
          </div>
        </section>

        <ProjectFooter />
      </div>
    </div>
  );
}