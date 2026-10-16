import { getGlobalDetailedFaqData } from "@/actions/detailedFaqActions";
import TranslatedFaqClient from "./TranslatedFaqClient";

export const revalidate = 300 // filet de sécurité : 5 min max (IRA-22), en plus de /api/revalidate

export default async function TranslatedFaqPage() {
  const globalFaqData = await getGlobalDetailedFaqData();

  return <TranslatedFaqClient initialData={globalFaqData} />;
}
