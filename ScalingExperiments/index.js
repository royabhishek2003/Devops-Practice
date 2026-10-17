const express = require("express")
const cluster = require("cluster")
const os = require("os")

const cpucount=os.cpus().length;

if(cluster.isPrimary){
    console.log(`Total cpu in the machine is : ${cpucount}`);
    console.log(`Primary ${process.pid} is running `)

    // fork worker 
    for(let i=1; i<=cpucount;i+=1){
        cluster.fork();
    }
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
// now here since we are using cluster module every process have the same port number without the port conflict 
app.listen(3000,()=>{
    console.log("App is listening at 3000 port");
})

}

