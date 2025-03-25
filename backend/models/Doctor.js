const mongoose=require('mongoose');

const doctorSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    availableSlots:{
        type: Map,
        of:[
            {
                start:{
                    type: String,
                    required: true,
                },
                end:{
                    type: String,
                    required: true,
                }
            }
        ],
        default: () => new Map([
            ['Monday', []],
            ['Tuesday', []],
            ['Wednesday', []],
            ['Thursday', []],
            ['Friday', []],
            ['Saturday', []]
          ])
    },
    holidays:{
        type:[Date],
        default:[],
    },
    blockedSlots:{
        type: Map,
        of:[
            {
                date: { type: Date, required: true },
                start: { type: String, required: true },
                end: { type: String, required: true }
            }
        ],
        default:()=> new Map()
    }
})

const Doctor=mongoose.model('Doctor', doctorSchema);
module.exports=Doctor;