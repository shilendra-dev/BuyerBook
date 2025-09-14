"use client";

import { Button } from "@/ui/atoms/button";
import { CloudDownload, CloudUpload, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/molecules/card";
import { Input } from "@/ui/atoms/input";
import { DataTable } from "@/components/features/buyers/DataTable";
import { useRouter } from "next/navigation";
import { buyerApi } from "@/lib/buyerApi";
import { Buyer } from "@/types/buyerType";
import { useEffect, useState } from "react";

export default function BuyersPage() {
  const router = useRouter();
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBuyers() {
      try {
        const res = await buyerApi.getAllBuyers();
        setBuyers(res.buyers); // because API returns { buyers, pagination }
      } catch (error) {
        console.error("Failed to fetch buyers:", error);
      } finally {
        setLoading(false);
      }
    }
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
            <Button variant="outline">
              <CloudUpload /> Import
            </Button>
            <Button variant="outline">
              <CloudDownload /> Export
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
              {
                buyers.filter((b) => b.status === "New").length
              }
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
              {
                buyers.filter((b) => b.status === "Converted").length
              }
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

        {/* Table */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Buyer Leads</CardTitle>
            <CardDescription>Manage and track your buyer leads</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Input
              placeholder="Search buyer leads..."
              className="w-sm bg-background"
            />
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable data={buyers} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
