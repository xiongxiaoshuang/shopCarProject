var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var dbPlugin=require("./db");
var db=new dbPlugin("mydb1807")

var postParser=bodyParser.urlencoded({extended:false});

app.listen(80,()=>{
    console.log("80 服务开启")
})

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    next();
})

//获取数据
app.get("/getData",(req,res)=>{
    var obj=req.query;
    db.find("goods",obj,(err,data)=>{
        if(err)throw err;
        // console.log(data);
        res.send(data);
    })
})
//购物车通过id查找数据
app.post("/addData",postParser,function (req, res) {
    var data=req.body;
    db.find("shop",{query:{id:data.id}},(err,data1)=>{
        if(err)throw err;
           if(data1.length==0){
               db.insertOne("shop",data,(err,data2)=>{
                   if(err)throw err;
                   res.send("add ok")
               })
           }else{
              db.find("shop",{query:{id:data.id}},(err,data3)=>{
                  console.log(data3);
                  data3[0].num=data.num*1+data3[0].num*1;
                  db.updateOne("shop",{id:data.id},{num:data3[0].num},(err,data4)=>{
                      res.send("update ok");
                  })
              })
           }
    })
})
//购物车获取数据
app.get("/getData1",function (req, res) {
    var data=req.query;
    db.find("shop",data,(err,data1)=>{
        if(err)throw err;
        res.send(data1);
    })
})
