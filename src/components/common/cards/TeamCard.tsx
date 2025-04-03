import Link from "next/link";
interface TeamCardProps {
  image: {
    src: string;
  };
  name: string;
  role: string;
  socials: { link: string; icon: string; }[];
  additionalClassName?: string;
  isSlider?: boolean;
}

const TeamCard = ({ image, name, role, socials, additionalClassName, isSlider }: TeamCardProps) => {
  return (
    <div className={`p-4 border rounded-lg bg-cardBackground bg-center ${isSlider ? 'h-full' : 'h-auto'}  ${additionalClassName ?? ''}`}>
      <div className={`bg-cover m-auto bg-no-repeat bg-top  w-full rounded-lg ${isSlider ? 'h-48 md:h-80' : 'h-80'}`} style={{ backgroundImage: ` url('${image.src}')` }} />
      <p className="mt-4 inter text-2xl font-semibold">{name}</p>
      <p className="mt-2 inter">{role}</p>
      {socials.map((social, index) => (
        <Link key={index} href={social.link}>
          <img src={social.icon} alt="social" />
        </Link>
      ))}
    </div>
  );
}

export default TeamCard;