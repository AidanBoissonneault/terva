import connection from "../db/connection";
import { seedDefaultRecipes } from "../lib/seedDefaultRecipes";

const userId = "H2qy51BW3bN6THEWLKT9ACucBoki3uKV";

await seedDefaultRecipes(connection, userId);
console.log("Done — recipes seeded for", userId);
process.exit(0);
