import { promisify } from "util";
import { readFile as realReadFile } from "fs";

const readFileAsync = promisify(realReadFile);

export const readFile = async (filename: string) => {
  try {
    return await readFileAsync(filename, "utf8");
  } catch (error) {
    console.error(error);
  }
};
