import conexaoHttp from 'express';
import login from './Rotass/login.js';
import emissao from './Rotass/emissao.js';
import gasto from './Rotass/gasto.js';


import pool from './pool.js';


const app = conexaoHttp();

app.use(conexaoHttp.json());
//Carregando os servidores
app.use(login);
app.use(emissao);
app.use(gasto);


const port = 4003;

app.listen(port, ()=>{
    console.log("Está ativo na porta", port);
});