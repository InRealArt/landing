import { bigTitleClassName } from "@/utils/classes";
import BG from "../../../public/images/presale/intro.png";
import Button from "../common/Button";
import { ArrowRight } from "lucide-react";

const Roadmap = () => {
  const items = [
    {
      title: "Q1 2025",
      description: [
        'Launch Art Marketplace on Testnet: Open the test environment for users to explore the platform, test functionalities, and provide feedback.',
        'Introduce Fractionalization Features: Enable tokenized ownership of art assets on the platform, allowing users to fractionally own artworks.',
        'Regulatory Compliance',
        'Solid Proof Audits'
      ]
    },
    {
      title: "Q2 2025",
      description: [
        'PreSales Launch: Begin the ICO to raise funds for platform development and expansion, offering tokens for early supporters.',
        'Develop Shopify Payment Integration: Work on integrating Shopify for seamless payments and transactions within the marketplace.',
        'Pre-Sale Phase for Artwork Ownership: Begin pre-sales for limited edition artwork pieces with the option for tokenized fractional ownership.',
      ]
    },
    {
      title: "Q3 2025",
      description: [
        'Develop Gallery Creation Tools: Allow users to create virtual galleries, featuring both tokenized and traditional artworks.',
        'Official Token Sale: Launch the official token sale, where users can purchase tokens through private and public rounds.',
        'Enhanced DAO Features: Implement additional DAO functionality for enhanced governance, community engagement, and voting on platform features.',
      ]
    },
    {
      title: "Q4 2025",
      description: [
        'Launch Full Platform: Transition from testnet to mainnet and launch the full platform to the public with full payment and fractionalization functionality.',
        'Gallery Creation Expansion: Facilitate the creation of physical or digital galleries for artists, integrated into the marketplace.',
        'Secondary Market Launch: Enable a marketplace for buying and selling fractionalized artwork.',
      ]
    },
    {
      title: "Q1 2026",
      description: [
        'Final Development of Platform: Complete all platform development, ensuring smooth Shopify integration, advanced fractionalization options, and user-friendly navigation.',
        'Begin Community Gallery Curation: DAO members vote to curate featured galleries based on their artistic preferences ',
        'Marketing and Partnerships: Secure strategic partnerships with art institutions, galleries, and other RWA projects to expand the platform’s reach.',
      ]
    }
  ]
  return (
    <section className="m-auto  max-w-90 xl:max-w-screen-lg w-full relative">
      {items.map((item, index) => {
        return <div className="flex items-center justify-around mt-20 gap-[70px] lg:gap-[200px]" key={item.title}>
          <h1 className="text-2xl md:text-5xl bricolage-grotesque mb-8 w-1/2 text-right" dangerouslySetInnerHTML={{ __html: item.title }} />
          <ul className="w-1/2">
            {item.description.map((desc, index) => <li className="flex-1 bricolage-grotesque text-xs md:text-lg flex items-center gap-4 mb-4 leading-[1]"><ArrowRight className="block w-full max-w-[24px] h-auto" /> {desc}</li>)}
          </ul>
        </div>
      })}
      <div className="roadmap-line absolute h-full w-2 bg-[#2F2A2A] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </section>
  );
}

export default Roadmap;