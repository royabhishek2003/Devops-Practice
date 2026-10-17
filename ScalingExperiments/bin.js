
// now here since we are using cluster module every process have the same port number without the port conflict 
import cluster from "cluster"
import os from "os"
import {app} from "./index.js"

cluster.schedulingPolicy = cluster.SCHED_RR; // it shdule the request to every wroker process evenly 
const cpucount=os.cpus().length;

if(cluster.isPrimary){
    console.log(`Total cpu in the machine is : ${cpucount}`);
    console.log(`Primary ${process.pid} is running `)

    // fork worker 
    for(let i=1; i<=cpucount;i+=1){
        cluster.fork();
    }

    setTimeout(() => {
    console.log("Active workers:");

    for (const id in cluster.workers) {
        console.log({
            workerId: cluster.workers[id].id,
            pid: cluster.workers[id].process.pid
        });
    }
}, 1000);
    cluster.on("exit", (worker, code, signal)=>{
        console.log(`Worker ${worker.process.pid} died `);
        console.log("lets forl another process");
        cluster.fork()
    })
}
else{
    app.listen(3000,()=>{
        console.log("App is listening at 3000 port");
    })
}

