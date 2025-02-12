import type { Knex } from "knex";
import path from "path";

const config: { [key: string]: Knex.Config } = {
	development: {
		client: "postgresql",
		connection: {
			host: process.env.NODE_ENV === "production" ? "db" : "127.0.0.1",
			port: parseInt(process.env.DB_PORT || "3000", 10),
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			uri: process.env.DATABASE_URI,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: path.join(path.resolve("."), "src", "database", "migrations"),
			tableName: "dev_migrations",
		},
	},
	production: {
		client: "postgresql",
		connection: {
			host: "db",
			port: parseInt(process.env.DB_PORT || "3000", 10),
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			uri: process.env.DATABASE_URI,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: path.join(path.resolve("."), "dist", "database", "migrations"),
			tableName: "migrations",
		},
	},
};

export default config;
