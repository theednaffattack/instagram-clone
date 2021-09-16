import { Avatar, Button, Text } from "@chakra-ui/react";
import { Layout } from "../components/layout.basic";
import { useMeQuery } from "../generated/graphql";

function Profile(): JSX.Element {
  const [{ data }] = useMeQuery();

  return (
    <>
      <Avatar size="lg" name={data?.me?.username ?? "unknown"} />
      <Text fontSize="3xl">{data?.me?.username}</Text>
      <Button type="button" colorScheme="teal">
        jsut a button
      </Button>
    </>
  );
}

Profile.layout = Layout;

export default Profile;
