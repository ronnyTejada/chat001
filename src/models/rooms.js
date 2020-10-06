const mongoose = require('mongoose')
const {Schema} = mongoose;

const RoomsSchema = new Schema({
    id: {type:String, required:true},
    name:{type: String},
    participants: {type: Object, required: true},
    messages:{type: Object, required:true}



    
})

module.exports = mongoose.model('Rooms', RoomsSchema);