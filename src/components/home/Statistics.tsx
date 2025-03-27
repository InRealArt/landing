import BG from "../../../public/images/intro-background.png";
import Button from "../common/Button";

const Statistics = () => {
  const stats = [
    { number: "15+", label: "Artistes sélectionnés dans notre catalogue global" },
    { number: "< 100", label: "Oeuvres soigneusement choisies pour embellir votre collection." },
    { number: "1000 +", label: "Transactions réalisées sur notre marketplace" },
    { number: "50 %", label: "de nos artistes figurent dans le classement 50-60 de l’ICAC." },
  ]
  return (
    <section className="w-full max-w-90 xl:max-w-screen-xl m-auto mt-36">
      <h1 className="text-4xl md:text-5xl bricolage-grotesque">Le catalogue InRealArt c’est : </h1>
      <div className="flex flex-wrap gap-4 mt-10">
        {stats.map((stat, index) => (
          <div key={index} className="w-cardMobile lg:w-card p-4 lg:p-8  border rounded-lg bg-cardBackground">
            <h1 className="text-4xl lg:text-5xl bricolage-grotesque font-semibold">{stat.number} </h1>
            <label className="mt-4 block">{stat.label}</label>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Statistics;