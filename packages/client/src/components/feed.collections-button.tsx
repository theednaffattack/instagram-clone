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
      onClick={(event) => {
        event.preventDefault();
        handleClick({ setSavedToCollections });
      }}
      icon={
        savedToCollections === "is_not_saved" ? (
          <FaRegBookmark fill="grey" size={30} />
        ) : (
          <FaBookmark fill="grey" size={30} />
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
    if (prevState === "is_saved") return "is_not_saved";
  });
}
