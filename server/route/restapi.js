let express = require('express');
let router = express.Router();
let bodyParser=require('body-parser');
let jsonParser=bodyParser.json();


router.get('/filelist',(req,res)=>{

    problemService.getProblems()
        .then( p=>res.json(p) );
});

router.get('/content',(req,res)=>{

    problemService.getProblems()
        .then( p=>res.json(p) );
});

router.post('/savefile',jsonParser,(req,res)=>{

    problemService.addProblem(req.body)
        .then( p=>res.json(p), ()=>res.send('error in adding new proble'));
});

module.exports = router;
