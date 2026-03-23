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
    <section className={`max-w-screen-2xl mx-auto px-10 pb-32 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-0">
        {items.map((item, index) => (
          <div
            key={index}
            data-anim="glossary-card"
            className="border-t border-[var(--border-light)] pt-10 pb-12 flex flex-col"
          >
            <div className="flex items-start gap-4 mb-6">
              <span className="serif italic text-3xl text-[var(--gold-accent)]">
                {String(index + 1).padStart(2, '0')}.
              </span>
              <h3 className="serif text-2xl italic leading-snug pt-1">{item.title}</h3>
            </div>
            <p className="text-[13px] text-[var(--gray-text)] leading-loose">{item.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 