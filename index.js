import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const today = [];
const work = [];
let i=0, j=0;



app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// get request for home page
app.get("/",(req, res)=>{
    if(today.length===0){
        res.render("index.ejs");
    }else{
        res.render("index.ejs", {todaywork: today});
    }
    
});


// get request for today work list
app.get("/today",(req, res)=>{
   res.redirect("/")
});


// get request for month work list
app.get("/work",(req, res)=>{
    if(work.length===0){
        res.render("work.ejs");
    }else{
        res.render("work.ejs", {todaywork: work});
    }
});

// post request for adding the daily task and monthly task to array
app.post("/submit", (req, res)=>{

    // to check the source of the file from where post request is made
    const source = req.body.source;
    
    if (source === "today") {
        if(req.body !== ""){
            today[i] = req.body["todayList"];
            i++;
        }
    
        res.redirect("/today");
    } else if (source === "month") {
        if(req.body !== ""){
            work[j] = req.body["monthlyList"];
            j++;
        }
    
        res.redirect("/work");
    }
    
    
});


app.listen(port, ()=>{
    console.log(`server is running on port ${port}.`);
});



