import { JWT } from "google-auth-library";
import { google, sheets_v4 } from "googleapis";
import knex from "../database/index.js";

const SPREADSHEET_NAME = "stocks_coefs";

const addSheetRequest = {
	requests: [
		{
			addSheet: {
				properties: {
					title: SPREADSHEET_NAME,
				},
			},
		},
	],
};

export class GoogleSheetsService {
	private auth!: JWT;
	private spreadsheets!: sheets_v4.Resource$Spreadsheets;

	constructor(private credentialsPath: string) {}

	async initialize() {
		this.auth = new JWT({
			keyFile: this.credentialsPath,
			scopes: ["https://www.googleapis.com/auth/spreadsheets"],
		});

		await this.auth.authorize();
		const sheets = google.sheets({ version: "v4", auth: this.auth });
		this.spreadsheets = sheets.spreadsheets;
	}

	async syncDatabaseToSheet(spreadsheetsIds: string[]) {
		try {
			const dbData = await knex("wb_box_tariffs").select("*");

			if (dbData.length === 0) {
				console.info("Database is empty, unable to update sheets");
				return;
			}

			// Table headers
			const header = [
				"queryDate",
				"dtNextBox",
				"dtTillMax",
				"warehouseName",
				"boxDeliveryAndStorageExpr",
				"boxDeliveryBase",
				"boxDeliveryLiter",
				"boxStorageBase",
				"boxStorageLiter",
			];

			dbData.sort((a, b) => {
				return parseInt(a.boxDeliveryAndStorageExpr, 10) - parseInt(b.boxDeliveryAndStorageExpr, 10);
			});

			// Convert database rows into 2D array for spreadsheets
			const rows = dbData.map((row) => header.map((col) => row[col]?.toString() || ""));

			// Combine headers + data
			const sheetData = [header, ...rows];

			// Update sheets
			for (const spreadsheetId of spreadsheetsIds) {
				// it is possible to add some space at the top for any reasons
				// by adding startRow, startCol as arguments into the function
				await this.updateSheet(sheetData, spreadsheetId);
			}
		} catch (error) {
			console.error("Error syncing database to Google Sheet:", error);
			return;
		}
	}

	// Function to test if stocks_coefs sheet exists and create it if not
	private async isDataSheetExists(spreadsheetId: string) {
		let sheetId: number | undefined | null;
		const spreadsheet = await this.spreadsheets.get({ spreadsheetId });

		const existingSheet = spreadsheet.data.sheets?.find((s) => s.properties?.title === SPREADSHEET_NAME);

		if (existingSheet) {
			sheetId = existingSheet.properties?.sheetId;
		} else {
			const batchUpdateResponse = await this.spreadsheets.batchUpdate({
				spreadsheetId,
				requestBody: addSheetRequest,
			});
			sheetId = batchUpdateResponse.data.replies?.[0].addSheet?.properties?.sheetId;
		}

		if (!sheetId) {
			throw new Error("Sheet ID could not be determined");
		}

		return sheetId;
	}

	private async updateSheet(data: any[][], spreadsheetId: string, startRow: number = 1, startCol: number = 1) {
		try {
			await this.isDataSheetExists(spreadsheetId);

			const numRows = data.length;
			const numCols = data[0]?.length || 0;
			const range = `${SPREADSHEET_NAME}!${this.getA1Notation(startRow, startCol, numRows, numCols)}`;

			await this.spreadsheets.values.update({
				spreadsheetId,
				range,
				valueInputOption: "RAW",
				requestBody: { values: data },
			});

			console.log(`Spreadsheet ${spreadsheetId} updated successfully`);
		} catch (error) {
			console.error("Error updating/creating sheet:", error);
			throw error;
		}
	}

	// Get spreadsheet range (Table!A19:M23)
	private getA1Notation(startRow: number, startCol: number, numRows: number, numCols: number): string {
		const endRow = startRow + numRows - 1;
		const endCol = startCol + numCols - 1;

		const startColLetter = this.getColumnLetter(startCol);
		const endColLetter = this.getColumnLetter(endCol);

		return `${startColLetter}${startRow}:${endColLetter}${endRow}`;
	}

	private getColumnLetter(col: number): string {
		let letter = "";
		while (col > 0) {
			let remainder = col % 26;
			if (remainder === 0) {
				remainder = 26;
				col--;
			}
			letter = String.fromCharCode(64 + remainder) + letter;
			col = Math.floor(col / 26);
		}
		return letter;
	}
}
