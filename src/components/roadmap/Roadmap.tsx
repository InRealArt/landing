'use client'
import { ArrowRight } from "lucide-react";
import { useLanguageStore } from '@/store/languageStore';

export interface RoadmapItem {
  title: string;
  description: string[];
}

const Roadmap = ({items}: {items: RoadmapItem[]}) => {
  return (
    <section className="m-auto  max-w-90 xl:max-w-screen-lg w-full relative">
      {items.map((item, index) => {
        return <div className="flex items-center justify-around mt-20 gap-[70px] lg:gap-[200px]" key={item.title}>
          <h1 className="text-2xl md:text-5xl bricolage-grotesque mb-8 w-1/2 text-right" dangerouslySetInnerHTML={{ __html: item.title }} />
          <ul className="w-1/2">
            {item.description.map((desc: string, index: number) => (
              <li key={index} className="flex-1 bricolage-grotesque text-xs md:text-lg flex items-center gap-4 mb-4 leading-[1]">
                <ArrowRight className="block w-full max-w-[24px] h-auto" /> {desc}
              </li>
            ))}
          </ul>
        </div>
      })}
      <div className="roadmap-line absolute h-full w-2 bg-[#2F2A2A] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </section>
  );
}

export default Roadmap;