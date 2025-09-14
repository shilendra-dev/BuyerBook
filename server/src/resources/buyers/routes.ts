import { createApi } from "@/lib/ApiRouter";
import { createBuyerAPI } from "./api/create-buyer.api";
import { updateBuyerAPI } from "./api/update-buyer.api";

// Create buyer
createApi().post("/buyers").authSecure(createBuyerAPI);

// Update buyer by ID (dynamic route)
createApi().put("/buyers/:id").authSecure(updateBuyerAPI);
