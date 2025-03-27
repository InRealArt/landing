import Image from 'next/image'
import Logo from '/icons/Logo.png';

const Footer = () => {

  return (
    <footer className="w-full min-h-footerSize bg-cardBackground mt-36 flex flex-wrap items-center py-8">
      <div className='w-full flex flex-wrap m-auto justify-between max-w-90 xl:max-w-screen-xl'>
        <div className='socials'>
          <Image className='mb-12 md:mb-0' src={`/icons/Logo.png`} alt='IRA-LOGO' width="101" height="32" />
        </div>
        <div className='flex flex-wrap gap-12'>
          <ul className="flex flex-col gap-2">
            <h2 className='font-semibold unbounded mb-2'>Nos Pages</h2>
            <li>Accueil</li>
            <li>A propos</li>
            <li>Marketplace</li>
            <li>FAQ</li>
          </ul>
          <ul className="flex flex-col gap-2">
            <h2 className='font-semibold unbounded mb-2'>Entreprise</h2>
            <li>Equipes</li>
            <li>Partenaire</li>
            <li>CGU</li>
          </ul>
          <div />
          <ul className="flex flex-col gap-2">
            <h2 className='font-semibold unbounded mb-2'>Contact</h2>
            <li>Paris</li>
            <li>teaminrealart@gmail.com</li>
            <input className='w-72 md:w-80 bg-transparent border border-white bricolage-grotesque rounded-3xl font-semibold border-1 py-6 px-4 mt-4 outline-0' type="text" placeholder="Rejoindre la newsletter" />
          </ul>
        </div>
      </div>

    </footer>
  );
}

export default Footer;