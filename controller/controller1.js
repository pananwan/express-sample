import express from "express";
const router = express.Router();
import pool from "../config/dbpool";
router.get("/",async (req,res)=>{
    let sql = 'select * from user';
    let result = await pool.query(sql);
    res.send(result);
});


module.exports = router;