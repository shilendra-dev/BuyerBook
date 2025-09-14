"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Buyer } from '@/types'

export const columns: ColumnDef<Buyer>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    enableSorting: false,
    cell: ({ row }) => {
      const buyer = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="font-medium">{buyer.fullName}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    enableSorting: false,
  },
  {
    accessorKey: "city",
    header: "City",
    enableSorting: false,
  },
  {
    accessorKey: "propertyType",
    header: "Property Type",
    enableSorting: false,
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
    enableSorting: false,
  },
  {
    accessorKey: "budgetMin",
    header: "Budget",
    enableSorting: true,
    cell: ({ row }) => {
      const buyer = row.original;
      const min = buyer.budgetMin;
      const max = buyer.budgetMax;
      
      if (!min && !max) return "-";
      
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(amount);
      };
      
      if (min && max) {
        return `${formatCurrency(min)} - ${formatCurrency(max)}`;
      }
      
      if (min) {
        return `Min: ${formatCurrency(min)}`;
      }
      
      if (max) {
        return `Max: ${formatCurrency(max)}`;
      }
      
      return "-";
    },
  },
  {
    accessorKey: "timeline",
    header: "Timeline",
    enableSorting: true,
    cell: ({ row }) => {
      const timeline = row.original.timeline;
      return timeline || "-";
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    enableSorting: true,
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt);
      return date.toLocaleDateString('en-IN');
    },
  },
]