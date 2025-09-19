"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/ui/molecules/dialog";
import { Button } from "@/ui/atoms/button";
import { CloudDownload } from "lucide-react";
import { useBuyerStore } from "@/lib/store/buyerStore";

export function BuyerExportDialogue() {
    const { exportBuyers } = useBuyerStore();

    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <CloudDownload className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export Buyers</DialogTitle>
                    <DialogDescription>
                        Export buyers to a CSV file.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={exportBuyers}>Export</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}