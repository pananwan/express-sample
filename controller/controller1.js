import express from "express";
import mongoist from "mongoist"
import mongojs from "mongojs"

const router = express.Router();
//import pool from "../config/dbpool";
// import mongojs from "../config/mongodb";
const databaseUrl = 'mongodb://angularku1:angularku1@ds061464.mlab.com:61464/mynote';
const mongojsDb = mongojs(databaseUrl);
const db = mongoist(mongojsDb);
const db2 = mongojs.connect;

router.get("/", async (req, res) => {
    /* let data = await db2.user_detail.find({id: "5721602287"}, function (err, docs) {
          res.send(docs);
      });*/
    let data = await db.user_detail.find({id: "5721602287"});
    res.send(data)
});

router.post("/createProfile", async (req, res) => {
    let user = {
        id: req.body.id,
        name: req.body.name
    }
    let note_type = [
        {
            "id": 1,
            "name": "ดนตรี",
            "list": [{
                "id": 1,
                "detail": "ข้อมูลทดสอบ",
                "priority": 10
            }]
        },
        {
            "id": 2,
            "name": "การเรียน",
            "list": []
        },
        {
            "id": 3,
            "name": "ท่องเที่ยว",
            "list": []
        }
    ];
    let obj = {
        id: user.id,
        note_type: note_type
    }
    let result = await db.user_detail.insert(user);
    let result2 = await db.note_detail.insert(obj);
    res.send({info: result, info2: result2})
});

/*
    Request
* id : "5721602287"
* noteId : 1
* name : "new name"
* */
router.post("/updateNoteName", async (req, res) => {
    let info = await db.note_detail.update(
        {id: req.body.id, note_type: {$elemMatch: {noteid: req.body.noteId}}},
        {$set: {'note_type.$.name': req.body.name}}
    );
    if (info.nModified == 1) {
        res.send({success: true});
    } else {
        res.send({success: false});
    }
});

/*
    Request
* id : "5721602287"
* noteId : 1
* listId : 1
* listDetail : "detail"
* */

router.post("/updateNoteDetail", async (req, res) => {
    /*console.log(req.body);
    let info = await db.note_detail.find();
    console.log(info);*/
    let detail = {
        id: req.body.listId,
        detail: req.body.detail,
        priority: req.body.priority,
    };

    let info = await db.note_detail.update(
        {
            id: req.body.id,
            note_type: {$elemMatch: {noteid: req.body.noteId}},
            //'note_type.$.list': {$elemMatch: {id: req.body.listId,$elemMatch:{}}}
        },
        {$set: {'note_type.$.list.$[j].detail': 'Tests'}},
        //{$set: {'note_type.$.list.$[i]': detail}},
        {arrayFilters: [{'j.id': req.body.listId}]}
    );

    res.send(info);
    // let result = await
});

//db.coll.update({}, {$set: {“a.$[i].c.$[j].d”: 2}}, {arrayFilters: [{“i.b”: 0}, {“j.d”: 0}]})
let Input = {
    a:
        [
            {
                b: 0,
                c:
                    [
                        {d: 0},
                        {d: 1}]
            },
            {
                b: 1, c:
                    [{d: 0},
                        {d: 1}]
            }]
}
router.post("/insertNote", async (req, res) => {
    let result = await db.note_detail.update({id: req.body.id + ''},
        {$push: {'note_type': {noteid: req.body.noteId, name: req.body.noteName, list: []}}});
    res.send(result[0])
});

module.exports = router;