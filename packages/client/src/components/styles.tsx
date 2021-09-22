import { css } from "linaria";

// BEG HOME PAGE STYLES
export const innerGridWrapper = css`
  display: grid;
  margin-left: auto;
  margin-right: auto;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: 50px 2fr 45px;
  height: 100%;
  max-width: 900px;
  overflow: hidden;
  /* border: 2px dashed limegreen;
  background-color: magenta; */
`;

export const outerWrapper = css`
  /* height: 100%; */
  border: 2px dashed limegreen;
`;

export const topRow = css`
  border-bottom: 1px solid rgb(219, 219, 219);
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const topNav = css`
  margin-left: auto;
`;

export const middleRow = css`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  /* padding: 5px; */

  &::after {
    content: "";
  }
`;

export const stack = css`
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  & > div {
    margin-bottom: 10px;
  }
  &::after {
    content: "";
  }
`;

export const bottomRow = css`
  border-top: 1px solid rgb(219, 219, 219);
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

export const flexItem = css`
  min-height: 350px;
`;
// BEG HOME PAGE STYLES

/**Nav Links
 * Authenticated view layout
 */
export const navLink = css`
  padding-left: 1em;
  padding-right: 1em;
`;

export const flexContainer = css`
  display: flex;
  flex-direction: column;
`;
// END HOME PAGE STYLES
// BEG ICONS
export const iconDivWrapper = css`
  display: flex;

  align-items: center;
`;

export const center = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export const devBorder = css`
  border: 2px dashed limegreen;
`;

export const button = css`
  display: inline-flex;
  appearance: none;
  align-items: center;
  justify-content: center;
  user-select: none;
  position: relative;
  white-space: nowrap;
  vertical-align: middle;
  outline: 2px solid transparent;
  outline-offset: 2px;
  width: auto;
  line-height: 1.2;
  font-weight: var(--chakra-fontWeights-semibold);
  transition-property: var(--chakra-transition-property-common);
  transition-duration: var(--chakra-transition-duration-normal);
  height: var(--chakra-sizes-10);
  min-width: var(--chakra-sizes-10);
  font-size: var(--chakra-fontSizes-md);
  padding-inline-start: var(--chakra-space-4);
  padding-inline-end: var(--chakra-space-4);
  background: var(--chakra-colors-transparent);
  padding: 0px;
  color: #ccc;
  &:active {
    background: var(--chakra-colors-gray-300);
  }
  &:focus {
    box-shadow: var(--chakra-shadows-outline);
  }
  &:hover {
    background: var(--chakra-colors-gray-200);
  }
`;
