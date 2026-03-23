import { connectDatabase } from "./config/db.js";
import { bootstrapData } from "./services/store.js";

await connectDatabase();
await bootstrapData();
console.log("Seed completed.");
