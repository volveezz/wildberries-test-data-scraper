import { BoxRequest } from "../interfaces/Wildberries.js";

/**
 * @typedef {object} WarehouseBoxRates
 * @property {string} boxDeliveryAndStorageExpr Coefficient, %. The delivery and storage cost is multiplied by it. All prices contain final data, with this coefficient.
 * @property {string} boxDeliveryBase Delivery of 1 liter, ₽.
 * @property {string} boxDeliveryLiter Delivery of each next liter, ₽.
 * @property {string} boxStorageBase Storage of 1 liter, ₽.
 * @property {string} boxStorageLiter Storage of each next liter, ₽.
 * @property {string} warehouseName Warehouse.
 */

/**
 * @typedef {object} WarehousesBoxRates
 * @property {string} dtNextBox Start date of next tariff.
 * @property {string} dtTillMax End date of the last set tariff.
 * @property {WarehouseBoxRates[] | null} warehouseList Array of objects or null. Box tariffs grouped by Wildberries warehouses.
 */

/**
 * @typedef {object} TariffsBoxResponse
 * @property {WarehousesBoxRates} data
 */

/**
 * @typedef {object} BoxRequest
 * @property {TariffsBoxResponse} response
 */

/**
 * Retrieves Wildberries box tariffs
 * @returns {Promise<{ boxRequest: BoxRequest } | null>}
 */
export class WildberriesService {
	/**
	 * Retrieves Wildberries box tariffs
	 * @returns {Promise<{ boxRequest: BoxRequest } | null>}
	 */
	public async getBoxData(): Promise<{ boxRequest: BoxRequest } | null> {
		try {
			const queryParam = new Date().toISOString().split("T")[0];
			if (!queryParam) throw new Error("Invalid query parameter");

			const BOX_TARIFFS = "https://common-api.wildberries.ru/api/v1/tariffs/box?date=" + queryParam;

			const authorizationHeader: HeadersInit = { Authorization: `Bearer ${process.env.WB_API_KEY}` };
			const boxRequest = await (await fetch(BOX_TARIFFS, { headers: authorizationHeader })).json();

			return boxRequest;
		} catch (error) {
			console.error(`Error happened`, error);
			return null;
		}
	}
}
