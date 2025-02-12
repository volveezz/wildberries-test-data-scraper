import { WildberriesRepository } from "./repository/wildberriesRepository.js";
import { DataScraperService } from "./services/dataScraperService.js";
import { GoogleSheetsService } from "./services/googleSheetsService.js";
import { ScheduleManager } from "./services/scheduleManager.js";
import { WildberriesService } from "./services/wildberriesService.js";

const GOOGLE_SHEETS_IDS: string[] = process.env.SPREADSHEETS_IDS!.split(",");
if (!GOOGLE_SHEETS_IDS || GOOGLE_SHEETS_IDS.length < 1) throw new Error("You must add at least one spreadsheet id for this app to work");

async function bootstrap() {
	const googleSheetsService = new GoogleSheetsService("./google-credentials.json");
	await googleSheetsService.initialize();

	const wildberriesService = new WildberriesService();
	const wildberriesRepository = new WildberriesRepository();

	const dataScraperService = new DataScraperService(wildberriesService, googleSheetsService, wildberriesRepository, GOOGLE_SHEETS_IDS);

	new ScheduleManager(dataScraperService).start();
}

await bootstrap();
