import { css } from "@linaria/core";

interface ErrorMessageProps {
  message: string;
}

const asideCss = css`
  padding: 1.5em;
  font-size: 14px;
  color: white;
  background-color: red;
`;

export function ErrorMessage({ message }: ErrorMessageProps): JSX.Element {
  return <aside className={asideCss}>{message}</aside>;
}
