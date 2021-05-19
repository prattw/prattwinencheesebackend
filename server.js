require("dotenv").config()
const { PORT = 3000, MONGODB_URL } = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
// middleware
const cors = require("cors")
const morgan = require("morgan")

// connect
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection
.on("open", () => console.log("Green Light GO!"))
.on("close", () => console.log("Red Light NOGO"))
.on("error", (error) => console.log(error))

// models
const CheesesSchema = new mongoose.Schema({
    name: String,
    image: String,
    maker: String
})

const Cheeses = mongoose.model("Cheese", CheesesSchema)

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Airborne!")
});

app.get("/cheeses", async (req, res) => {
    try{
        res.json(await Cheeses.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

// cheese create route
app.post("/cheeses", async (req, res) => {
    try{
        res.json(await Cheeses.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});

// cheese update route
app.put("/cheeses/:id", async (req, res) => {
    try {
        res.json(await Cheeses.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
});

// delete
app.delete("/cheeses/:id", async (req, res) => {
    try {
        res.json(await Cheeses.findByIdAndRemove(req.params.id, req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});

app.listen(PORT, () => console.log("ALL THE WAY!"))

// more to commit