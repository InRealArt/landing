import Image from "next/image";
import Button from "@/components/common/Button";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-headerSize">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/marketplace.png"
          alt="IRA Art Leasing"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>
      
      {/* Content Overlay */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Title and Button */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl bricolage-grotesque font-medium mb-6">
              IRA Art Leasing Entreprises
            </h1>
            <div className="mt-auto">
              <Button 
                text="Simmulateur" 
                additionalClassName="bg-purpleColor"
                link="/simulateur"
              />
            </div>
          </div>
          
          {/* Right Column - Text */}
          <div className="text-lg inter text-gray-200">
            <p className="mb-4">
              La location avec option d&quot;achat (LOA), ou Art Leasing, permet aux entreprises de louer une œuvre d&quot;art ou du mobilier pour leurs espaces professionnels.
            </p>
            <p className="mb-4">
              Contrairement à l&quot;achat, elle offre des avantages fiscaux et financiers : les loyers sont déductibles du résultat imposable, réduisant ainsi l&quot;impôt (IS ou IRPP).
            </p>
            <p>
              Elle répartit aussi le coût sur la durée du contrat, générant des économies fiscales. À terme, l&quot;acquisition est possible à une valeur résiduelle avantageuse.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 