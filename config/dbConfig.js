const dbConfig = () =>{
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/taskmanager')
    .then(() =>  console.log(`MongoDB Connected `))
    .catch((err) => console.error(err));
}
module.exports = dbConfig