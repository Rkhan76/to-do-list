import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

//Connection
mongoose
.connect("mongodb://127.0.0.1:27017/to-Do-List")
.then(()=> console.log("MongoDB Connected"))
.catch((err) => console.log("Mongo Error", err));

// Schema
const taskSchema = new mongoose.Schema({
    task:{
        type: String,
        required: true,
    }
  },
  { timestamps: true}
);

//Model
const Task = mongoose.model("task", taskSchema);
const MonthlyTask = mongoose.model("monthlyTask", taskSchema);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// home page
app.get("/", async(req, res)=>{

    try {
        const list = await Task.find({});
        res.render('index.ejs', { taskArray : list });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
});


// today
app.get("/today",(req, res)=>{
   res.redirect("/")
});


// get request for month work list
app.get("/work",async (req, res)=>{

    try {
        const list = await MonthlyTask.find({});
        res.render('work.ejs', { taskArray : list });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

// task submission
app.post("/submit", async (req, res)=>{

    const source = req.body.source;     // source from where post request is made
    const todaytask = req.body.todayList; 
     
        try {
            if (source === "today"){
            if(todaytask !== ""){
                const result =  await Task.create({
                    task: todaytask,
                });
    
                console.log("submitted successfully at today page");
                res.redirect("/today");
             }
            }

             if (source === "month"){
                if(todaytask !== ""){
                    const result =  await MonthlyTask.create({
                        task: todaytask,
                    });

                    console.log("submitted successfully at work page");
                    res.redirect("/work");
                 }
            }
            
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }

    });


// handling deletion
app.post("/delete", async (req, res)=>{
    const checkItemId = req.body.checkbox;
    const source = req.body.listName;

    try {
        if(source === "today"){
            await Task.findOneAndRemove(checkItemId);
            console.log("successfully deleted form todays page");
            res.redirect("/today");
        }

        if(source === "month"){
            await MonthlyTask.findOneAndRemove(checkItemId);
            console.log("successfully deleted form todays page");
            res.redirect("/work");
        }
    } catch (error) {
        res.status(404).json({ error: 'File not found' });
    }
        
});

 // listening port
app.listen(port, ()=>{
    console.log(`server is running on port ${port}.`);
});



