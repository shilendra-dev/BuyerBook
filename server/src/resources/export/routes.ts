import { createApi } from "@/lib/ApiRouter";
import { exportBuyersAPI } from "./api/export-buyers.api";

createApi().get("/export/buyers").authSecure(exportBuyersAPI);
