import conexaoHttp from 'express';
import pool from '../pool.js';

const rotas = conexaoHttp.Router();

//End point que retorna os valores do banco de dados
rotas.get("/EmissaoCarro", (req, res, error)=>{
    const sql = 'select * from EmissaoCarro';

    pool.query(sql, (error, results, fields)=>{
        
        mensagens(error, results, res);
    })
});

//End point por um id especifico
rotas.get("/EmissaoCarro/:id", (req, res, error)=>{
    const sql = 'SELECT * FROM EmissaoCarro WHERE EmissaoCarro.id=' + req.params.id;
    
    pool.query(sql, (error, results,fields)=>{
        
        mensagens(error, results, res);

    })
})
//End point pelo modelo 
rotas.get("/EmissaoCarro/EmissaoCarro/:modelo", (req, res, error)=>{
    const sql = 'SELECT * FROM EmissaoCarro WHERE EmissaoCarro.modelo=?';
    const modelo = req.params.modelo;

    pool.query(sql, [modelo], (error, results, fields)=>{
        mensagens(error, results, res);
    })
});

//End point onde o valor a ser inserido no banco de dados ja passa pelo calculo
rotas.post("/EmissaoCarro", (req, res, error)=>{
    const {modelo, ano, litros} = req.body;
    
    let carbono = calculoGasolina(litros);
    const sql = 'insert into EmissaoCarro(modelo, ano, litros, carbono)' +'values (?,?,?,' + carbono +')';
    
    pool.query(sql, [modelo, ano, litros, carbono], (error, results, fields)=>{
        
        mensagens(error, results, res);
    })
});


rotas.put("/EmissaoCarro", (req, res, error)=>{
    const {modelo, ano, litros, id} = req.body;
    let conta = calculoGasolina(litros);

    const sql = 'UPDATE EmissaoCarro SET modelo=?, ano=?, litros=?, carbono='+ conta + 'WHERE id=?'
    

    pool.query(sql, [modelo, ano, litros, id], (error, results, fields)=>{
        
        mensagens(error, results, res);
    })

});

rotas.put("/EmissaoCarro/id/:id", (req, res, error)=>{
    const {modelo, ano, litros} = req.body;
    const id = req.params.id;
    let conta = calculoGasolina(litros);
    
    const sql = 'UPDATE EmissaoCarro SET  modelo=?, ano=?, litros=?, carbono= '+ conta +'  WHERE id=?';
    

    pool.query(sql, [modelo, ano, litros, id], (error, results, fields)=>{
        
        mensagens(error, results, res);
    });

});

rotas.delete("/EmissaoCarro/:id", (req, res, error)=>{
    const sql = 'DELETE  FROM emissao WHERE EmissaoCarro.id= ' + req.params.id;
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
function calculoGasolina(x){
            //0.82 = relação etanol/gasolina presente na gasolina
            //0.75 = Densidade de gasolina
            //3.7  = Fator de transformação da gasolina em CO2
   
    let result = x * 0.82 * 0.75 * 3.7;
    return result;
    
}


export default rotas;