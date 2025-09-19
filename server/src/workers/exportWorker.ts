import { Worker } from "bullmq";
import { redis } from "@/utils/redis";
import { exportBuyers } from "@/resources/export/services/exportBuyerService";

const processExportBuyersJob = async (job: any) => {
    console.log("Job data: ", job.data);
    const { filterParams, sortParams, exportId } = job.data;
    const result = await exportBuyers(filterParams, sortParams, exportId);
    console.log(result);
}

export const exportWorker = new Worker("csv-export", processExportBuyersJob,
    {
        connection: redis,
    }
);

exportWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

exportWorker.on('failed', (job, error) => {
    console.error(`Job ${job?.id} failed with error:`, error);
});
