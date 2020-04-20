const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/moment",{useNewUrlParser: true});

var testSchema = mongoose.Schema({time: Date});

var test = mongoose.model("test", testSchema);

var re = test.findOne().exec((err, re) => {console.log(re.time.getHours());});
