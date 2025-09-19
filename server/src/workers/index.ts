import type { Worker } from "bullmq";

const workers: Worker[] = [];

export async function startAllWorkers() {
    const { exportWorker } = await import("./exportWorker");
    workers.push(exportWorker);
    console.log("All workers started");
}

export async function stopAllWorkers() {
    await Promise.all(workers.map((worker) => worker.close()));
    console.log("All workers stopped");
}