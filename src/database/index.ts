import knex from "knex";
import knexConfig from "./knexfile.js";

const env = process.env.NODE_ENV || "production";
const knexInstance = knex(knexConfig[env]);

export default knexInstance;

knexInstance.migrate.latest(knexConfig);
