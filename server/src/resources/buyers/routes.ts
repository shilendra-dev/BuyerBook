import { createApi } from "@/lib/ApiRouter";
import { createBuyerAPI } from "./api/create-buyer.api";
import { updateBuyerAPI } from "./api/update-buyer.api";
import { getAllBuyersAPI } from "./api/get-all-buyers.api";
import { getBuyerAPI } from "./api/get-buyer.api";
import { deleteBuyerAPI } from "./api/delete-buyer.api";
import { uploadBulkBuyersAPI } from "./api/upload-bulk-buyers.api";

// Get all buyers (with pagination)
createApi().get("/buyers").authSecure(getAllBuyersAPI);

// Create buyer
createApi().post("/buyers").authSecure(createBuyerAPI);

// Update buyer by ID (dynamic route)
createApi().put("/buyers/:id").authSecure(updateBuyerAPI);

// Get buyer by Id
createApi().get("/buyers/:id").authSecure(getBuyerAPI);

// Delete buyer by Id
createApi().delete("/buyers/:id").authSecure(deleteBuyerAPI);

// Upload bulk buyers
createApi().post("/buyers/bulk").authSecure(uploadBulkBuyersAPI);
