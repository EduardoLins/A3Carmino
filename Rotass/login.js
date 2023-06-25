import conexaoHttp from 'express'; // conexao com o hhtp
import pool from '../pool.js';

const rotas = conexaoHttp.Router();

rotas.get("/login", (req, res, error)=>{
    const sql = 'select * from login';

    pool.query(sql, (error, results, fields)=>{
        mensagens(error, results, res);
    })
});


rotas.get("/login/:id", (req, res, error)=>{
    const sql = 'SELECT * FROM login WHERE login.id=' + req.params.id;

    pool.query(sql, (error, results,fields)=>{
        mensagens(error, results, res);
    })
});

rotas.get("/login/email/:email", (req, res, error)=>{
    const sql = 'SELECT * FROM login WHERE login.email=?';
    const email = req.params.email;

    pool.query(sql, [email], (error, results, fields)=>{
        mensagens(error, results, res);
    })
});

rotas.post("/login", (req, res, error)=>{
    const sql = 'INSERT INTO login(email, senha, nome, cpf, data)' + 'VALUES (?,?,?,?,?)';
    const {email, senha, nome, cpf, data} = req.body;
    

    pool.query(sql, [email, senha,nome, cpf, data], (error, results, fields)=>{
        
        mensagens(error, results, res);
    })
});

rotas.put("/login", (req, res, error)=>{
    const sql = 'UPDATE login SET email=?, senha=?, nome=?, cpf=?, data=? WHERE id=?'
    const {email, senha, nome, cpf, data, id} = req.body;

    pool.query(sql, [email, senha, nome, cpf, data, id], (error, results, fields)=>{
        
        mensagens(error, results, res);
    })

});

rotas.put("/login/id/:id", (req, res, error)=>{
    const sql = 'UPDATE login SET  email=?, senha=?, nome=?, cpf=?, data=? WHERE id=?';
    const {email, senha, nome, cpf, data} = req.body;
    const {id} = req.params.id;

    pool.query(sql, [ email, senha, nome, cpf, data, id], (error, results, fields)=>{
        
        mensagens(error, results, res);
    });

});

rotas.delete("/login/:id", (req, res, error)=>{
    const sql = 'DELETE  FROM login WHERE login.id= ' + req.params.id;
    //const {id}= req.params.id;

    pool.query(sql,  (error, results, fields)=>{
        console.log(fields);
        mensagens(error, results, res);
    });
})

function mensagens(error, results, res){
    if(!error){
        res.status(200).json(results);
    }else{
        console.log(error);
        res.status(404).json({msg : error});
    }
}

export default rotas;