/* MediPulse Local Data Store & Mock Database Manager */

const INITIAL_DATA = {
  patients: [
    {
      id: "PAT-1001",
      name: "Rahul Sharma",
      age: 34,
      gender: "Male",
      bloodGroup: "O+",
      phone: "+91 98765 43210",
      emergencyContact: "+91 98765 00000",
      address: "B-402, Green Valley Apts, Sector 14",
      notes: "Hypertension, allergic to Penicillin",
      regDate: "2026-09-10"
    },
    {
      id: "PAT-1002",
      name: "Priya Patel",
      age: 28,
      gender: "Female",
      bloodGroup: "B+",
      phone: "+91 98123 45678",
      emergencyContact: "+91 98123 99999",
      address: "12/A Sunshine Enclave, MG Road",
      notes: "Asthma, routine prenatal check-ups",
      regDate: "2026-09-15"
    },
    {
      id: "PAT-1003",
      name: "Amit Kumar",
      age: 45,
      gender: "Male",
      bloodGroup: "A-",
      phone: "+91 99887 76655",
      emergencyContact: "+91 99887 11111",
      address: "Flat 304, Royal Heights",
      notes: "Type 2 Diabetes, regular blood sugar monitoring",
      regDate: "2026-09-20"
    },
    {
      id: "PAT-1004",
      name: "Ananya Deshmukh",
      age: 19,
      gender: "Female",
      bloodGroup: "AB+",
      phone: "+91 97654 32109",
      emergencyContact: "+91 97654 00000",
      address: "Hostel 4, Tech Campus",
      notes: "Mild anemia, dietary consultation",
      regDate: "2026-09-22"
    }
  ],
  appointments: [
    {
      id: "APT-501",
      patientId: "PAT-1001",
      patientName: "Rahul Sharma",
      phone: "+91 98765 43210",
      doctor: "Dr. Vikram Seth (General Physician)",
      date: "2026-09-27",
      time: "10:30 AM",
      type: "Follow-up",
      reason: "BP check & prescription renewal",
      status: "Scheduled",
      token: "T-01"
    },
    {
      id: "APT-502",
      patientId: "PAT-1002",
      patientName: "Priya Patel",
      phone: "+91 98123 45678",
      doctor: "Dr. Sunita Rao (Gynecologist)",
      date: "2026-09-27",
      time: "11:15 AM",
      type: "Routine Checkup",
      reason: "Monthly prenatal scan review",
      status: "Checked-In",
      token: "T-02"
    },
    {
      id: "APT-503",
      patientId: "PAT-1003",
      patientName: "Amit Kumar",
      phone: "+91 99887 76655",
      doctor: "Dr. Rajesh Gupta (Endocrinologist)",
      date: "2026-09-27",
      time: "02:00 PM",
      type: "In-Clinic Consultation",
      reason: "HbA1c test discussion",
      status: "Scheduled",
      token: "T-03"
    },
    {
      id: "APT-504",
      patientId: "PAT-1004",
      patientName: "Ananya Deshmukh",
      phone: "+91 97654 32109",
      doctor: "Dr. Vikram Seth (General Physician)",
      date: "2026-09-26",
      time: "04:30 PM",
      type: "Consultation",
      reason: "Fatigue & Vitamin evaluation",
      status: "Completed",
      token: "T-00"
    }
  ],
  emergencies: [
    {
      id: "EMG-901",
      patientName: "Suresh Mehta",
      location: "Near City Bus Stand, Ring Road",
      contact: "+91 91234 56789",
      urgency: "Critical",
      details: "Acute chest pain & difficulty breathing",
      time: "14:15",
      status: "Dispatched",
      assignedAmbulance: "AMB-01 (ALS)"
    },
    {
      id: "EMG-902",
      patientName: "Kavita Verma",
      location: "Sector 9 Market, Gate 2",
      contact: "+91 92345 67890",
      urgency: "Urgent",
      details: "Two-wheeler minor collision, leg fracture suspicion",
      time: "13:40",
      status: "Completed",
      assignedAmbulance: "AMB-03 (BLS)"
    }
  ],
  ambulances: [
    {
      id: "AMB-01",
      vehicleNo: "MH-12-AB-1008",
      type: "ALS (Advanced Life Support)",
      driver: "Ramesh Pawar (+91 98220 11223)",
      status: "On Duty",
      currentLocation: "Ring Road Express Flyover",
      eta: "6 mins away"
    },
    {
      id: "AMB-02",
      vehicleNo: "MH-12-CD-4050",
      type: "BLS (Basic Life Support)",
      driver: "Sanjay Shinde (+91 98220 44556)",
      status: "Available",
      currentLocation: "Clinic Base Station",
      eta: "Ready for Dispatch"
    },
    {
      id: "AMB-03",
      vehicleNo: "MH-12-EF-8899",
      type: "Patient Transport",
      driver: "Mahesh Jadhav (+91 98220 77889)",
      status: "Available",
      currentLocation: "Civic Hospital Parking",
      eta: "10 mins away"
    }
  ],
  bloodBanks: [
    {
      id: "BB-101",
      name: "Metro Central Blood Center",
      location: "Civic Hospital Complex, Station Road",
      phone: "+91 020 2612 3456",
      hours: "24x7 Emergency",
      distance: "1.2 km",
      inventory: { "A+": 12, "A-": 3, "B+": 18, "B-": 4, "AB+": 8, "AB-": 1, "O+": 24, "O-": 5 }
    },
    {
      id: "BB-102",
      name: "Red Cross Life Line Blood Bank",
      location: "Near City Mall, FC Road",
      phone: "+91 020 2553 7890",
      hours: "08:00 AM - 10:00 PM",
      distance: "3.4 km",
      inventory: { "A+": 8, "A-": 1, "B+": 15, "B-": 2, "AB+": 5, "AB-": 0, "O+": 10, "O-": 2 }
    }
  ],
  hospitals: [
    {
      id: "HOSP-01",
      name: "Apex Super Speciality Hospital",
      address: "Plot 45, University Road",
      phone: "+91 020 4000 1000",
      emergencyUnit: "24/7 Trauma & Cardiac Unit",
      icuBedsAvailable: 4,
      distance: "2.1 km",
      directionsUrl: "https://maps.google.com"
    },
    {
      id: "HOSP-02",
      name: "Sanjeevani Community Healthcare",
      address: "Near Old Municipal Office, Karve Nagar",
      phone: "+91 020 2544 3322",
      emergencyUnit: "Primary Care & Maternity",
      icuBedsAvailable: 2,
      distance: "1.8 km",
      directionsUrl: "https://maps.google.com"
    },
    {
      id: "HOSP-03",
      name: "LifeLine Trauma Center",
      address: "NH-4 Bypass, Bavdhan",
      phone: "+91 020 6700 8888",
      emergencyUnit: "Level 1 Trauma Center",
      icuBedsAvailable: 7,
      distance: "4.5 km",
      directionsUrl: "https://maps.google.com"
    }
  ]
};

class Store {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem("medipulse_db")) {
      localStorage.setItem("medipulse_db", JSON.stringify(INITIAL_DATA));
    }
  }

  getDB() {
    try {
      return JSON.parse(localStorage.getItem("medipulse_db")) || INITIAL_DATA;
    } catch (e) {
      return INITIAL_DATA;
    }
  }

  saveDB(db) {
    localStorage.setItem("medipulse_db", JSON.stringify(db));
  }

  // Patients API
  getPatients(searchQuery = "") {
    const db = this.getDB();
    if (!searchQuery) return db.patients;
    const q = searchQuery.toLowerCase();
    return db.patients.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.bloodGroup.toLowerCase().includes(q)
    );
  }

  addPatient(patient) {
    const db = this.getDB();
    const id = "PAT-" + Math.floor(1000 + Math.random() * 9000);
    const newPatient = {
      id,
      regDate: new Date().toISOString().split("T")[0],
      ...patient
    };
    db.patients.unshift(newPatient);
    this.saveDB(db);
    return newPatient;
  }

  // Appointments API
  getAppointments(filterStatus = "All") {
    const db = this.getDB();
    if (filterStatus === "All") return db.appointments;
    return db.appointments.filter(a => a.status === filterStatus);
  }

  addAppointment(appt) {
    const db = this.getDB();
    const id = "APT-" + Math.floor(500 + Math.random() * 500);
    const token = "T-0" + (db.appointments.length + 1);
    const newAppt = {
      id,
      token,
      status: "Scheduled",
      ...appt
    };
    db.appointments.unshift(newAppt);
    this.saveDB(db);
    return newAppt;
  }

  updateAppointmentStatus(id, newStatus) {
    const db = this.getDB();
    const item = db.appointments.find(a => a.id === id);
    if (item) {
      item.status = newStatus;
      this.saveDB(db);
    }
    return item;
  }

  // Emergency SOS Requests
  getEmergencies() {
    return this.getDB().emergencies;
  }

  addEmergency(emergency) {
    const db = this.getDB();
    const id = "EMG-" + Math.floor(900 + Math.random() * 99);
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    const newEmergency = {
      id,
      time: timeStr,
      status: "Dispatched",
      assignedAmbulance: "AMB-01 (ALS)",
      ...emergency
    };
    db.emergencies.unshift(newEmergency);
    this.saveDB(db);
    return newEmergency;
  }

  // Ambulances
  getAmbulances() {
    return this.getDB().ambulances;
  }

  // Blood Banks
  getBloodBanks(bloodGroupFilter = "") {
    const db = this.getDB();
    if (!bloodGroupFilter) return db.bloodBanks;
    return db.bloodBanks;
  }

  // Nearby Hospitals
  getHospitals() {
    return this.getDB().hospitals;
  }

  // Summary Statistics
  getStats() {
    const db = this.getDB();
    const todayStr = new Date().toISOString().split("T")[0];
    const todayAppts = db.appointments.filter(a => a.date === todayStr || true); // demo count
    const pending = todayAppts.filter(a => a.status === "Scheduled" || a.status === "Checked-In").length;
    const completed = todayAppts.filter(a => a.status === "Completed").length;
    const emergencies = db.emergencies.length;
    
    // Total blood stock
    let totalBloodUnits = 0;
    db.bloodBanks.forEach(b => {
      Object.values(b.inventory).forEach(u => totalBloodUnits += u);
    });

    return {
      totalPatients: db.patients.length,
      todayAppts: todayAppts.length,
      pendingAppts: pending,
      completedAppts: completed,
      activeEmergencies: emergencies,
      totalBloodUnits
    };
  }

  resetDemoData() {
    localStorage.setItem("medipulse_db", JSON.stringify(INITIAL_DATA));
  }
}

window.medipulseStore = new Store();
