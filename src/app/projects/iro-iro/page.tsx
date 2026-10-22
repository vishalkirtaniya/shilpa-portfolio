import type { Metadata } from "next";
import IroIroLookbook from "@/components/IroIroLookbook";

export const metadata: Metadata = {
  title: "IRO IRO — Pyaar Lookbook",
  description: "IRO IRO's annual collection, Pyaar — lookbook and collateral.",
};

export default function Page() {
  return <IroIroLookbook />;
}