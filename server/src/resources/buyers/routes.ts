import { createApi } from "@/lib/ApiRouter";
import { createBuyerAPI } from "./api/create-buyer.api";

createApi().post("/buyers").authSecure(createBuyerAPI);