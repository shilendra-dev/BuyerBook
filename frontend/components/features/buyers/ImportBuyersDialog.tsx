"use client";

import { useState } from "react";
import { Button } from "@/ui/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/molecules/dialog";
import { Input } from "@/ui/atoms/input";
import { Label } from "@/ui/atoms/label";
import { CloudUpload } from "lucide-react";
import { useCsvImport } from "@/components/features/buyers/hooks/useCsvImport";
import { buyerCsvSchema } from "@/schema/buyerSchema";

export function ImportBuyersDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { handleFileUpload, errors, isLoading } = useCsvImport({
    schema: buyerCsvSchema,
    onSuccess: (data) => {
      console.log("Imported data:", data);
    },
    onError: (errors) => {
      console.log("Import errors:", errors);
    }
  })

  const handleImport = () => {
    if (file) {
      handleFileUpload(file);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CloudUpload className="mr-2 h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Buyers</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing buyer information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">CSV File</Label>
            <Input
              id="file"
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Only .csv files are supported
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" disabled={!file || isLoading} onClick={handleImport}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
