const express = require("express")
const cluster = require("cluster")
const os = require("os")

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
}else{

    const app= express();
    console.log(`Worker ${process.pid} started`)
    app.get("/",(req, res)=>{
    res.send("<h1> Hello World! </h1>")
    })

    app.get("/pid",(req, res)=>{
        console.log(`Request handled by worker ${process.pid}`);
        return res.status(200).json({
            "message":`Process id ${process.pid}`
        })
    })

    app.get("/api/:n", (req, res)=>{
        let n= Number(req.params.n);
        if(n>5000000000) n= 5000000000;
        let count=0;
        for(let i=1;i<=n;i++){
            count+=i;
        }
        return res.status(200).json({
            "message":`The count is ${count}`
        })
    })
// now here since we are using cluster module every process have the same port number without the port conflict 
app.listen(3000,()=>{
    console.log("App is listening at 3000 port");
})

}

