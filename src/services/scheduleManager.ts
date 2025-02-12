import { schedule } from "node-cron";
import { DataScraperService } from "./dataScraperService.js";

export class ScheduleManager {
	constructor(private service: DataScraperService) {}

	public start() {
		// 0 1 * * * - every hour at :00
		// * 1 * * * - every hour
		// * * * * * - every minute
		schedule("0 1 * * *", () => this.service.scrape());
		console.info("Task was scheduled");
	}
}
