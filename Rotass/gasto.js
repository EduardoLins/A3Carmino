//CRUD gasto de combustrivel em reais 



import conexaoHttp from 'express';
import pool from '../pool.js';

const rotas = conexaoHttp.Router();

rotas.get("/gastoMensal", (req, res, error)=>{
    const sql = 'select * from gastoMensal';

    pool.query(sql, (error, results, fields)=>{
        mensagens(error, results, res);
    })
});

//End point retornando o valor gasto total em combustivel
rotas.get("/gastoMensal/:total", (req, res, error)=>{
    const sql = 'select sum (total) from gastoMensal'
    
    pool.query(sql, (error, results, fields)=>{
        console.log(sql);
        mensagens(error, results, res);
    })
})

rotas.post("/gastoMensal", (req, res, error)=>{
    const {taxaConsumo, preco, km} = req.body;
    let  total = gastoCombustivel(taxaConsumo, preco, km);

    const sql = 'INSERT INTO gastoMensal(taxaConsumo, preco, km, total)' + 'VALUES (?,?,?,' + total+')';
    pool.query(sql, [taxaConsumo, preco, km, total], (error, results, fields)=>{
        
        mensagens(error, results, res);
    })
});
rotas.put("/gastoMensal", (req, res, error)=>{
    const {taxaConsumo, preco, km, id} = req.body;
    let conta = gastoCombustivel(taxaConsumo, preco, km);

    const sql = 'UPDATE gastoMensal SET taxaConsumo=?, preco=?, km=?, total='+ conta + 'WHERE id=?'
    

    pool.query(sql, [taxaConsumo, preco, km, id], (error, results, fields)=>{
        
        mensagens(error, results, res);
    })

});

rotas.put("/gastoMensal/id/:id", (req, res, error)=>{
    const {taxaConsumo, preco, km} = req.body;
    const id = req.params.id;
    let conta = gastoCombustivel(taxaConsumo, preco, km);
    
    const sql = 'UPDATE gastoMensal SET  taxaConsumo=?, preco=?, km=?, total= '+ conta +'  WHERE id=?';
    

    pool.query(sql, [taxaConsumo, preco, km, id], (error, results, fields)=>{
        
        mensagens(error, results, res);
    });

});
rotas.delete("/gastoMensal/:id", (req, res, error)=>{
    const sql = 'DELETE  FROM emissao WHERE gastoMensal.id= ' + req.params.id;
    //const {id}= req.params.id;

    pool.query(sql,  (error, results, fields)=>{
        
        mensagens(error, results, res);
    });
});


function mensagens(error, results, res){
    if(!error){
        res.status(200).json(results);
    }else{
        console.log(error);
        res.status(404).json({msg : error});
    }
};

function gastoCombustivel(x,y,z){

    let resultado = (x/y)*z;
    return resultado;
}

export default rotas;