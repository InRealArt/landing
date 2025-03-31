'use client'

export interface GridItem {
  title: string;
  content: string;
  categories?: string[];
  [key: string]: any;
}

interface ContentGridProps {
  items: GridItem[];
  className?: string;
}

export default function ContentGrid({ items, className = "" }: ContentGridProps) {
  return (
    <section className={`max-w-90 xl:max-w-screen-xl m-auto pb-20 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="rounded-lg p-8 border border-white/10 flex flex-col" 
            style={{ background: "#1A1A1A" }}
          >
            <h3 className="text-xl bricolage-grotesque font-medium mb-4">{item.title}</h3>
            <p className="text-gray-300 text-sm inter leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 