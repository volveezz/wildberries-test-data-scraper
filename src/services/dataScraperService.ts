import { WildberriesRepository } from "src/repository/wildberriesRepository.js";
import { BoxRequest } from "../interfaces/Wildberries.js";
import { GoogleSheetsService } from "./googleSheetsService.js";
import { WildberriesService } from "./wildberriesService.js";

export class DataScraperService {
	constructor(
		private readonly wildberriesService: WildberriesService,
		private readonly googleSheetsService: GoogleSheetsService,
		private readonly wildberriesRepository: WildberriesRepository,
		private readonly googleSheetsIds: string[]
	) {}

	private convertTo2DArray(boxRequest: BoxRequest): any[][] {
		const data = boxRequest.response.data;
		const header = [
			"dtNextBox",
			"dtTillMax",
			"warehouseName",
			"boxDeliveryAndStorageExpr",
			"boxDeliveryBase",
			"boxDeliveryLiter",
			"boxStorageBase",
			"boxStorageLiter",
		];

		const sortedWarehouses = [...data.warehouseList].sort((a, b) => {
			return parseInt(a.boxDeliveryAndStorageExpr, 10) - parseInt(b.boxDeliveryAndStorageExpr, 10);
		});

		const dataRows = sortedWarehouses.map((warehouse) => [
			data.dtNextBox,
			data.dtTillMax,
			warehouse.warehouseName,
			warehouse.boxDeliveryAndStorageExpr,
			warehouse.boxDeliveryBase,
			warehouse.boxDeliveryLiter,
			warehouse.boxStorageBase,
			warehouse.boxStorageLiter,
		]);

		return [header, ...dataRows];
	}

	public async scrape() {
		try {
			console.info("Starting data scraping process...");
			const data = await this.wildberriesService.getBoxData();

			if (!data) {
				throw new Error("Failed to get data from Wildberries API!");
			}

			console.info("Formatting WB data...");
			const formattedData = this.convertTo2DArray(data);
			console.info("Data formatting completed");

			await this.wildberriesRepository.storeBoxData(formattedData);
			console.info("Data successfully stored in database");

			console.info("Syncing with Google Sheets...");
			await this.googleSheetsService.syncDatabaseToSheet(this.googleSheetsIds);
			console.info("Google Sheets sync completed");
		} catch (error) {
			console.error("Data scraping process failed!", error);
			throw error;
		}
	}
}
