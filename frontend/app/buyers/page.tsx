"use client";

import { Button } from "@/ui/atoms/button";
import { CloudDownload, Loader2, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/molecules/card";
import { Input } from "@/ui/atoms/input";
import { DataTable } from "@/components/features/buyers/DataTable";
import { BuyerFilters } from "@/components/features/buyers/BuyerFilters";
import { ImportBuyersDialog } from "@/components/features/buyers/ImportBuyersDialog";
import { useRouter } from "next/navigation";
import { useBuyerStore } from "@/lib/store/buyerStore";
import { useEffect } from "react";
import { buyerApi } from "@/lib/buyerApi";

export default function BuyersPage() {
  const router = useRouter();
  const { buyers, isFetching, fetchBuyers, exportBuyers, handleExportPolling, isLoading } =
    useBuyerStore();

  const handleExportBuyers = async () => {
    const result = await exportBuyers();
    const exportId = result.data.exportId;
    const resultWithUrl = await handleExportPolling(exportId);
    const url = resultWithUrl.data.url;
    window.open(url, "_blank");
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex flex-col m-20 mx-30 gap-6">
        <div className="flex w-full justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Buyer Leads</h1>
            <p className="text-muted-foreground">
              Manage and track your buyer leads
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="default"
              onClick={() => router.push("/buyers/new")}
            >
              <Plus /> Add Buyer
            </Button>
            <ImportBuyersDialog />
            <Button
              variant="outline"
              onClick={() => {
                handleExportBuyers();
              }}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CloudDownload className="mr-2 h-4 w-4" />
              )}
              Export
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="flex gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Total Leads</CardTitle>
              <CardDescription>Total number of buyer leads</CardDescription>
            </CardHeader>
            <CardContent className="text-xl font-semibold">
              {buyers.length}
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>New Leads</CardTitle>
              <CardDescription>Total number of new buyer leads</CardDescription>
            </CardHeader>
            <CardContent className="text-xl font-semibold">
              {buyers.filter((b) => b.status === "New").length}
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Converted Leads</CardTitle>
              <CardDescription>
                Total number of converted buyer leads
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xl font-semibold">
              {buyers.filter((b) => b.status === "Converted").length}
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Showing</CardTitle>
              <CardDescription>
                Total number of buyer leads being shown
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xl font-semibold">
              {buyers.length}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <BuyerFilters />

        {/* Table */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Buyer Leads</CardTitle>
                <CardDescription>
                  View and manage all your buyer leads in one place
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search buyers..."
                  className="w-64"
                  onChange={(e) =>
                    useBuyerStore.getState().setSearchQuery(e.target.value)
                  }
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {isFetching ? <p>Loading...</p> : <DataTable />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
