const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const patientRoutes=require('./routes/patientRoutes');
const doctorRoutes=require('./routes/doctorRoutes');
const receptionistRoutes=require('./routes/receptionistRoutes');
const appointmentRoutes=require('./routes/appointmentRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoute');
const scheduleRouter=require('./routes/scheduleRoutes');

dotenv.config();

const app=express();
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/receptionists', receptionistRoutes);
app.use('/api/appointments', appointmentRoutes)
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/schedule', scheduleRouter)


mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server running on port ${process.env.PORT}`)
    })
})
.catch((err)=>console.error(err));
