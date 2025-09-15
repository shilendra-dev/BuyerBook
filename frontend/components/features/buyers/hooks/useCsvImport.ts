import Papa from "papaparse";
import { useState } from "react";
import * as z from "zod";

interface CsvImportOptions<T> {
    schema: z.ZodSchema<T>;
    onSuccess?: (data: T[]) => void;
    onError?: (errors: Array<{ row: number; message: string }>) => void;
}


export function useCsvImport<T extends Record<string, any>>(options: CsvImportOptions<T>) {
    const [errors, setErrors] = useState<{ row: number; message: string }[]>([]);
    const [ParsedData, setParsedData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const validateRow = (row: any, index: number): { data: T | null; errors: string[] } => {
        const result = options.schema.safeParse(row);

        if (result.success) {
            return { data: result.data, errors: [] };
        } else {
            const formattedErrors = result.error.issues.map(
                issue => `${issue.path.join(".")}: ${issue.message}`
            );
            return { data: null, errors: formattedErrors };
        }
    }

    const handleParsedData = (results: Papa.ParseResult<T>) => {
        //Validate headers if req headers are provided
        setErrors([]);

        const validationErrors: Array<{ row: number; message: string }> = [];
        const validData: T[] = [];

        results.data.forEach((row, index) => {
            const { data, errors: rowErrors } = validateRow(row, index + 1);

            if (rowErrors.length > 0) {
                rowErrors.forEach(message => {
                    validationErrors.push({
                        row: index + 1,
                        message: `Row ${index + 1}: ${message}`
                    });
                });
            }

            if (data) {
                validData.push(data);
            }
        });

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            options.onError?.(validationErrors);
        }
        if (validData.length > 0) {
            options.onSuccess?.(validData);
            setParsedData(validData);
        }
    };

    const handleFileUpload = (file: File) => {
        if (!file) return;

        setIsLoading(true);
        setErrors([]);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                handleParsedData(results as Papa.ParseResult<T>) //after parsing the file, we will get the data in the results.data and we will then process it in handleParsedData function
            },
            error: (error) => {
                const errorMessage = `Error parsing file: ${error.message}`;
                setErrors([{ row: 0, message: errorMessage }]);
                options.onError?.([{ row: 0, message: errorMessage }]);
                setIsLoading(false);
            }
        })
    }
    return {
        handleFileUpload,
        errors,
        ParsedData,
        isLoading,
    }
}