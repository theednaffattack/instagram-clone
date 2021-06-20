import React from "react";

type ThumbProps = {
  file: File;
};

// type ThumbState = {
//   loading: boolean;
//   thumb: FileReader["result"] | undefined;
//   file: File | undefined;
// };

// type ThumbAction =
//   | {
//       type: "loading";
//     }
//   | {
//       type: "loaded";
//     };

// function init(file: File): ThumbState {
//   const reader = new FileReader();
//   reader.onloadend = () => {
//     // this.setState({ loading: false, thumb: reader.result });
//     return { loading: false, thumb: reader.result };
//   };

//   reader.onerror = (error) => {
//     console.warn("FILE READER LOAD ERROR", error);
//   };

//   reader.readAsDataURL(file);
//   return { loading: false, thumb: undefined };
// }

// function reducer(prevState: ThumbState, action: ThumbAction): ThumbState {
//   switch (action.type) {
//     case "loading":
//       return {
//         loading: true,
//         thumb: undefined
//       };
//     case "loaded":
//       return {
//         loading: false,
//         thumb: undefined
//       };

//     default:
//       return {
//         loading: false,
//         thumb: undefined
//       };
//   }
// }

// const initialState: ThumbState = {
//   loading: true,
//   thumb: undefined,
//   file: undefined
// };

// type ErrorFillerProps = {
//   error?: Error;
// };

// function ErrorFiller({ error }: ErrorFillerProps) {
//   return <div>error: {error?.message}</div>;
// }

// const [imgState, imgDispatch] = React.useReducer<ThumbAction, ThumbState>(
//   reducer,
//   initialState,
//   init
// );

export function Thumb({ file }: ThumbProps) {
  const [thumb, setThumb] = React.useState<string | undefined>();

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumb(reader.result as string);
    };

    reader.onerror = (error) => {
      console.warn("FILE READER LOAD ERROR", error);
    };

    reader.readAsDataURL(file);
    console.log("MOUNTED THUMB");
  }, [file]);

  return (
    <img
      src={thumb}
      alt={file.name}
      className="img-thumbnail mt-2"
      height={200}
      width={200}
    />
  );
}
