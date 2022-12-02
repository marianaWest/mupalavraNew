// this is to create a model for the DB, but I don't want this to be open to all viewers


const mongoose = require('mongoose');
const termoSchema = new mongoose.Schema({
    termo: {
        type: String,
        required: true
    },
    descricao: {
        type: String, 
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    }
}  
)

module.exports = mongoose.model('TermoMupalavra', termoSchema, 'mupaTermos')