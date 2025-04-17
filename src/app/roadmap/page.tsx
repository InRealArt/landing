'use client'
import Intro from "@/components/roadmap/Intro";
import Roadmap from "@/components/roadmap/Roadmap";
import { useLanguageStore } from "@/store/languageStore";
import { getRoadmapItems } from "./utils";

export default function RoadMap() {
  const { t } = useLanguageStore();

  return (
    <>
      <Intro />
      <Roadmap items={getRoadmapItems(t)} />
    </>
  );
}
