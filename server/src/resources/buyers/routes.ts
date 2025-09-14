import { createApi } from "@/lib/ApiRouter";
import { createBuyerAPI } from "./api/create-buyer.api";
import { updateBuyerAPI } from "./api/update-buyer.api";
import { getAllBuyersAPI } from "./api/get-all-buyers.api";
import { getBuyerAPI } from "./api/get-buyer.api";

// Get all buyers (with pagination)
createApi().get("/buyers").authSecure(getAllBuyersAPI);

// Create buyer
createApi().post("/buyers").authSecure(createBuyerAPI);

// Update buyer by ID (dynamic route)
createApi().put("/buyers/:id").authSecure(updateBuyerAPI);

// Get buyer by Id
createApi().get("/buyers/:id").authSecure(getBuyerAPI);