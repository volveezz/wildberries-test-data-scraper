import { WildberriesRepository } from "./repository/wildberriesRepository.js";
import { DataScraperService } from "./services/dataScraperService.js";
import { GoogleSheetsService } from "./services/googleSheetsService.js";
import { ScheduleManager } from "./services/scheduleManager.js";
import { WildberriesService } from "./services/wildberriesService.js";

// https://docs.google.com/spreadsheets/d/V1d0d1kxTndXbWhIVXpCWmEzQmpVM0JhYUVkVE1B/edit
// spreadsheet id -> V1d0d1kxTndXbWhIVXpCWmEzQmpVM0JhYUVkVE1B <- spreadsheet id
const GOOGLE_SHEETS_IDS: string[] = ["PLACE_YOUR_SPREADSHEET_ID"];

async function bootstrap() {
	const googleSheetsService = new GoogleSheetsService("./google-credentials.json");
	await googleSheetsService.initialize();

	const wildberriesService = new WildberriesService();
	const wildberriesRepository = new WildberriesRepository();

	const dataScraperService = new DataScraperService(wildberriesService, googleSheetsService, wildberriesRepository, GOOGLE_SHEETS_IDS);

	new ScheduleManager(dataScraperService).start();
}

await bootstrap();
