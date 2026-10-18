import cluster from "cluster"
import os from "os"
import {app} from "./index.ts"

const NUMBEROFCPU= os.cpus().length;
cluster.schedulingPolicy = cluster.SCHED_RR; // it shdule the request to every wroker process evenly 

if(cluster.isPrimary){

    console.log(`Master ${process.pid} is running `);
    for(let i=0;i<NUMBEROFCPU; i++){
        cluster.fork();
    }
}else{
    app.listen(3000, ()=>{
        console.log("App is listining on 3000 port");
    })
}