import { css } from "linaria";

const innerGridWrapper = css`
  display: grid;
  margin-left: auto;
  margin-right: auto;
  grid-template-columns: 1fr;
  grid-template-rows: 50px 2fr 45px;
  height: 100%;
  max-width: 900px;
`;

const topRow = css`
  border: 2px dashed limegreen;
  display: flex;
  align-items: center;
`;

const middleRow = css`
  border: 2px dashed cornflowerblue;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: lightyellow;
  /* justify-content: space-between; */

  &::after {
    content: "";
  }
`;

const bottomRow = css`
  border: 2px dashed orangered;
`;

const flexItem = css`
  min-height: 350px;
  border: 2px dashed white;
  background-color: lightgreen;
`;

function NewLayout(): JSX.Element {
  const items = Array(10)
    .fill(0)
    .map((_, index) => (
      <p className={flexItem} key={`fake-item-${index}`}>
        item {index}
      </p>
    ));
  return (
    <div className={innerGridWrapper}>
      <nav className={topRow}>InstaClone</nav>
      <div className={middleRow}>{items}</div>
      <div className={bottomRow}>Three</div>
    </div>
  );
}

export default NewLayout;
