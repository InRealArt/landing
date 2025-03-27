import Image from 'next/image'
import Button from './Button';
import { ArrowRight } from 'lucide-react';

const Header = () => {

  return (
    <header className="w-full h-headerSize bg-backgroundColor fixed top-0 z-50">
      <div className='flex gap-20 m-auto items-center justify-between max-w-90 xl:max-w-screen-xl h-full'>
        <Image src={`/icons/Logo.png`} alt='IRA-LOGO' width="101" height="32" />
        <ul className="gap-8 items-center hidden lg:flex bricolage-grotesque font-semibold">
          <li>Pourquoi Nous ?</li>
          <li>White Paper</li>
          <li>Cas d’usage</li>
          <li>AirDrop/Testnet</li>
          <li>Blog</li>
        </ul>
        <div>
        <Button text="Pre-sales" additionalClassName="bg-purpleColor" icon={<ArrowRight />} center />
        </div>
      </div>
      
    </header>
  );
}

export default Header;