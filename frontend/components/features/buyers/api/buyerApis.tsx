import { api } from "@/lib/axios";
import { BuyerFormValues } from "@/components/features/buyers/BuyerForm";
import { Buyer } from "@/schema/buyerSchema";

// API functions
export const buyerApi = {
  // Get all buyers
  getAllBuyers: async (): Promise<Buyer[]> => {
    try {
      const response = await api.get<Buyer[]>("/buyers");
      return response.data;
    } catch (error) {
      console.error("Error fetching buyers:", error);
      throw error;
    }
  },

  // Get buyer by ID
  getBuyerById: async (id: string): Promise<Buyer> => {
    try {
      const response = await api.get<Buyer>(`/buyers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching buyer with id ${id}:`, error);
      throw error;
    }
  },

  // Create new buyer
  createBuyer: async (buyerData: BuyerFormValues): Promise<Buyer> => {
    try {
      // Convert string budgets to numbers if they exist
      const processedData = {
        ...buyerData,
        budgetMin: buyerData.budgetMin ? Number(buyerData.budgetMin) : undefined,
        budgetMax: buyerData.budgetMax ? Number(buyerData.budgetMax) : undefined,
      };

      const response = await api.post<Buyer>("/buyers", processedData);
      return response.data;
    } catch (error) {
      console.error("Error creating buyer:", error);
      throw error;
    }
  },

  // Update buyer
  updateBuyer: async (id: string, buyerData: Partial<BuyerFormValues>): Promise<Buyer> => {
    try {
      // Convert string budgets to numbers if they exist
      const processedData = {
        ...buyerData,
        budgetMin: buyerData.budgetMin ? Number(buyerData.budgetMin) : undefined,
        budgetMax: buyerData.budgetMax ? Number(buyerData.budgetMax) : undefined,
      };

      const response = await api.put<Buyer>(`/buyers/${id}`, processedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating buyer with id ${id}:`, error);
      throw error;
    }
  },

  // Delete buyer
  deleteBuyer: async (id: string): Promise<void> => {
    try {
      await api.delete(`/buyers/${id}`);
    } catch (error) {
      console.error(`Error deleting buyer with id ${id}:`, error);
      throw error;
    }
  },

  // Insert bulk buyers
  insertBulkBuyers: async (buyersData: any): Promise<any> => {
    try {
      const response = await api.post("/buyers/bulk", buyersData);
      return response.data;
    } catch (error) {
      console.error("Error inserting bulk buyers:", error);
      throw error;
    }
  },

};