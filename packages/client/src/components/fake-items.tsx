import { flexItem } from "./styles";

interface FakeItemsProps {
  num: number;
}

export function FakeItems({ num = 10 }: FakeItemsProps): JSX.Element {
  const items = Array(num)
    .fill(0)
    .map((_, index) => (
      <p className={flexItem} key={`fake-item-${index}`}>
        item {index}
      </p>
    ));
  return <>{items}</>;
}
