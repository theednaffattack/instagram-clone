import { DropzoneInputProps } from "react-dropzone";

type UploadComponentProps = {
  getInputProps: (props?: DropzoneInputProps | undefined) => DropzoneInputProps;
  isDragActive: boolean;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
};

export function UploadComponent({
  getInputProps,
  isDragActive,
}: UploadComponentProps): JSX.Element {
  return (
    <div>
      {}
      <div>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag &apos;n drop some files here, or click to select files</p>
        )}
      </div>
    </div>
  );
}
