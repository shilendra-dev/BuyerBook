import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Buyer, Status, City, PropertyType, Purpose, Source, Timeline } from '@/types/buyerType';
import { buyerApi } from '@/lib/buyerApi';

type Sort = { id: string; desc: boolean }

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
    filters: {
        city: City | '';
        status: Status | '';
        propertyType: PropertyType | '';
        purpose: Purpose | '';
        source: Source | '';
        timeline: Timeline | '';
    };

    // Sorting
    sortBy: keyof Buyer;
    sortOrder: 'asc' | 'desc';

    // Loading states
    isLoading: boolean;
    isFetching: boolean;
    error: string | null;

    // Actions
    fetchBuyers: (params?: {
        page?: number
        pageSize?: number
        sorting?: Sort[]
    }) => Promise<void>
    fetchBuyerById: (id: string) => Promise<Buyer | undefined>;
    createBuyer: (buyerData: Omit<Buyer, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>) => Promise<void>;
    updateBuyer: (id: string, buyerData: Partial<Buyer>) => Promise<void>;
    deleteBuyer: (id: string) => Promise<void>;

    // Pagination actions
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;

    // Filter actions
    setSearchQuery: (query: string) => void;
    setFilters: (filters: Partial<BuyerState['filters']>) => void;
    resetFilters: () => void;

    // Sorting actions
    setSort: (sortBy: keyof Buyer, order?: 'asc' | 'desc') => void;

    // Utility
    reset: () => void;
}

// Define the state properties without methods
type BuyerStateProperties = Omit<BuyerState,
    'fetchBuyers' | 'fetchBuyerById' | 'createBuyer' | 'updateBuyer' |
    'deleteBuyer' | 'setPage' | 'setPageSize' | 'setSearchQuery' |
    'setFilters' | 'resetFilters' | 'setSort' | 'reset'
>;

const initialState: BuyerStateProperties = {
    buyers: [],
    currentBuyer: null,
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
    searchQuery: '',
    filters: {
        city: '',
        status: '',
        propertyType: '',
        purpose: '',
        source: '',
        timeline: '',
    },
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    isLoading: false,
    isFetching: false,
    error: null,
};

export const useBuyerStore = create<BuyerState>()(
    persist(
        (set, get) => ({
            ...initialState,

            fetchBuyers: async () => {
                try {
                    set({ isFetching: true, error: null });
                    const { page, pageSize, searchQuery, filters, sortBy, sortOrder } = get();

                    const params = {
                        page,
                        limit: pageSize,
                        search: searchQuery,
                        ...(filters.city && { city: filters.city }),
                        ...(filters.status && { status: filters.status }),
                        ...(filters.propertyType && { propertyType: filters.propertyType }),
                        ...(filters.purpose && { purpose: filters.purpose }),
                        ...(filters.source && { source: filters.source }),
                        ...(filters.timeline && { timeline: filters.timeline }),
                        sortBy,
                        sortOrder,
                    };

                    const response = await buyerApi.getAllBuyers(params);

                    set({
                        buyers: response.buyers,
                        totalItems: response.pagination.total,
                        totalPages: Math.ceil(response.pagination.total / pageSize),
                    });
                } catch (error) {
                    console.error('Failed to fetch buyers:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch buyers',
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
                    console.error('Failed to fetch buyer:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch buyer';
                    set({ error: errorMessage });
                    throw new Error(errorMessage);
                } finally {
                    set({ isLoading: false });
                }
            },

            createBuyer: async (buyerData) => {
                try {
                    set({ isLoading: true, error: null });
                    // Ensure tags is always an array, defaulting to empty array if undefined or null
                    const buyerDataWithDefaults = {
                        ...buyerData,
                        tags: buyerData.tags || []
                    };
                    await buyerApi.createBuyer(buyerDataWithDefaults);
                    await get().fetchBuyers();
                } catch (error) {
                    console.error('Failed to create buyer:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to create buyer';
                    set({ error: errorMessage });
                    throw new Error(errorMessage);
                } finally {
                    set({ isLoading: false });
                }
            },

            updateBuyer: async (id, buyerData) => {
                try {
                    set({ isLoading: true, error: null });
                    // Ensure tags is always an array, defaulting to empty array if undefined or null
                    const buyerDataWithDefaults = {
                        ...buyerData,
                        tags: buyerData.tags || []
                    };
                    await buyerApi.updateBuyer(id, buyerDataWithDefaults);
                    await Promise.all([get().fetchBuyers(), get().fetchBuyerById(id)]);
                } catch (error) {
                    console.error('Failed to update buyer:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to update buyer';
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
                    console.error('Failed to delete buyer:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Failed to delete buyer';
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
                    sortOrder: order || (state.sortBy === sortBy && state.sortOrder === 'asc' ? 'desc' : 'asc'),
                }));
                get().fetchBuyers();
            },

            // Reset
            reset: () => {
                set(initialState);
            },
        }),
        {
            name: 'buyer-storage',
            partialize: (state) => ({
                filters: state.filters,
                sortBy: state.sortBy,
                sortOrder: state.sortOrder,
                pageSize: state.pageSize,
            }),
            storage: createJSONStorage(() => localStorage),
        }
    )
);

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
