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
import { CircleCheckBig } from "lucide-react";
import { useState } from "react";
import { ParsingErrorTable } from "./parsing/ParsingErrorTable";

export function ImportResultsDialog({
  open,
  onOpenChange,
  validData,
  parsingErrors,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validData: any[];
  parsingErrors: any[];
  onConfirm: () => void;
}) {
  const [showResults, setShowResults] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle>Import Results</DialogTitle>
          <DialogDescription>
            Here are the results of your import:
          </DialogDescription>
        </DialogHeader>

        <div>
          {parsingErrors.length > 0 && validData.length === 0 && (
            <div>
              <p className="font-medium">Errors:</p>
              <ParsingErrorTable errors={parsingErrors} />
            </div>
          )}

          {parsingErrors.length > 0 && validData.length > 0 && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-medium">Errors:</p>
                <ParsingErrorTable errors={parsingErrors} />
              </div>
              <div>
                <p className="font-medium">Valid rows found:</p>
                <p className="text-sm">You can import {validData.length} valid rows</p>
              </div>
            </div>
          )}

          {parsingErrors.length === 0 && validData.length > 0 && (
            <div className="flex flex-col w-full items-center gap-3">
              <CircleCheckBig className="text-green-700 h-16 w-16" />
              <h1 className="text-lg">All rows are valid</h1>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
