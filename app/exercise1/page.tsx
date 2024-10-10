import Range from "@/components/Range";
import { getRandomArray } from "@/actions";

export default async function Page() {
  const values = await getRandomArray();

  return <Range values={values} />;
}
