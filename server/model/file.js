const  mongoose  = require("mongoose")

const schema = new mongoose.Schema({
    image:String
})
module.exports = mongoose.model('img',schema)
