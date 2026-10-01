import { SQLDatabase } from "encore.dev/storage/sqldb";

export const portfolioDB = new SQLDatabase("portfolio", {
  migrations: "./migrations",
});
