import type { Knex } from "knex";

export async function up(knex: Knex) {
	const exists = await knex.schema.hasTable("wb_box_tariffs");

	// Return if table already exists and migration is not intended in this case
	if (exists) return;

	return knex.schema.createTable("wb_box_tariffs", (t) => {
		t.increments("id").primary();
		t.string("queryDate");
		t.string("dtNextBox").nullable();
		t.string("dtTillMax").nullable();
		t.string("warehouseName");
		t.string("boxDeliveryAndStorageExpr");
		t.string("boxDeliveryBase");
		t.string("boxDeliveryLiter");
		t.string("boxStorageBase");
		t.string("boxStorageLiter");
		t.timestamp("updated_at").defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists("wb_box_tariffs");
}
