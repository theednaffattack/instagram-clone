import { CloseButton } from "@chakra-ui/react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import router, { Router } from "next/router";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import ReactModal from "react-modal";
import { GetGlobalPostsRelayQuery } from "../generated/graphql";
import { PublicFeedCard } from "./feed.public-card";

interface ModalProps {
  router: Router;
  dataPosts: GetGlobalPostsRelayQuery;
  loadingPosts: boolean;
}

/**
 * Adapted from: https://github.com/reactjs/react-modal/issues/829#issuecomment-715512824
 */
const Modal = forwardRef<ReactModal, ModalProps>(
  ({ children, ...props }, ref) => {
    const modalRef = useRef<ReactModal>();

    useImperativeHandle(ref, () => modalRef.current, [modalRef]);

    const internalFuncsPlusProps = {
      isOpen: !!props.router.query.postId,
      onRequestClose: () => router.back(),
      onAfterOpen: () => disableBodyScroll(modalRef.current),
      onAfterClose: () => enableBodyScroll(modalRef.current),
      ref: modalRef,
      shouldCloseOnEsc: true,
      ...props,
    };

    return (
      <ReactModal
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.25)",
            position: "fixed",
            top: 0,
            bottom: 0,
            zIndex: 10,
          },
        }}
        {...internalFuncsPlusProps}
      >
        {children}

        <CloseButton
          size="lg"
          colorScheme="pink"
          color="whiteAlpha.700"
          position="fixed"
          top={0}
          left={0}
          onClick={(event) => {
            event.preventDefault();
            router.back();
          }}
        />
        {props.dataPosts?.getGlobalPostsRelay?.edges
          .filter(({ node: { id } }) => router.query.postId === id)
          .map(({ node }) => (
            <PublicFeedCard
              key={node.id}
              cardProps={node}
              loadingPosts={props.loadingPosts}
            />
          ))}
      </ReactModal>
    );
  }
);

export default Modal;
