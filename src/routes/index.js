const express = require('express');
const pool = require('../config/db');
const router = express.Router();



router.get("/", (req, res)=>{
    res.send("Hello !");
});

router.get("/test-db", async(req, res)=>{
    try{
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
        console.log("DB connected");
    }catch(err){
        console.error(err);
        res.status(500).send("Database error");
    }
});

module.exports=router;
