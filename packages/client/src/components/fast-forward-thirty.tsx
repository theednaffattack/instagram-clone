import { GenIcon, IconBaseProps, IconTree } from "react-icons";

/* 
Icon Convertor for React Icons
from: https://github.com/react-icons/react-icons/issues/238#issuecomment-578471117
 generator: https://react-icons-json-generator.surge.sh/

*/

const fastForward30Icon: IconTree = {
  tag: "svg",
  attr: {
    ["aria-hidden"]: "true",
    focusable: "false",
    preserveAspectRatio: "xMidYMid meet",
    style:
      "-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);",
    viewBox: "0 0 24 24",
  },
  child: [
    {
      tag: "path",
      attr: {
        d: "M11.5 3c-4.65 0-8.58 3.03-9.97 7.22L3.9 11c1.05-3.19 4.06-5.5 7.6-5.5c1.96 0 3.73.72 5.12 1.88L14 10h7V3l-2.6 2.6C16.55 4 14.15 3 11.5 3M19 14v6c0 1.11-.89 2-2 2h-2a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-4 0v6h2v-6h-2m-4 6a2 2 0 0 1-2 2H5v-2h4v-2H7v-2h2v-2H5v-2h4a2 2 0 0 1 2 2v1.5A1.5 1.5 0 0 1 9.5 17a1.5 1.5 0 0 1 1.5 1.5V20z",
      },
      child: [],
    },
  ],
};

export const FastForward30 = (props: IconBaseProps): JSX.Element =>
  GenIcon(fastForward30Icon)(props);
