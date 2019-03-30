import express from "express";
const router = express.Router();
/*
Request
* */
let responseObject = {
    msg: "",
    result: ""
}

router.get("/getData",  (req, res) => {
    let result = req.query.key1 * req.query.key2;
    res.send({ result: result })
});
/*
Request
* */
router.post("/postData",async  (req, res) => {
    if(!req.body.key5){
        responseObject.msg = "Bad request";
    }else{
        responseObject.msg = "success";
        responseObject.result = req.body.key * 5;
    }
    res.send(responseObject);
});
module.exports = router;
