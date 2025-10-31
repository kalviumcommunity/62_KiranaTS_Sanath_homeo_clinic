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
    },
    picture: {
        type: String,
        required: true, 
    },
    googleId: { type: String, unique: true, sparse: true },
    relationship_type: {
        type: String,
        enum: ['self', 'parent', 'child', 'sibling', 'spouse', 'grandparent', 'grandchild', 'other'],
        default: 'self'
    },
    family_code: { type: String, default: null }
}, {timestamps: true});


const Patient=mongoose.model('Patient', patientSchema);

module.exports=Patient;