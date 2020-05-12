var moment = require("moment");

var test = moment("2020-05-11T13:00:15.092Z");

var out = test.locale('vi').fromNow();

console.log(out);