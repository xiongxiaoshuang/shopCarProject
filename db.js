const mongodb=require("mongodb");
const url="mongodb://localhost:27017";
const MongoClient=mongodb.MongoClient;
const ObjectId=mongodb.ObjectId;

function Db(name) {
    this.dbName=name;
    this.connect=function (callback) {
        MongoClient.connect(url,{ useNewUrlParser: true },(err,db)=>{
            if(err){throw err}
            else{
                var dbase=db.db(this.dbName);
                callback(dbase)
            }
        })
    }
}

Db.prototype={
    constructor:Db,
    insertOne(collection_name,data,backFn){
        this.connect((dbase)=>{
            dbase.collection(collection_name).insertOne(data,backFn)
        })
    },
    insertMany(collection_name,data,backFn){
        this.connect((dbase)=>{
            dbase.collection(collection_name,data,backFn)
        })
    },
    deleteOne(collection_name,query,backFn){
        this.connect((dbase)=>{
            dbase.collection(collection_name).deleteOne(query,backFn)
        })
    },
    deleteMany(collection_name,query,backFn){
        this.connect((dbase)=>{
            dbase.collection(collection_name).deleteMany(query,backFn)
        })
    },
    deleteById(collection_name,id,backFn){
        this.connect((dbase)=>{
            dbase.collection(collection_name).deleteOne({_id:ObjectId(id)},backFn)
        })
    },
    updateOne(collection_name,query,data,backFn){
        this.connect((dbase)=>{
            dbase.collection(collection_name).updateOne(query,{$set:data},backFn)
        })
    },
    updateMany(collection_name,query,data,backFn){
        this.connect((dbase)=>{
            dbase.collection(collection_name).updateMany(query,{$set:data},backFn)
        })
    },
    updataById(collection_name,id,data,backFn){
        this.connect((dbase)=>{
            dbase.collection(collection_name).updateOne({_id:ObjectId(id)},{$set:data},backFn)
        })
    },
    find(collection_name,obj,backFn){
        obj.query=obj.query||{};
        obj.limit=obj.limit||0;
        obj.skip=obj.skip||0;
        this.connect((dbase)=>{
            dbase.collection(collection_name).find(obj.query).skip(obj.skip).limit(obj.limit).toArray(backFn)
        })
    },
    findById(collection_name,id,backFn){
        this.connect((dbase)=>{
            dbase.collection(collection_name).find({_id:ObjectId(id)}).toArray(function (err,data) {
                backFn(err,data[0])
            })
        })
    },
    count(collection_name,query,backFn){
        this.connect((dbase)=>{
            dbase.collection(collection_name).count(query,backFn)
        })
    }
}

module.exports=Db;