'use client'

interface HeaderProps {
  title: string;
  description?: string;
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <section className="max-w-90 xl:max-w-screen-xl m-auto pt-headerSize">
      <h1 className="text-5xl md:text-6xl bricolage-grotesque font-semibold mb-10">{title}</h1>
      
      <hr className="border-gray-700 mb-8" />
      
      {description && (
        <div className="mb-12">
          <p className="text-base md:text-lg max-w-2xl inter leading-relaxed text-gray-300">
            {description}
          </p>
        </div>
      )}
    </section>
  );
} 