let express = require('express');
let router = express.Router();
let bodyParser=require('body-parser');
let jsonParser=bodyParser.json();

let docModel = require('../models/mongo');


router.get('/file/:id',(req,res)=>{

    let id = req.params.id;

    docModel.findOne({'id':id}, (err,docs)=> {
        if (err) {
            console.log(err);
        }
        else {
            res.json(docs);
        }
    });
});

router.get('/filelist/:uid',(req,res)=>{

    let uid = req.params.uid;

    docModel.find({'uid':uid}, 'name id' , (err,docs)=> {
        if (err) {
            console.log(err);
        }
        else {
            res.json(docs);
        }
    });
});


router.post('/savefile',jsonParser,(req,res)=>{

    let file = req.body;

    docModel.findOne({name:file.name, author:file.author, uid:file.uid}, (err,content)=>{

         if (content) {
                content.content = file.content;
                content.save();
                res.json(content)
         }
         else {
             docModel.count({}, (err,num)=>{
                 file.id=num+1;
                 let newFile = new docModel(file);
                 newFile.save();
                 res.json(newFile)
             });
         }
    });
});

router.delete('/deletefile/:uid/:name',(req,res)=>{

    let uid = req.params.uid;
    let name = req.params.name;

    docModel.findOne({'uid':uid, 'name': name}, (err,docs)=> {
        if (err) {
            console.log(err);
        }
        else {
            res.json(docs);
            docs.remove();
        }
    });
});

module.exports = router;
