import { IconButton } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

export function CollectionsButton(): JSX.Element {
  const [savedToCollections, setSavedToCollections] =
    useState<"is_not_saved" | "is_saved">("is_not_saved");
  return (
    <IconButton
      aria-label="Save to Collections"
      bg="transparent"
      ml="auto"
      mr={2}
      mt={2}
      onClick={(event) => {
        event.preventDefault();
        handleClick({ setSavedToCollections });
      }}
      icon={
        savedToCollections === "is_not_saved" ? (
          <FaRegBookmark fill="grey" size={25} />
        ) : (
          <FaBookmark fill="grey" size={25} />
        )
      }
    />
  );
}

interface HandleClickProps {
  setSavedToCollections: Dispatch<SetStateAction<"is_not_saved" | "is_saved">>;
}

function handleClick({ setSavedToCollections }: HandleClickProps) {
  setSavedToCollections((prevState) => {
    if (prevState === "is_not_saved") return "is_saved";
    return "is_not_saved";
  });
}
