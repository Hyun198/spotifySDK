const express = require('express');
require('dotenv')

const app= express();

app.use(express.json());


app.get('/', (req,res)=> {
    res.send("hello from server");
})

app.listen(5000, ()=> {
    console.log('server is runnning on 5000 port');
})