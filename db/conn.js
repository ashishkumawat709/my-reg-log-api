const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/FILES')
.then(()=>{
    console.log('connected');
})
.catch((error)=>{
    console.log(error);
})

module.exports = mongoose