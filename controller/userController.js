import express from "express";
import mongoist from "mongoist";
import mongojs from "mongojs";
const router = express.Router();
//import pool from "../config/dbpool";
//import mongojs from "../config/mongodb";
const databaseUrl =
  "mongodb://angularku1:angularku1@ds061464.mlab.com:61464/mynote";
const mongojsDb = mongojs(databaseUrl);
const db = mongoist(mongojsDb);

/*
Request
* id : "5721602287"
* */
router.get("/getDetail", async (req, res) => {
  let userDetail = await db.user_detail.find({ id: req.query.id });
  let noteDetail = await db.note_detail.find({ id: req.query.id });
  res.send({ user: userDetail, noteDetail: noteDetail });
});
/*
    Request
* id : "5721602287"
* name : "student name"
* */
router.post("/createProfile", async (req, res) => {
  let data = await db.user_detail.find({ id: req.body.id });
  if (data.length > 0) {
    res.send({ status: true, user: data });
  } else {
    let user = {
      id: req.body.id,
      name: req.body.name
    };

    let note_type = [
      {
        id: 1,
        name: "ดนตรี",
        list: [
          {
            id: 1,
            detail: "ข้อมูลทดสอบ",
            priority: 10
          }
        ]
      },
      {
        id: 2,
        name: "การเรียน",
        list: []
      },
      {
        id: 3,
        name: "ท่องเที่ยว",
        list: []
      }
    ];

    let obj = {
      id: user.id,
      note_type: note_type
    };

    let result = await db.user_detail.insert(user);
    let result2 = await db.note_detail.insert(obj);
    res.send({ info: result, info2: result2 });
  }
});

/*
    Request
* id : "5721602287"
* noteId : 1
* name : "new name"
* */
router.post("/updateNoteName", async (req, res) => {
  let info = await db.note_detail.update(
    { id: req.body.id, note_type: { $elemMatch: { id: req.body.noteId } } } , //เป็นการหา Index
    { $set: { "note_type.$.name": req.body.name } } //index และ key ที่ต้องการให้เปลี่ยน
  );
  if (info.nModified == 1) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});

/*
    Request
* id : "5721602287"
* noteId : 1
* listId : 1
* listDetail : "detail"
* priority : 12
* */
router.post("/updateNoteDetail", async (req, res) => {
  let detail = {
    id: req.body.listId,
    detail: req.body.listDetail,
    priority: req.body.priority
  };
  let data = await db.note_detail.find({ id: req.body.id });
  let indexNote = -1;
  data[0].note_type.forEach((f, index) => { if (f.id == req.body.noteId) indexNote = index; });
  let key = 'note_type.' + indexNote + '.list.$';
  let info = await db.note_detail.update(
    {
      id: req.body.id,
      "note_type.id": req.body.noteId,
      "note_type.list.id": req.body.listId
    },
    {
      $set: { [key]: detail }
    }
  );
  res.send(info);
});

/*
    Request
* id : "5721602287"
* noteId : 1
* noteName : "noteName"
* */
router.post("/insertNote", async (req, res) => {
  let result = await db.note_detail.update(
    { id: req.body.id },
    {
      $push: {
        note_type: {
          noteid: req.body.noteId,
          name: req.body.noteName,
          list: []
        }
      }
    }
  );
  res.send(result[0]);
});

module.exports = router;
