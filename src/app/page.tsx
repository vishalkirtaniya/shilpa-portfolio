import Frame from "@/components/Frame";
import SmoothScroll from "@/components/SmoothScroll";
import RopeCursor from "@/components/RopeCursor";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Lens from "@/components/Lens";
import Plates from "@/components/Plates";
import Journal from "@/components/Journal";
import Contact from "@/components/Contact";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <RopeCursor />
      <Frame />
      <main className="lookbook" id="lookbook">
        <Hero />
        <Statement />
        <Lens />
        <Plates />
        <Journal />
        <Contact />
      </main>
    </>
  );
}
