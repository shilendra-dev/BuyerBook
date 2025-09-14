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
import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { columns } from "@/components/features/buyers/Columns";
import { Buyer } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/organisms/table";

export default function BuyersPage() {
    const [data, setData] = useState<Buyer[]>([]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    
  return (
    <div className="w-full h-full">
      <div className="flex flex-col m-20 mx-40 gap-6">
        <div className="flex w-full justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Buyer Leads</h1>
            <p className="text-muted-foreground">
              Manage and track your buyer leads
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="default">
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
        <div className="flex gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Total Leads</CardTitle>
              <CardDescription>Total number of buyer leads</CardDescription>
            </CardHeader>
            <CardContent className="text-xl font-semibold">2</CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>New Leads</CardTitle>
              <CardDescription>Total number of new buyer leads</CardDescription>
            </CardHeader>
            <CardContent className="text-xl font-semibold">4</CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Converted Leads</CardTitle>
              <CardDescription>
                Total number of converted buyer leads
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xl font-semibold">0</CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Showing</CardTitle>
              <CardDescription>
                Total number of buyer leads being shown
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xl font-semibold">2</CardContent>
          </Card>
        </div>
        {/* Table container */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Buyer Leads</CardTitle>
            <CardDescription>Manage and track your buyer leads</CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder="Search buyer leads..." className="w-sm bg-background"/>
            <Table className="mt-4 bg-background border rounded-lg">
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>   
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
