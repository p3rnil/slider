import NormalRange from "@/components/NormalRange";
import FixedRange from "@/components/FixedRange";

interface RangeProps {
  fixed?: boolean;
  values: number[];
}

export default function Range({ fixed, values }: RangeProps) {
  return (
    <>
      {fixed ? (
        <FixedRange values={values} />
      ) : (
        <NormalRange initialMin={values[0]} initialMax={values[1]} />
      )}
    </>
  );
}
