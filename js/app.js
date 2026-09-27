/* ==========================================================================
   MediPulse Pro — Enhanced Desktop & Mobile Application Controller
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initEventListeners();
  populatePatientDropdown();
  renderAllViews();
});

// Theme Switcher Controller
function initThemeToggle() {
  const toggleBtn = document.getElementById("themeToggleBtn");
  const themeIcon = document.getElementById("themeIcon");
  const html = document.documentElement;

  if (!toggleBtn) return;
  toggleBtn.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    themeIcon.className = newTheme === "dark" ? "ri-sun-line" : "ri-moon-line";
    showToast(`Switched to ${newTheme.toUpperCase()} theme`);
  });
}

// Navigation View Controller
window.switchTab = function(tabName) {
  const navLinks = document.querySelectorAll(".sidebar-menu .nav-link");
  const sections = document.querySelectorAll(".view-section");
  const topTitle = document.getElementById("topPageTitle");
  const topSubtitle = document.getElementById("topPageSubtitle");

  const pageMeta = {
    'dashboard': {
      title: "Clinic Operations Dashboard",
      subtitle: "Real-time appointments, emergency dispatch & blood stock coordination"
    },
    'appointments': {
      title: "Appointments & Queue Manager",
      subtitle: "Manage patient schedules, check-ins, tokens & status updates"
    },
    'patients': {
      title: "Patient Directory & Records",
      subtitle: "Comprehensive patient history, contact info & registration"
    },
    'ambulance': {
      title: "Ambulance SOS Command Center",
      subtitle: "Live fleet status, triage assessment & emergency dispatches"
    },
    'blood': {
      title: "Blood Group Inventory & Hospital Directory",
      subtitle: "Real-time blood availability and emergency ICU bed tracking"
    },
    'analytics': {
      title: "Operational Analytics & Data Backup",
      subtitle: "Completion rates, system metrics & database export"
    }
  };

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.id === `nav-${tabName}`) {
      link.classList.add("active");
    }
  });

  sections.forEach(sec => {
    sec.classList.remove("active");
    if (sec.id === `view-${tabName}`) {
      sec.classList.add("active");
    }
  });

  if (pageMeta[tabName] && topTitle) {
    topTitle.textContent = pageMeta[tabName].title;
    topSubtitle.textContent = pageMeta[tabName].subtitle;
  }

  renderAllViews();
};

// Toast Stack Notification System
function showToast(message, type = "info") {
  const container = document.getElementById("toastStack");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast-msg ${type}`;
  toast.innerHTML = `<span>${message}</span> <i class="ri-close-line" style="cursor:pointer;" onclick="this.parentElement.remove()"></i>`;
  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4000);
}

// Register Global Event Listeners
function initEventListeners() {
  // Modal Trigger Buttons
  document.getElementById("topSosBtn")?.addEventListener("click", () => openModal("modalEmergency"));
  document.getElementById("heroSosDispatchBtn")?.addEventListener("click", () => openModal("modalEmergency"));
  document.getElementById("btnNewApptTop")?.addEventListener("click", () => openModal("modalAppointment"));
  document.getElementById("btnNewPatientTop")?.addEventListener("click", () => openModal("modalPatient"));
  document.getElementById("btnNewSosTop")?.addEventListener("click", () => openModal("modalEmergency"));

  // Appointment Status Filters
  const apptChips = document.querySelectorAll("#apptFilterGroup .filter-chip");
  apptChips.forEach(chip => {
    chip.addEventListener("click", (e) => {
      apptChips.forEach(c => c.classList.remove("active"));
      e.target.classList.add("active");
      const filter = e.target.getAttribute("data-filter");
      renderAppointments(filter);
    });
  });

  // Global & Search Inputs
  document.getElementById("globalSearchInput")?.addEventListener("input", (e) => {
    const query = e.target.value;
    renderAppointments("All", query);
    renderPatients(query);
  });

  document.getElementById("patientSearchCtrl")?.addEventListener("input", (e) => {
    renderPatients(e.target.value);
  });

  // Blood Group Chips
  const bloodChips = document.querySelectorAll("#bloodGroupGrid .blood-select-chip");
  bloodChips.forEach(chip => {
    chip.addEventListener("click", (e) => {
      bloodChips.forEach(c => c.classList.remove("active"));
      const target = e.currentTarget;
      target.classList.add("active");
      const group = target.getAttribute("data-bg");
      renderBloodBanks(group);
    });
  });

  // Form Submissions
  document.getElementById("formAddPatient")?.addEventListener("submit", handleAddPatient);
  document.getElementById("formAddAppointment")?.addEventListener("submit", handleAddAppointment);
  document.getElementById("formAddEmergency")?.addEventListener("submit", handleAddEmergency);

  // Backup & Reset Buttons
  document.getElementById("exportDbBtn")?.addEventListener("click", exportDatabase);
  document.getElementById("resetDbBtn")?.addEventListener("click", resetDatabase);

  // Set today's date in appointment modal
  const dateInput = document.getElementById("aptDate");
  if (dateInput) {
    dateInput.value = new Date().toISOString().split("T")[0];
  }
}

// Modal Backdrop Handlers
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    if (modalId === "modalAppointment") populatePatientDropdown();
    modal.classList.add("active");
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
};

// Render All View Content
function renderAllViews() {
  const stats = window.medipulseStore.getStats();

  // Update Dashboard KPIs
  document.getElementById("kpiTodayAppts").textContent = stats.todayAppts;
  document.getElementById("kpiPendingAppts").textContent = stats.pendingAppts;
  document.getElementById("kpiEmergencies").textContent = stats.activeEmergencies;
  document.getElementById("kpiBloodStock").textContent = stats.totalBloodUnits;
  document.getElementById("dashboardSosBadge").textContent = `${stats.activeEmergencies} ACTIVE`;

  // Update Sidebar Badges
  document.getElementById("sideBadgeAppts").textContent = stats.todayAppts;
  document.getElementById("sideBadgePatients").textContent = stats.totalPatients;
  document.getElementById("sideBadgeEmergencies").textContent = stats.activeEmergencies;

  renderDashboardPreviews();
  renderAppointments();
  renderPatients();
  renderAmbulances();
  renderEmergencyLogs();
  renderBloodBanks();
  renderHospitals();
  renderAnalyticsBars();
}

// Populate Patient Select Options
function populatePatientDropdown() {
  const select = document.getElementById("aptPatientSelect");
  if (!select) return;
  const patients = window.medipulseStore.getPatients();
  select.innerHTML = patients.map(p => 
    `<option value="${p.id}">${p.name} (${p.id} — Blood: ${p.bloodGroup})</option>`
  ).join("");
}

// Render Dashboard Previews
function renderDashboardPreviews() {
  const appts = window.medipulseStore.getAppointments().slice(0, 4);
  const apptListEl = document.getElementById("dashboardApptList");

  if (appts.length === 0) {
    apptListEl.innerHTML = `<p style="font-size:13px; color:var(--text-muted); padding:12px;">No appointments scheduled for today.</p>`;
  } else {
    apptListEl.innerHTML = appts.map(a => `
      <div class="appt-card-row">
        <div class="appt-row-main">
          <div class="patient-meta-group">
            <div class="patient-avatar-badge">${a.patientName.charAt(0)}</div>
            <div class="patient-name-info">
              <h4>Token ${a.token} — ${a.patientName}</h4>
              <p>${a.doctor}</p>
            </div>
          </div>
          <div class="appt-time-slot">
            <i class="ri-time-line"></i> ${a.time}
          </div>
        </div>
        <div class="appt-row-actions">
          <span class="badge badge-${a.status.toLowerCase().replace('-', '')}">${a.status}</span>
          <div class="action-btn-group">
            ${a.status !== "Checked-In" && a.status !== "Completed" ? `<button class="btn-sm btn-warning" onclick="updateApptStatus('${a.id}', 'Checked-In')"><i class="ri-checkbox-circle-line"></i> Check-In</button>` : ''}
            ${a.status !== "Completed" ? `<button class="btn-sm btn-success" onclick="updateApptStatus('${a.id}', 'Completed')"><i class="ri-check-double-line"></i> Complete</button>` : ''}
            <button class="btn-sm btn-whatsapp" onclick="sendWhatsAppReminder('${a.phone}', '${a.patientName}', '${a.date}', '${a.time}', '${a.token}')"><i class="ri-whatsapp-line"></i> Remind</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  const emergencies = window.medipulseStore.getEmergencies().slice(0, 3);
  const sosListEl = document.getElementById("dashboardSosList");
  if (emergencies.length === 0) {
    sosListEl.innerHTML = `<p style="font-size:13px; color:var(--text-muted); padding:12px;">No active emergency SOS requests.</p>`;
  } else {
    sosListEl.innerHTML = emergencies.map(e => `
      <div class="appt-card-row" style="border-left:4px solid var(--danger);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-size:15px; font-weight:800; color:var(--text-main);">🚨 ${e.patientName}</h4>
          <span class="badge badge-${e.urgency.toLowerCase()}">${e.urgency}</span>
        </div>
        <p style="font-size:13px; color:var(--text-muted); margin-top:2px;"><i class="ri-map-pin-fill" style="color:var(--danger)"></i> ${e.location}</p>
        <p style="font-size:13px; color:var(--danger); font-weight:600;">Details: ${e.details}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-size:12px; background:var(--danger-light); padding:8px 12px; border-radius:6px; font-weight:700; color:var(--danger)">
          <span>Assigned: ${e.assignedAmbulance}</span>
          <a href="tel:${e.contact}" class="btn-sm btn-danger" style="text-decoration:none;"><i class="ri-phone-fill"></i> Call Driver</a>
        </div>
      </div>
    `).join("");
  }
}

// Render Appointments List
function renderAppointments(filterStatus = "All", searchQuery = "") {
  let appts = window.medipulseStore.getAppointments(filterStatus);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    appts = appts.filter(a => a.patientName.toLowerCase().includes(q) || a.doctor.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));
  }

  const container = document.getElementById("appointmentsList");
  if (!container) return;

  if (appts.length === 0) {
    container.innerHTML = `<p style="font-size:14px; color:var(--text-muted); text-align:center; padding:24px;">No appointments match search or filter criteria.</p>`;
    return;
  }

  container.innerHTML = appts.map(a => `
    <div class="appt-card-row">
      <div class="appt-row-main">
        <div class="patient-meta-group">
          <div class="patient-avatar-badge">${a.patientName.charAt(0)}</div>
          <div class="patient-name-info">
            <h4>Token ${a.token} — ${a.patientName} <span style="font-size:12px; color:var(--text-muted)">(${a.patientId})</span></h4>
            <p>${a.doctor} • Reason: <strong>${a.reason}</strong></p>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="appt-time-slot">
            <i class="ri-calendar-line"></i> ${a.date} at ${a.time}
          </div>
          <span class="badge badge-${a.status.toLowerCase().replace('-', '')}" style="margin-top:6px;">${a.status}</span>
        </div>
      </div>

      <div class="appt-row-actions">
        <span style="font-size:12px; color:var(--text-muted);"><i class="ri-phone-line"></i> Phone: ${a.phone}</span>
        <div class="action-btn-group">
          ${a.status !== "Checked-In" && a.status !== "Completed" ? `<button class="btn-sm btn-warning" onclick="updateApptStatus('${a.id}', 'Checked-In')"><i class="ri-checkbox-circle-line"></i> Check-In</button>` : ''}
          ${a.status !== "Completed" ? `<button class="btn-sm btn-success" onclick="updateApptStatus('${a.id}', 'Completed')"><i class="ri-check-double-line"></i> Complete</button>` : ''}
          ${a.status !== "Cancelled" ? `<button class="btn-sm btn-danger" onclick="updateApptStatus('${a.id}', 'Cancelled')"><i class="ri-close-circle-line"></i> Cancel</button>` : ''}
          <button class="btn-sm btn-whatsapp" onclick="sendWhatsAppReminder('${a.phone}', '${a.patientName}', '${a.date}', '${a.time}', '${a.token}')"><i class="ri-whatsapp-line"></i> Send WhatsApp Reminder</button>
        </div>
      </div>
    </div>
  `).join("");
}

// Update Appointment Status
window.updateApptStatus = function(id, status) {
  window.medipulseStore.updateAppointmentStatus(id, status);
  showToast(`Appointment status changed to '${status}'`);
  renderAllViews();
};

// Send WhatsApp Direct Reminder
window.sendWhatsAppReminder = function(phone, patientName, date, time, token) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const msg = encodeURIComponent(`Hello ${patientName}, this is an official reminder from MediPulse Clinic for your upcoming appointment.\n📅 Date: ${date}\n⏰ Time: ${time}\n🎟️ Token No: ${token}\nPlease bring your medical records.`);
  window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  showToast("Opening WhatsApp pre-filled notification link!");
};

// Render Patient Directory Grid
function renderPatients(searchQuery = "") {
  const patients = window.medipulseStore.getPatients(searchQuery);
  const container = document.getElementById("patientsListGrid");
  if (!container) return;

  if (patients.length === 0) {
    container.innerHTML = `<p style="font-size:14px; color:var(--text-muted); padding:24px; text-align:center;">No patient records found.</p>`;
    return;
  }

  container.innerHTML = patients.map(p => `
    <div class="patient-record-card" onclick="viewPatientDetail('${p.id}')">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div class="patient-meta-group">
          <div class="patient-avatar-badge">${p.name.charAt(0)}</div>
          <div class="patient-name-info">
            <h4>${p.name}</h4>
            <p>${p.id} • ${p.age} yrs • ${p.gender}</p>
          </div>
        </div>
        <span class="blood-type-tag">${p.bloodGroup}</span>
      </div>
      <div style="margin-top:14px; font-size:13px; color:var(--text-muted); line-height:1.4;">
        <p><i class="ri-phone-line"></i> ${p.phone}</p>
        <p style="margin-top:4px;"><i class="ri-map-pin-line"></i> ${p.address || 'Address not listed'}</p>
      </div>
    </div>
  `).join("");
}

// View Patient Profile Detail Modal
window.viewPatientDetail = function(patientId) {
  const patient = window.medipulseStore.getPatients().find(p => p.id === patientId);
  if (!patient) return;

  const appts = window.medipulseStore.getAppointments().filter(a => a.patientId === patientId);

  document.getElementById("detailPatientName").textContent = `${patient.name} (${patient.id})`;
  const contentEl = document.getElementById("patientDetailContent");

  contentEl.innerHTML = `
    <div style="background:var(--bg-app); padding:16px; border-radius:var(--radius-md); margin-bottom:16px; font-size:14px; border:1px solid var(--border-card);">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <strong>Blood Group:</strong> <span class="blood-type-tag">${patient.bloodGroup}</span>
      </div>
      <p style="margin-top:4px"><strong>Age & Gender:</strong> ${patient.age} yrs, ${patient.gender}</p>
      <p style="margin-top:4px"><strong>Contact Phone:</strong> ${patient.phone}</p>
      <p style="margin-top:4px"><strong>Emergency Contact:</strong> ${patient.emergencyContact || 'N/A'}</p>
      <p style="margin-top:4px"><strong>Address:</strong> ${patient.address || 'N/A'}</p>
      <p style="margin-top:4px; color:var(--danger); font-weight:600;"><strong>Medical Notes / Allergies:</strong> ${patient.notes || 'None recorded'}</p>
    </div>

    <h4 style="font-size:15px; font-weight:800; margin-bottom:12px;"><i class="ri-history-line"></i> Past Visits & Consultations</h4>
    ${appts.length === 0 ? `<p style="font-size:13px; color:var(--text-muted)">No past visits recorded.</p>` : 
      appts.map(a => `
        <div style="border:1px solid var(--border-card); padding:10px 14px; border-radius:var(--radius-md); margin-bottom:8px; font-size:13px;">
          <div style="display:flex; justify-content:space-between;">
            <strong>${a.date} — ${a.doctor}</strong>
            <span class="badge badge-${a.status.toLowerCase().replace('-','')}">${a.status}</span>
          </div>
          <p style="color:var(--text-muted); margin-top:4px;">Reason: ${a.reason}</p>
        </div>
      `).join("")
    }
  `;

  openModal("modalPatientDetail");
};

// Render Ambulance Fleet Directory
function renderAmbulances() {
  const ambulances = window.medipulseStore.getAmbulances();
  const container = document.getElementById("ambulanceFleetList");
  if (!container) return;

  container.innerHTML = ambulances.map(a => `
    <div style="border:1px solid var(--border-card); padding:14px; border-radius:var(--radius-md); margin-bottom:10px; background:var(--surface-card);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h4 style="font-size:15px; font-weight:800;">${a.id} — ${a.vehicleNo}</h4>
        <span class="badge ${a.status === 'Available' ? 'badge-completed' : 'badge-checkedin'}">${a.status}</span>
      </div>
      <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Type: <strong>${a.type}</strong></p>
      <p style="font-size:13px; color:var(--text-muted); margin-top:2px;"><i class="ri-user-voice-line"></i> Driver: ${a.driver}</p>
      <div style="display:flex; justify-content:space-between; font-size:13px; color:var(--primary); margin-top:8px; font-weight:700;">
        <span><i class="ri-map-pin-2-line"></i> Location: ${a.currentLocation}</span>
        <span><i class="ri-time-line"></i> ETA: ${a.eta}</span>
      </div>
    </div>
  `).join("");
}

// Render Emergency Dispatch Requests Log
function renderEmergencyLogs() {
  const emergencies = window.medipulseStore.getEmergencies();
  const container = document.getElementById("emergencyDispatchList");
  if (!container) return;

  container.innerHTML = emergencies.map(e => `
    <div class="appt-card-row" style="border-left:4px solid var(--danger);">
      <div style="display:flex; justify-content:space-between;">
        <strong style="font-size:15px;">${e.id} — ${e.patientName}</strong>
        <span class="badge badge-${e.urgency.toLowerCase()}">${e.urgency}</span>
      </div>
      <p style="font-size:13px; color:var(--text-muted); margin-top:4px;"><i class="ri-map-pin-fill" style="color:var(--danger)"></i> Pickup: ${e.location}</p>
      <p style="font-size:13px; color:var(--text-muted); margin-top:2px;">Contact: ${e.contact} • Dispatch Time: ${e.time}</p>
      <p style="font-size:13px; color:var(--text-main); font-weight:700; margin-top:4px;">Situation Notes: ${e.details}</p>
      <div style="margin-top:8px; font-size:12px; background:var(--danger-light); color:var(--danger); padding:6px 12px; border-radius:6px; font-weight:700;">
        Assigned Ambulance Unit: ${e.assignedAmbulance}
      </div>
    </div>
  `).join("");
}

// Render Blood Banks Directory
function renderBloodBanks(filterGroup = "All") {
  const banks = window.medipulseStore.getBloodBanks();
  const container = document.getElementById("bloodBankList");
  if (!container) return;

  container.innerHTML = banks.map(b => {
    const stockEntries = Object.entries(b.inventory);
    return `
      <div style="border-bottom:1px solid var(--border-card); padding-bottom:14px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-size:15px; font-weight:800; color:var(--text-main);">${b.name}</h4>
          <span style="font-size:12px; color:var(--text-muted);">${b.distance} away</span>
        </div>
        <p style="font-size:13px; color:var(--text-muted); margin-top:4px;"><i class="ri-map-pin-line"></i> ${b.location}</p>
        <p style="font-size:13px; color:var(--primary); font-weight:600; margin-top:2px;"><i class="ri-phone-line"></i> ${b.phone} (${b.hours})</p>

        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:10px;">
          ${stockEntries.map(([group, units]) => {
            if (filterGroup !== "All" && group !== filterGroup) return '';
            const isLow = units < 5;
            return `
              <span style="font-size:12px; padding:4px 10px; border-radius:6px; font-weight:800; ${isLow ? 'background:var(--danger-light); color:var(--danger)' : 'background:var(--secondary-light); color:var(--secondary)'}">
                ${group}: ${units} Units ${isLow ? '⚠️ LOW' : ''}
              </span>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join("");
}

// Render Hospitals Directory
function renderHospitals() {
  const hospitals = window.medipulseStore.getHospitals();
  const container = document.getElementById("hospitalsList");
  if (!container) return;

  container.innerHTML = hospitals.map(h => `
    <div style="border-bottom:1px solid var(--border-card); padding-bottom:14px; margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h4 style="font-size:15px; font-weight:800; color:var(--text-main);">${h.name}</h4>
        <span style="font-size:12px; color:var(--text-muted);">${h.distance}</span>
      </div>
      <p style="font-size:13px; color:var(--text-muted); margin-top:4px;"><i class="ri-map-pin-line"></i> ${h.address}</p>
      <p style="font-size:13px; color:var(--danger); font-weight:700; margin-top:2px;"><i class="ri-shield-cross-line"></i> ${h.emergencyUnit}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
        <span class="badge badge-completed">${h.icuBedsAvailable} ICU Beds Available</span>
        <a href="tel:${h.phone}" class="btn-sm btn-primary" style="text-decoration:none;"><i class="ri-phone-fill"></i> Call Emergency</a>
      </div>
    </div>
  `).join("");
}

// Analytics Visual Progress Bars
function renderAnalyticsBars() {
  const appts = window.medipulseStore.getAppointments();
  const total = appts.length || 1;
  const scheduled = appts.filter(a => a.status === "Scheduled").length;
  const checkedIn = appts.filter(a => a.status === "Checked-In").length;
  const completed = appts.filter(a => a.status === "Completed").length;

  const apptBarsEl = document.getElementById("analyticsApptBars");
  if (apptBarsEl) {
    apptBarsEl.innerHTML = `
      <div style="font-size:13px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; font-weight:700;">
          <span>Completed Visits (${completed})</span> <span>${Math.round(completed/total*100)}%</span>
        </div>
        <div style="width:100%; height:10px; background:var(--bg-app); border-radius:5px; margin-top:6px; overflow:hidden;">
          <div style="height:100%; width:${Math.round(completed/total*100)}%; background:var(--secondary);"></div>
        </div>
      </div>
      <div style="font-size:13px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; font-weight:700;">
          <span>Waiting Room Checked-In (${checkedIn})</span> <span>${Math.round(checkedIn/total*100)}%</span>
        </div>
        <div style="width:100%; height:10px; background:var(--bg-app); border-radius:5px; margin-top:6px; overflow:hidden;">
          <div style="height:100%; width:${Math.round(checkedIn/total*100)}%; background:var(--warning);"></div>
        </div>
      </div>
      <div style="font-size:13px;">
        <div style="display:flex; justify-content:space-between; font-weight:700;">
          <span>Upcoming Scheduled (${scheduled})</span> <span>${Math.round(scheduled/total*100)}%</span>
        </div>
        <div style="width:100%; height:10px; background:var(--bg-app); border-radius:5px; margin-top:6px; overflow:hidden;">
          <div style="height:100%; width:${Math.round(scheduled/total*100)}%; background:var(--primary);"></div>
        </div>
      </div>
    `;
  }
}

// Form Handlers
function handleAddPatient(e) {
  e.preventDefault();
  const patientData = {
    name: document.getElementById("pName").value,
    age: document.getElementById("pAge").value,
    gender: document.getElementById("pGender").value,
    bloodGroup: document.getElementById("pBlood").value,
    phone: document.getElementById("pPhone").value,
    emergencyContact: document.getElementById("pEmergPhone").value,
    address: document.getElementById("pAddress").value,
    notes: document.getElementById("pNotes").value
  };

  const newPatient = window.medipulseStore.addPatient(patientData);
  showToast(`Patient ${newPatient.name} registered successfully!`);
  closeModal("modalPatient");
  e.target.reset();
  renderAllViews();
}

function handleAddAppointment(e) {
  e.preventDefault();
  const select = document.getElementById("aptPatientSelect");
  const patientId = select.value;
  const patient = window.medipulseStore.getPatients().find(p => p.id === patientId);

  const apptData = {
    patientId: patientId,
    patientName: patient ? patient.name : "Patient",
    phone: patient ? patient.phone : "",
    doctor: document.getElementById("aptDoctor").value,
    date: document.getElementById("aptDate").value,
    time: document.getElementById("aptTime").value,
    type: document.getElementById("aptType").value,
    reason: document.getElementById("aptReason").value
  };

  const newAppt = window.medipulseStore.addAppointment(apptData);
  showToast(`Appointment booked! Token #${newAppt.token}`);
  closeModal("modalAppointment");
  e.target.reset();
  renderAllViews();
}

function handleAddEmergency(e) {
  e.preventDefault();
  const emergencyData = {
    patientName: document.getElementById("emgName").value,
    location: document.getElementById("emgLocation").value,
    contact: document.getElementById("emgPhone").value,
    urgency: document.getElementById("emgUrgency").value,
    details: document.getElementById("emgDetails").value
  };

  const newEmergency = window.medipulseStore.addEmergency(emergencyData);
  showToast(`🚨 Ambulance Dispatched! Emergency ID: ${newEmergency.id}`);
  closeModal("modalEmergency");
  e.target.reset();
  renderAllViews();
}

// Export DB Backup JSON
function exportDatabase() {
  const db = window.medipulseStore.getDB();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `medipulse_backup_${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Database backup exported successfully!");
}

// Reset Database to Demo Seed
function resetDatabase() {
  if (confirm("Are you sure you want to reset all patient and appointment data to factory defaults?")) {
    window.medipulseStore.resetDemoData();
    showToast("Database reset to factory defaults.");
    renderAllViews();
  }
}
