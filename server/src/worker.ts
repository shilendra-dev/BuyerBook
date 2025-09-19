import { startAllWorkers } from "./workers";
import { stopAllWorkers } from "./workers";

async function main() {
    try {
        await startAllWorkers();
        // Graceful shutdown handlers
        const gracefulShutdown = async (signal: string) => {
            console.log(`Received ${signal}, shutting down workers gracefully...`);

            try {
                await stopAllWorkers();
                console.log('Workers shut down successfully');
                process.exit(0);
            } catch (error) {
                console.error('Error during shutdown:', { error });
                process.exit(1);
            }
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    } catch (error) {
        console.error('Failed to start worker process:', { error });
        process.exit(1);
    }
}

main();
