
# 62_KiranaTS_Sanath_homeo_clinic

## Project Idea & Description

Sanath Homeo Clinic is a website designed for managing Sanath Homeo Clinics and its simple interface makes the Doctor's job easy. This platform helps with interactions between both doctors and patients. Patients can book appointments, receive personalized medicine reminders either via WhatsApp or the calendar(their choice), and also give their feedback on their clinic and website experience. Doctors are capable of managing their schedule, holidays, and appointments through a dashboard, while the reception is exclusively dealing with all the bookings and schedules. With the help of a platform, one can also have connections with Google Calendar to assist the process and the users.



## Features  
- Doctor's calendar with holiday and clinic timing adjustments.  
- Patient-receptionist communication for efficient appointment scheduling.  
- Google Calendar integration for syncing appointments and dosage reminders.  
- Personalized notifications for patients based on prescribed medicines.  
- Patient logs and feedback/review system visible on the homepage.  
- Ability for doctors and patients to cancel appointments easily.  


## PROJECT OVERVIEW

**Database:** MongoDB with Mongoose  
To store user details, appointments, prescriptions, and reminders.  
Includes schema relationships between users and appointments for efficient data retrieval and manipulation.

**Backend:** Node.js with Express.js  
To serve API endpoints for authentication, scheduling, prescriptions, and role-based data access.  
Including middlewares for JWT authentication and route protection.

**Frontend:** React.js with TailwindCSS  
Responsive UI with dedicated dashboards for each role.  
Patients can book appointments, view prescriptions, and receive reminders.  
Doctors can manage appointments, upload prescriptions, and view patient history.  
Receptionists can oversee and manage all clinic appointments.

**Login Functionality:**  
- JWT-based login for secure authentication  
- Google Auth for third-party login support

**Dashboards:**  
- **Patient dashboard:** view and manage appointments, prescriptions, and medicine reminders  
- **Doctor dashboard:** view patients, upload prescriptions, and manage schedules  
- **Receptionist dashboard:** manage clinic-wide appointments and coordinate patient flow

**APIs Used:**  
- Google Calendar API for appointment scheduling  
- WhatsApp API for sending reminders and confirmations

**File Uploads:**  
User image uploads to store details

**Authentication & Authorization:**  
Role-based access control using JWT tokens

**Deployment:**  
- Frontend hosted on Vercel/Netlify
- Backend hosted on Render





## PROJECT JOURNEY

### **1. Project Setup**
- Setting up a GitHub project  
- Manage all daily tasks and project milestone progress via GitHub Projects

---

### **2. Backend Setup**
- Initializing Express backend.  
- Creating basic routes and structure.  
- Set up MongoDB connection and define initial schema (Patient, Appointment, Doctor).  
- Test GET and POST APIs using Bruno.  
- Deploy backend server.

---

### **3. Frontend Initialization**
- Initializing React app.  
- Creating basic routes and folder structure.  
- Building patient-facing components: homepage, appointment booking form.  
- Connecting booking form to backend.

---

### **4. Doctor Dashboard**
- Building doctor login (simple password auth).  
- Implementing dashboard for viewing and editing schedule.  
- Allow blocking time slots and syncing to Google Calendar.  
- PUT API for schedule changes.

---

### **5. Appointment & Calendar Integration**
- Sync booked appointments with Google Calendar.  
- Displaying blocked/unavailable time slots.  
- Ensuring real-time updates to avoid conflicts.  
- To store appointments in DB.

---

### **6. Admin & Receptionist Interface**
- Interface to view all appointments.  
- Ability to update/delete bookings.  
- Prevent overlapping bookings.  
- View and manage doctor schedules.

**To be done**
- Using JWTs in application  
- PUT & DELETE APIs from frontend

---

### **7. Medicine Reminder System**
- Creating form for doctors to prescribe medicine.  
- Store schedule and instructions in DB.  
- Integrate WhatsApp API to send reminders at set times.

**Concepts Covered:**
- Implemented file upload functionality in the application  
- PUT API used  
- POST API used

---

### **8. Feedback System**
- After appointment, allow patients to rate doctor and leave feedback.  
- Store and display reviews on homepage.  
- Admin can moderate feedback.

**Concepts Covered:**
- Created frontend components in React  
- Database read and write performed

---

### **9. Bruno + Auth**
- Add Bruno collection for all endpoints.  
- Add login for doctor and receptionist (JWT based).  
- Test all APIs using Bruno.

---

### **10. Finalization**
- Complete styling and polish UI.  
- Deploy frontend on Vercel/Netlify.  
- Ensure backend and frontend are connected.
