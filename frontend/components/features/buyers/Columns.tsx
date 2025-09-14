"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Buyer } from '@/types'

export const columns: ColumnDef<Buyer>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.email;
      return email || "-";
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "propertyType",
    header: "Property Type",
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
  },
  {
    accessorKey: "budgetMin",
    header: "Budget",
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
    cell: ({ row }) => {
      const timeline = row.original.timeline;
      return timeline || "-";
    },
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString('en-IN');
    },
  },
]