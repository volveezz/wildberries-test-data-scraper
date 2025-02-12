interface BoxWarehouse {
	boxDeliveryAndStorageExpr: string;
	boxDeliveryBase: string;
	boxDeliveryLiter: string;
	boxStorageBase: string;
	boxStorageLiter: string;
	warehouseName: string;
}

interface WarehousesBoxRates {
	dtNextBox: string;
	dtTillMax: string;
	warehouseList: BoxWarehouse[];
}

interface TariffsBoxResponse {
	data: WarehousesBoxRates;
}

export interface BoxRequest {
	response: TariffsBoxResponse;
}
