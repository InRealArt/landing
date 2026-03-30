import { getGlobalDetailedFaqData } from "@/actions/detailedFaqActions";
import TranslatedFaqClient from "./TranslatedFaqClient";

export default async function TranslatedFaqPage() {
  const globalFaqData = await getGlobalDetailedFaqData();

  return <TranslatedFaqClient initialData={globalFaqData} />;
}
