const express = require('express')
const router = express.Router()

const Rooms = require('../models/rooms')

var fullUrl = '' 

router.get('/', async (req, res) => {
    const rooms =  await Rooms.find()
    fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl)
    res.json(rooms)
})
router.get('/:id', async (req, res) => {
    const room =  await Rooms.findById(req.params.id)
    
    res.json(room)
})
router.post('/', async(req, res)=>{
    const {name, participants, messages} = req.body
    const rooms = new Rooms({
        name,
        participants,
        messages
    })
    await rooms.save()
    console.log({status: 'User saved'});
})
router.put('/:id', async(req, res)=>{
    const  {type, author, data} = req.body
    const msj = {type, author, data};

    let  room = await Rooms.findById(req.params.id)
    room.messages = [...room.messages, msj]
    await room.save()
    console.log({status: 'Message Saved'});

})
module.exports = router;
exports.fullUrl = fullUrl
