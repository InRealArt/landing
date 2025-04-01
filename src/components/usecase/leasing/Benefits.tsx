import { benefitsItems } from "@/data/leasing";

export default function Benefits() {
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl bricolage-grotesque font-medium mb-12">
          Les avantages de lier art et leasing
        </h2>
        
        <div className="space-y-8">
          {benefitsItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="text-6xl bricolage-grotesque text-[#4F46E5] font-medium">
                {item.id}
              </div>
              <div>
                <h3 className="text-xl bricolage-grotesque font-medium mb-3">
                  {item.title}
                </h3>
                <p className="text-sm inter text-gray-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 