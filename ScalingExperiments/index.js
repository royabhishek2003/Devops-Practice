const express = require("express")
const os = require("os")

console.log(os.cpus().length);  // gives the number of cpu cores a machine have 

const app= express();

app.get("/",(req, res)=>{
    res.send("<h1> Hello World! </h1>")
})
app.listen(3000,()=>{
    console.log("App is listening at 3000 port");
})