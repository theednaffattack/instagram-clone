import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/client";

interface Props {
  hello: string;
}

type SignInProps = Props &
  InferGetServerSidePropsType<typeof getServerSideProps>;

export default function SignIn({ csrfToken }: SignInProps): JSX.Element {
  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Username
        <input name="username" type="text" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button type="submit">Sign in</button>
    </form>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<{
  props: {
    csrfToken: string;
  };
}> {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
