// Assignment find the sum from 0 to 10000000 using clusturemodule usign parallel process 
// here in each worker node we can run the express or node app like we do earlier 


import cluster from"cluster";
import os  from "os";

const CPU_COUNT = os.cpus().length;
const LIMIT = 100_000_000;

if (cluster.isPrimary) {
    console.log(`Primary PID: ${process.pid}`);
    console.log(`Logical CPUs: ${CPU_COUNT}`);

    const startTime = process.hrtime.bigint();
    const workers = [];

    let total = 0;
    let completed = 0;

    const chunkSize = Math.floor(LIMIT / CPU_COUNT);

    for (let i = 0; i < CPU_COUNT; i++) {
        const worker = cluster.fork();
        workers.push(worker);

        const start = i * chunkSize + 1;

        const end = i === CPU_COUNT - 1
            ? LIMIT
            : (i + 1) * chunkSize;

        // listening the message of worker process 
        worker.on("message", (message) => {
            if (message.type === "result") {
                total += message.sum;
                completed++;

                console.log(
                    `Worker ${message.pid} finished: ${message.sum}`
                );

                if (completed === CPU_COUNT) {
                    const elapsedMs =
                        Number(process.hrtime.bigint() - startTime) / 1e6;

                    console.log(`Final sum: ${total}`);
                    console.log(`Time: ${elapsedMs.toFixed(2)} ms`);

                    for (const w of workers) {
                        w.disconnect();
                    }
                }
            }
        });

        // sending the message to worker process 
        worker.send({
            type: "calculate",
            start,
            end
        });
    }

} else {
    // listinigng the message of primary process 
    process.on("message", (message) => {
        if (message.type !== "calculate") return;

        const start = message.start;
        const end = message.end;

        let sum = 0;

        for (let i = start; i <= end; i++) {
            sum += i;
        }

        // sending the message to primary process 
        process.send({
            type: "result",
            pid: process.pid,
            sum
        });
    });
}
