import { schedule } from "node-cron";
import { DataScraperService } from "./dataScraperService.js";

export class ScheduleManager {
	constructor(private service: DataScraperService) {}

	public start() {
		schedule("0 * * * *", () => this.service.scrape());
		console.info("Task was scheduled");
	}
}
