import knex from "../database/index.js";

export class WildberriesRepository {
	public async storeBoxData(data: any[][]) {
		const header = data[0];
		const rows = data.slice(1);

		const records = rows.map((row) => {
			const record: any = {};
			header.forEach((col, index) => {
				record[col] = row[index];
			});

			record.dtNextBox = record.dtNextBox.trim() || null;
			record.dtTillMax = record.dtTillMax.trim() || null;
			record.queryDate = knex.raw("CURRENT_DATE::TEXT");

			return record;
		});

		if (records.length === 0) return;

		const deleteConditions = records.map(({ queryDate, warehouseName }) => [queryDate, warehouseName]);

		await knex.transaction(async (trx) => {
			await trx("wb_box_tariffs").whereIn(["queryDate", "warehouseName"], deleteConditions).del();
			await trx("wb_box_tariffs").insert(records);
		});
	}
}
