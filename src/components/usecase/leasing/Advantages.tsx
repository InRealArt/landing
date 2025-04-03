import { advantagesItems } from "@/data/leasing";

export default function Advantages() {
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-5xl bricolage-grotesque font-medium mb-4">
          Simplicité, souplesse et optimisation
        </h2>
        <p className="text-sm inter  mb-8 max-w-lg">
          Location avec option d&quot;achat (LOA) sur oeuvres d&quot;art
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantagesItems.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-[#1D1C1C]"
            >
              <h3 className="text-xl bricolage-grotesque font-medium mb-3">
                {item.title}
              </h3>
              <p className="text-sm inter text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 