import axios, { AxiosRequestConfig } from "axios";
import format from "date-fns/format";
import { CombinedError } from "urql";
import { SignS3Mutation } from "../generated/graphql";
import { logger } from "./lib.logger";
import { PreviewFile, SignS3Func } from "./types";

export async function uploadToS3(
  file: PreviewFile,
  signedRequest: string
): Promise<void> {
  const options: AxiosRequestConfig = {
    withCredentials: true,
    headers: {
      "Content-Type": file.type,
    },
  };

  // const newFileToUpload = makeAFileFromBlob(file.blobUrl, file.name, file.type);
  let newFileToUpload: File;
  try {
    newFileToUpload = await makeBlobUrlsFromReference({
      blobUri: file.blobUrl,
      filename: file.name,
      type: file.type,
    });

    try {
      await axios.put(signedRequest, newFileToUpload, options);
    } catch (error) {
      logger.error("ERROR SENDING FILES TO S3.", error);
      if (error instanceof Error) {
        throw Error(error.message);
      }
    }
  } catch (error) {
    logger.error({ error });
    if (error instanceof Error) {
      throw Error(error.message);
    }
  }
}

interface SignAndUploadFileProps {
  data: SignS3Mutation | undefined;
  error: CombinedError | undefined;
  // values: File[];
  signFile: SignS3Func;
  previewFiles: PreviewFile[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function signAndUploadFiles({
  data,
  error,
  previewFiles,
  signFile,
}: SignAndUploadFileProps): Promise<(SignS3Mutation | undefined)[]> {
  // const [{ data, error }, signFile] = useSignS3Mutation();

  return await Promise.all(
    previewFiles.map(async (imageFile) => {
      if (imageFile.type.includes("image")) {
        const preppedFile = {
          // arrayBuffer: imageFile.blobUrl,
          lastModified: imageFile.lastModified,
          name: formatFilename(imageFile.name),
          size: imageFile.size,
          type: imageFile.type,
        };

        // let response: FetchResult<SignS3Mutation>;

        // Get file signatures from S3 (make the files okay to upload below)
        try {
          await signFile({
            files: [preppedFile],
          });
        } catch (error) {
          logger.error("SIGN FILE ERROR");
          logger.error({ error });
        }

        if (error) {
          logger.error("SIGN FILE ERROR RESPONSE");
          logger.error(error);
          throw error;
        }

        // PUT ADDITIONAL UPLOAD VIA AXIOS TO STORAGE BUCKET
        // Utilize the signatures to upload the files to our storage bucket
        // via the axios 'PUT' method.

        if (data?.signS3?.signatures) {
          const [{ signedRequest }] = data?.signS3?.signatures;

          if (!signedRequest) {
            throw Error("Unexpected error while uploading. Please try again");
          }
          try {
            await uploadToS3(imageFile, signedRequest);
          } catch (error) {
            console.warn("UPLOAD ERROR", error);
          }
        }

        return data;
      }
    })
  );
}

export async function makeBlobUrlsFromReference({
  blobUri,
  filename,
  type,
}: {
  blobUri: string;
  filename: string;
  type: string;
}): Promise<File> {
  return await fetch(blobUri)
    .then((r) => r.blob())
    .then((blobFile) => {
      return new File([blobFile], filename, {
        type: type,
      });
    });
}

export function onFilesAdded(
  evt: React.ChangeEvent<HTMLInputElement>,
  setPreviewFile: React.Dispatch<React.SetStateAction<PreviewFile[]>>
): PreviewFile[] {
  evt.preventDefault();
  // if (this.state.disabled) return;

  let array;

  if (evt && evt.target && evt.target.files) {
    array = fileListToArray(evt.target.files);
    const previewFiles = makeObjectUrls(array);
    setPreviewFile([...previewFiles]);
    return previewFiles;
  }

  // We are preferring files attached to curentTarget
  // simply because they didn't match once when handling
  // a totally different event. If the if statement above DOES NOT
  // execute the below if statement DOES execute.
  // I suppose now it should just be a switch or something.
  if (
    evt &&
    evt.currentTarget &&
    evt.currentTarget.files &&
    evt.currentTarget !== evt.target
  ) {
    array = fileListToArray(evt.currentTarget.files);
    const previewFiles = makeObjectUrls(array);
    setPreviewFile([...previewFiles]);
    return previewFiles;
  }

  throw new Error("Unknown error. Cannot find files to preview.");
}

export function fileListToArray(list: FileList): any[] {
  const array = [];
  for (let i = 0; i < list.length; i++) {
    array.push(list[i]);
  }
  return array;
}

export function makeObjectUrls(someArray: File[]): PreviewFile[] {
  return someArray.map((file) => {
    const { lastModified, name, size, type } = file;

    return {
      blobUrl: URL.createObjectURL(file),
      lastModified,
      name,
      size,
      type,
    };
  });
}

export function formatFilename(filename: string): string {
  // from: https://stackoverflow.com/questions/48495289/javascript-not-able-to-rename-file-before-upload
  const date = format(new Date(), "yyyyMMdd");
  const randomString = Math.random().toString(36).substring(2, 7);
  const fileExt = filename.split(".")[filename.split(".").length - 1];
  const cleanedFileameWithoutExt = filename
    .replace(`.${fileExt}`, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-");
  const newFileName = `${date}-${randomString}-${cleanedFileameWithoutExt}.${fileExt}`;
  return newFileName;
}
