const express = require('express')
const fs = require("fs").promises //to interacting with the json file //promises for retriv read and write operation
const path = require('path') //used to create path

const app = express()
const dataFile = path.join(__dirname,"data.json");

//support posting form data with urlencoded
app.use(express.urlencoded({extended:true}))

app.get('/poll',async(req,res)=>{

    let data = JSON.parse(await fs.readFile(dataFile,"utf-8"))
    const totalVots = Object.values(data).reduce((cv,pv)=>cv+=pv,0)

    data = Object.entries(data).map(([label,vots])=>{
        return {
            label,
            percentage:(((100*vots)/totalVots) || 0).toFixed(0)
        }
    })
    res.json(data)
})



app.post('/poll',async(req,res)=>{
    const data = JSON.parse(await fs.readFile(dataFile,"utf-8"))
    data[req.body.add]++; 
    await fs.writeFile(dataFile,JSON.stringify(data)) 
    res.end()
})

 app.listen(3000,()=>console.log('server is running...'))