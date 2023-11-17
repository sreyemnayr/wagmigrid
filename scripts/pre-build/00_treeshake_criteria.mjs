import fs from "fs";
import path from "path";

export default async function execute(params) {
  const fullFilePath = path.join(
    process.cwd(),
    "src",
    "data",
    "trait_criteria_filtered.json"
  );
  if (fs.existsSync(fullFilePath)) {
    await fs.promises.unlink(fullFilePath);
  }

  const puzzlesFilePath = path.join(
    process.cwd(),
    "src",
    "data",
    "puzzles.json"
  );
  const traitCriteriaFilePath = path.join(
    process.cwd(),
    "src",
    "data",
    "trait_criteria.json"
  );
  const collectionsFilePath = path.join(
    process.cwd(),
    "src",
    "data",
    "collections.json"
  );

  // const puzzles = require(puzzlesFilePath);
  // const traitCriteria = require(traitCriteriaFilePath);
  // const collections = require(collectionsFilePath);

  const puzzles = JSON.parse(fs.readFileSync(puzzlesFilePath));
  const traitCriteria = JSON.parse(fs.readFileSync(traitCriteriaFilePath));
  const collections = JSON.parse(fs.readFileSync(collectionsFilePath));

  const all_criteria = puzzles.flat();

  // Only use criteria that are in the puzzles
  const filtered_traitCriteria = Object.keys(traitCriteria).reduce(
    (acc, trait) => {
      if (!all_criteria.includes(trait)) {
        return acc;
      } else {
        acc[trait] = traitCriteria[trait];
      }
      return acc;
    },
    {}
  );

  // logic to build old and new URLs into:
  // {
  //    source: oldUrl,
  //    destination: newUrl,
  //    permanent: false
  // } => const data

  await fs.promises.writeFile(
    fullFilePath,
    JSON.stringify(filtered_traitCriteria)
  );
}
