import { Avatar, Button, Text } from "@chakra-ui/react";
import { useAuth } from "../components/authentication-provider";
import { Layout } from "../components/layout.basic";
import { useMeQuery } from "../generated/graphql";
import withApollo from "../lib/lib.apollo-client_v2";

function Profile(): JSX.Element {
  const { authState } = useAuth();

  const { data } = useMeQuery();
  if (authState.userId) {
    return (
      <>
        <Avatar size="lg" name={data?.me?.username} />
        <Text fontSize="3xl">{data?.me?.username}</Text>
        <Button type="button" colorScheme="teal">
          jsut a button
        </Button>
      </>
    );
  } else {
    return <div>Unauthenticated</div>;
  }
}

Profile.layout = Layout;

const ProfileApollo = withApollo(Profile);

export default ProfileApollo;
