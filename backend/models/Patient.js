const mongoose=require('mongoose');
const patientSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        required: true,
    },
    dob:{
        type: Date,
        required: true,
    },
    gender:{
        type: String, 
        enum:['Male', 'Female', 'Others'],
        required: true,
    },
    email:{
        type: String, 
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    }
}, {timestamps: true});


const Patient=mongoose.model('Patient', patientSchema);

module.exports=Patient;