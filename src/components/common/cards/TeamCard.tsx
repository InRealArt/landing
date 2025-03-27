import Link from "next/link";
interface TeamCardProps {
  image: {
    src: string;
  };
  name: string;
  role: string;
  socials: { link: string; icon: string; }[];
  additionalClassName?: string;
}

const TeamCard = ({ image, name, role, socials, additionalClassName }: TeamCardProps) => {
  return (
    <div className={`p-4 border rounded-lg bg-cardBackground bg-center h-full ${additionalClassName ?? ''}`}>
      <div className="bg-cover m-auto bg-no-repeat bg-top h-28 md:h-64 w-full rounded-lg" style={{ backgroundImage: ` url('${image.src}')` }} />
      <p className="mt-4 inter text-2xl font-semibold">{name}</p>
      <p className="mt-2 inter">{role}</p>
      {socials.map((social, index) => (
        <Link href={social.link}>
          <img src={social.icon} alt="social" />
        </Link>
      ))}
    </div>
  );
}

export default TeamCard;