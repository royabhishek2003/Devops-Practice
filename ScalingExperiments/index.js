
 import express from "express"
 export const app= express();
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