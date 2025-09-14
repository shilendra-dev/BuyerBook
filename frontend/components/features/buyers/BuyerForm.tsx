"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/ui/atoms/button";
import { Input } from "@/ui/atoms/input";
import { Textarea } from "@/ui/atoms/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/molecules/form";
import { toast } from "react-hot-toast";
import { buyerApi } from "./api/buyerApis";

const buyerFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.string().length(0)),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  city: z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]),
  propertyType: z.enum([
    "Apartment",
    "Villa",
    "Plot",
    "Office",
    "Retail",
    "Warehouse",
    "Industrial",
    "Other",
  ]),
  bhk: z.enum(["1", "2", "3", "4", "Studio"]).optional(),
  purpose: z.enum(["Buy", "Rent"]),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  timeline: z.enum(["0-3m", "3-6m", ">6m", "Exploring"]).optional(),
  source: z.enum(["Website", "Walk-in", "Call", "Referral", "Other"]),
  notes: z.string().optional(),
});

export type BuyerFormValues = z.infer<typeof buyerFormSchema>;

export function BuyerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<BuyerFormValues>({
    resolver: zodResolver(buyerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      city: "Chandigarh",
      propertyType: "Apartment",
      bhk: undefined,
      purpose: "Buy",
      budgetMin: undefined,
      budgetMax: undefined,
      timeline: undefined,
      source: "Website",
      notes: undefined,
    },
  });

  const handleSubmit = async (data: BuyerFormValues) => {
    setIsLoading(true);
    try {
      const result = await buyerApi.createBuyer(data);
      toast.success("Buyer added successfully!");
      console.log(result);
      form.reset();
    } catch (error) {
      toast.error("Failed to add buyer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background border-border/50 focus:border-primary/50 transition-colors"
                    {...field}
                  >
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Mohali">Mohali</option>
                    <option value="Zirakpur">Zirakpur</option>
                    <option value="Panchkula">Panchkula</option>
                    <option value="Other">Other</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type *</FormLabel>
                <FormControl>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background border-border/50 focus:border-primary/50 transition-colors"
                    {...field}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Office">Office</option>
                    <option value="Retail">Retail</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Other">Other</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bhk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BHK</FormLabel>
                <FormControl>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background border-border/50 focus:border-primary/50 transition-colors"
                    {...field}
                    value={field.value || ""}
                  >
                    <option value="">Select BHK</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="Studio">Studio</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose *</FormLabel>
                <FormControl>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background border-border/50 focus:border-primary/50 transition-colors"
                    {...field}
                  >
                    <option value="Buy">Buy</option>
                    <option value="Rent">Rent</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source *</FormLabel>
                <FormControl>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background border-border/50 focus:border-primary/50 transition-colors"
                    {...field}
                  >
                    <option value="Website">Website</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Call">Call</option>
                    <option value="Referral">Referral</option>
                    <option value="Other">Other</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budgetMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Min</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter minimum budget"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budgetMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Max</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter maximum budget"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeline</FormLabel>
                <FormControl>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background border-border/50 focus:border-primary/50 transition-colors"
                    {...field}
                    value={field.value || ""}
                  >
                    <option value="">Select Timeline</option>
                    <option value="0-3m">0-3 months</option>
                    <option value="3-6m">3-6 months</option>
                    <option value=">6m">More than 6 months</option>
                    <option value="Exploring">Exploring</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter any additional notes" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
              ? "Update Buyer"
              : "Add Buyer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
