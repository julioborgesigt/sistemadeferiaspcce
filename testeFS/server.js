
const http = require('http');
const fs = require('fs');
const porta = process.env.PORT


const server = http.createServer((req,res)=>{
    fs.appendFile('text.txt', 'curso nodes',(err)=>{
                if(err)throw err
        console.log('arquivo criado')
        return res.end()
    })

})



server.listen(porta || 3000,()=>{console.log('servidor rodando')

})