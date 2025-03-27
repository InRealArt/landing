import Button from "../common/Button";
import { ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const items = [
    { name: "Pont réel digital", description: 'Marketplace connectée à des galeries physiques, collectionneurs et proposant un pannel d’oeuvres et d’artistes d’exeption etc' },
    { name: "Un token  unique", description: 'Éco-systeme permettant la selection et la création de galeries communautaires interconnectées à notre marketplace et notre dao' },
    { name: "L’art", description: 'Marketplace connectée à des galeries physiques, collectionneurs et proposant un pannel d’oeuvres et d’artistes d’exeption etc' },
  ]
  return (
    <section className="w-full max-w-90 xl:max-w-screen-xl m-auto mt-36">
      <h1 className="text-3xl lg:text-5xl bricolage-grotesque text-center ">Comment ça fonctionne ? </h1>
      <label className="mt-4 block text-center">Marketplace connectée à des galeries physiques, collectionneurs et proposant un pannel d’oeuvres et d’artistes d’exception</label>
      <div className="flex flex-wrap gap-4 mt-10">
        {items.map((item, index) => (
          <div key={index} className="w-full lg:w-cardLarge p-4 lg:p-8 border rounded-lg bg-cardBackground flex flex-col">
            <h1 className="text-2xl lg:text-3xl unbounded">{item.name} </h1>
            <label className="my-4 block">{item.description}</label>
            <Button text="Lire plus" additionalClassName="mt-auto bg-purpleColor w-full" icon={<ArrowRight />} center />
          </div>
        ))}
      </div>
    </section>
  );
}
