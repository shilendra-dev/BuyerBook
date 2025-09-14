"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BuyerForm } from "@/components/features/buyers/BuyerForm";
import type { BuyerFormValues } from "@/components/features/buyers/BuyerForm";
import { Button } from "@/ui/atoms/button";

export default function NewBuyerPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleAddBuyer = async (data: BuyerFormValues) => {
        setIsSubmitting(true);
        try {
            console.log("Adding buyer:", data);
            // Implement your API call here
            // Example:
            // const response = await fetch('/api/buyers', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(data),
            // });
            // 
            // if (response.ok) {
            //   router.push("/buyers");
            // }
            
            // For now, just redirect back to buyers page
            router.push("/buyers");
        } catch (error) {
            console.error("Error adding buyer:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Add New Buyer</h1>
                    <Button 
                        variant="outline" 
                        onClick={() => router.push("/buyers")}
                    >
                        Back to Buyers
                    </Button>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <BuyerForm />
                </div>
            </div>
        </div>
    );
}