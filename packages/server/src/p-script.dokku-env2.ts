import dotenv from "dotenv";
import fs from "fs";
import path from "path";

interface LoadEnvFilePropsRefactor {
  filePath?: string;
}

function createDokkuEnvConfig(appName: string): string {
  let cache = [];
  for (const [key, value] of Object.entries(getEnvAsObject())) {
    cache.push(`${key}=${value.replace(/(\s+)/g, "\\$1")}`);
  }
  const returnString = `dokku config:set ${appName} ${cache.join(" ")}`;
  console.log(returnString);

  return returnString;
}

createDokkuEnvConfig("ic-server");

function findYarnWorkspaceDirectory(): string {
  return "";
}

function getEnvAsObject() {
  const projectRoot = getProjectRoot();
  const filePath = `${projectRoot}/.env`;
  const file = loadEnvFile({ filePath });

  return dotenv.parse(file);
}

// package functions
function loadEnvFile({ filePath }: LoadEnvFilePropsRefactor): Buffer {
  const realFilePath: string = filePath ? filePath : getProjectRoot();
  if (fs.existsSync(realFilePath)) {
    return fs.readFileSync(realFilePath);
  }
  throw Error("The filepath given isn't a file.");
}

// Find project root from current working directory.
function getProjectRoot(): string {
  var currentDir = process.cwd();
  while (!fs.existsSync(currentDir + "/package.json") && currentDir) {
    currentDir = path.dirname(currentDir);
  }
  if (!currentDir) {
    throw new Error("No project root is found.");
  }
  return currentDir;
}
