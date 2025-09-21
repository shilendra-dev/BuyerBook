import { create } from "zustand";
import { Buyer } from "@/types/buyerType";
import { buyerApi } from "@/lib/buyerApi";
import { set } from "zod";

type Sort = { id: string; desc: boolean };

interface BuyerFilters {
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
}

interface BuyerState {
  buyers: Buyer[];
  currentBuyer: Buyer | null;

  // Pagination
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;

  // Filters
  searchQuery: string;
  filters: BuyerFilters;

  // Sorting
  sortBy: keyof Buyer;
  sortOrder: "asc" | "desc";

  // Loading states
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;

  // Actions
  fetchBuyers: (params?: {
    page?: number;
    pageSize?: number;
    sorting?: Sort[];
  }) => Promise<void>;
  fetchBuyerById: (id: string) => Promise<Buyer | undefined>;
  createBuyer: (
    buyerData: Omit<Buyer, "id" | "createdAt" | "updatedAt" | "ownerId">
  ) => Promise<void>;
  updateBuyer: (id: string, buyerData: Partial<Buyer>) => Promise<void>;
  deleteBuyer: (id: string) => Promise<void>;
  exportBuyers: () => Promise<any>;
  handleExportPolling: (exportId: string) => Promise<any>;

  // Pagination actions
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<BuyerState["filters"]>) => void;
  resetFilters: () => void;

  // Sorting actions
  setSort: (sortBy: keyof Buyer, order?: "asc" | "desc") => void;

  // Utility
  reset: () => void;
}

const initialState: Omit<
  BuyerState,
  | "fetchBuyers"
  | "fetchBuyerById"
  | "createBuyer"
  | "updateBuyer"
  | "deleteBuyer"
  | "exportBuyers"
  | "handleExportPolling"
  | "setPage"
  | "setPageSize"
  | "setSearchQuery"
  | "setFilters"
  | "resetFilters"
  | "setSort"
  | "reset"
> = {
  buyers: [],
  currentBuyer: null,
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
  searchQuery: "",
  filters: {},
  sortBy: "updatedAt",
  sortOrder: "desc",
  isLoading: false,
  isFetching: false,
  error: null,
};

export const useBuyerStore = create<BuyerState>((set, get) => ({
  ...initialState,

  fetchBuyers: async () => {
    try {
      set({ isFetching: true, error: null });
      const { page, pageSize, searchQuery, filters, sortBy, sortOrder } = get();

      // Only send pagination + sorting to backend

      const params = {
        paginationParams: {
          page,
          limit: pageSize
        },
        sortParams: {
          sortBy,
          sortOrder
        },
        filterParams: {
          ...filters,
          searchQuery
        }
      };

      const response = await buyerApi.getAllBuyers(params);

      // In-memory filtering
      let buyers = response.buyers;

      if (searchQuery) {
        buyers = buyers.filter((b) =>
          b.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (filters.city) {
        buyers = buyers.filter((b) => b.city === filters.city);
      }
      if (filters.propertyType) {
        buyers = buyers.filter((b) => b.propertyType === filters.propertyType);
      }
      if (filters.status) {
        buyers = buyers.filter((b) => b.status === filters.status);
      }
      if (filters.timeline) {
        buyers = buyers.filter((b) => b.timeline === filters.timeline);
      }

      set({
        buyers,
        totalItems: response.pagination.total, // backend total (unfiltered)
        totalPages: Math.ceil(response.pagination.total / pageSize),
      });
    } catch (error) {
      console.error("Failed to fetch buyers:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch buyers",
        buyers: [],
      });
    } finally {
      set({ isFetching: false });
    }
  },

  fetchBuyerById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const buyer = await buyerApi.getBuyerById(id);
      set({ currentBuyer: buyer });
      return buyer;
    } catch (error) {
      console.error("Failed to fetch buyer:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch buyer";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createBuyer: async (buyerData) => {
    try {
      set({ isLoading: true, error: null });
      const buyerDataWithDefaults = {
        ...buyerData,
        tags: buyerData.tags || [],
      };
      await buyerApi.createBuyer(buyerDataWithDefaults);
      await get().fetchBuyers();
    } catch (error) {
      console.error("Failed to create buyer:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create buyer";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updateBuyer: async (id, buyerData) => {
    try {
      set({ isLoading: true, error: null });
      const buyerDataWithDefaults = {
        ...buyerData,
        tags: buyerData.tags || [],
      };
      await buyerApi.updateBuyer(id, buyerDataWithDefaults);
      await Promise.all([get().fetchBuyers(), get().fetchBuyerById(id)]);
    } catch (error) {
      console.error("Failed to update buyer:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update buyer";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteBuyer: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await buyerApi.deleteBuyer(id);
      await get().fetchBuyers();
    } catch (error) {
      console.error("Failed to delete buyer:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete buyer";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  exportBuyers: async () => {
    try {
      set({ isLoading: true, error: null });
      const { page, pageSize, searchQuery, filters, sortBy, sortOrder } = get();

      // Only send pagination + sorting to backend

      const params = {
        sortParams: {
          sortBy,
          sortOrder
        },
        filterParams: {
          ...filters,
          searchQuery
        }
      };

      const result = await buyerApi.exportBuyers(params);
      return result;

    } catch (error) {
      console.error("Failed to delete buyer:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete buyer";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  handleExportPolling: async (exportId: string) => {
    try {
      set({ isLoading: true, error: null });
      const interval = 3000;
      const timeout = 10000;
      const startTime = Date.now();
      let result;

      while (true) {
        result = await buyerApi.exportBuyersPolling(exportId);
        console.log(result);
        if (result.data.status === "completed" || result.data.status === "failed") {
          break;
        }
        if (Date.now() - startTime > timeout) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
      return result;
    } catch (error) {
      console.error("Failed to poll export buyers:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to poll export buyers";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  // Pagination
  setPage: (page) => {
    set({ page });
    get().fetchBuyers();
  },
  setPageSize: (pageSize) => {
    set({ pageSize, page: 1 });
    get().fetchBuyers();
  },

  // Filters
  setSearchQuery: (searchQuery) => {
    set({ searchQuery, page: 1 });
    get().fetchBuyers();
  },
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      page: 1,
    }));
    get().fetchBuyers();
  },
  resetFilters: () => {
    set({
      filters: initialState.filters,
      page: 1,
    });
    get().fetchBuyers();
  },

  // Sorting
  setSort: (sortBy, order) => {
    set((state) => ({
      sortBy,
      sortOrder:
        order || (state.sortBy === sortBy && state.sortOrder === "asc"
          ? "desc"
          : "asc"),
    }));
    get().fetchBuyers();
  },

  // Reset
  reset: () => {
    set(initialState);
  },
}));

// Hooks
export const useBuyers = () => useBuyerStore((state) => state.buyers);
export const useCurrentBuyer = () => useBuyerStore((state) => state.currentBuyer);
export const usePagination = () =>
  useBuyerStore((state) => ({
    page: state.page,
    pageSize: state.pageSize,
    totalItems: state.totalItems,
    totalPages: state.totalPages,
  }));
export const useFilters = () => useBuyerStore((state) => state.filters);
export const useSearchQuery = () => useBuyerStore((state) => state.searchQuery);
export const useSorting = () =>
  useBuyerStore((state) => ({
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  }));
export const useLoading = () =>
  useBuyerStore((state) => ({
    isLoading: state.isLoading,
    isFetching: state.isFetching,
  }));
export const useError = () => useBuyerStore((state) => state.error);
