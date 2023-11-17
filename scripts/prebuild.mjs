import pkg from "@next/env";
import fs from "fs";
import path from "path";
const { loadEnvConfig } = pkg;

loadEnvConfig(process.cwd());

const runAsync = async () => {
  // find all scripts in subfolder
  const files = fs
    .readdirSync(path.join(process.cwd(), "scripts", "pre-build"))
    .filter((file) => file.endsWith(".mjs"))
    .sort();
  for (const file of files) {
    const { default: defaultFunc } = await import(`./pre-build/${file}`);
    try {
      console.log(`Running pre-build script '${file}'`);
      await defaultFunc({ env: process.env });
    } catch (e) {
      console.error(
        `SCRIPT RUNNER: failed to execute pre-build script '${file}'`
      );
      console.error(e);
    }
  }
};

// Self-invocation async function
(async () => {
  await runAsync();
})().catch((err) => {
  console.error(err);
  throw err;
});
