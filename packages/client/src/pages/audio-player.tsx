import React from "react";
import { Flex } from "@chakra-ui/react";
import AudioPlayer from "../components/audio-player";

export default function AudioPlayerPage(): JSX.Element {
  return (
    <Flex flexDir="column">
      <AudioPlayer />

      <button
        onClick={() => {
          window.alert("With typescript and Jest");
        }}
      >
        Test Button
      </button>
    </Flex>
  );
}
