// Admin panel functionality for Warri Apartment Hunt

let currentDeleteId = null;
let currentDeleteType = null;

function setupAdminPage() {
    checkAdminAuth();
    setupLoginForm();
    setupAdminDashboard();
}

function checkAdminAuth() {
    const isAuthenticated = sessionStorage.getItem('adminAuthed') === 'true';
    const loginScreen = document.getElementById('login-screen');
    const adminDashboard = document.getElementById('admin-dashboard');
    
    if (isAuthenticated) {
        loginScreen.style.display = 'none';
        adminDashboard.style.display = 'block';
        initializeAdminDashboard();
    } else {
        loginScreen.style.display = 'flex';
        adminDashboard.style.display = 'none';
    }
}

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Hardcoded admin credentials
    if (email === 'admin@warri.local' && password === 'admin123') {
        sessionStorage.setItem('adminAuthed', 'true');
        showToast('Login successful!', 'success');
        checkAdminAuth();
    } else {
        showToast('Invalid credentials', 'error');
    }
}

function setupAdminDashboard() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Tab navigation
    document.querySelectorAll('.admin-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchAdminTab(tabId);
        });
    });
    
    // Modal forms
    setupAdminForms();
    
    // Listen for storage updates
    window.addEventListener('storageUpdated', function(event) {
        refreshAdminData(event.detail.keys);
    });
}

function handleLogout() {
    sessionStorage.removeItem('adminAuthed');
    showToast('Logged out successfully', 'success');
    checkAdminAuth();
}

function initializeAdminDashboard() {
    loadDashboardStats();
    loadRentListingsTable();
    loadSaleListingsTable();
    loadAgentsTable();
    loadApplicationsTable();
    loadInspectionsTable();
    loadSupportTicketsTable();
    populateAgentSelects();
}

function switchAdminTab(tabId) {
    // Update menu items
    document.querySelectorAll('.admin-menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
}

function refreshAdminData(keys) {
    if (keys.includes('rentListings')) {
        loadRentListingsTable();
        loadDashboardStats();
        populateAgentSelects();
    }
    if (keys.includes('saleListings')) {
        loadSaleListingsTable();
        loadDashboardStats();
    }
    if (keys.includes('agents')) {
        loadAgentsTable();
        loadDashboardStats();
        populateAgentSelects();
    }
    if (keys.includes('applications')) {
        loadApplicationsTable();
        loadDashboardStats();
    }
    if (keys.includes('inspections')) {
        loadInspectionsTable();
        loadDashboardStats();
    }
    if (keys.includes('supportTickets')) {
        loadSupportTicketsTable();
    }
}

// Dashboard Stats
function loadDashboardStats() {
    const stats = getStats();
    const statsGrid = document.getElementById('stats-grid');
    
    if (!statsGrid) return;
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <i class="ri-home-4-line"></i>
            <span class="stat-number">${stats.totalRentListings}</span>
            <span class="stat-label">Total Rent Listings</span>
        </div>
        <div class="stat-card">
            <i class="ri-check-line"></i>
            <span class="stat-number">${stats.availableRentListings}</span>
            <span class="stat-label">Available Rentals</span>
        </div>
        <div class="stat-card">
            <i class="ri-building-line"></i>
            <span class="stat-number">${stats.totalSaleListings}</span>
            <span class="stat-label">Properties for Sale</span>
        </div>
        <div class="stat-card">
            <i class="ri-user-3-line"></i>
            <span class="stat-number">${stats.totalAgents}</span>
            <span class="stat-label">Active Agents</span>
        </div>
        <div class="stat-card">
            <i class="ri-file-list-3-line"></i>
            <span class="stat-number">${stats.totalApplications}</span>
            <span class="stat-label">Total Applications</span>
        </div>
        <div class="stat-card">
            <i class="ri-calendar-check-line"></i>
            <span class="stat-number">${stats.totalInspections}</span>
            <span class="stat-label">Scheduled Inspections</span>
        </div>
        <div class="stat-card">
            <i class="ri-money-dollar-circle-line"></i>
            <span class="stat-number">₦${stats.avgPriceRent.toLocaleString()}</span>
            <span class="stat-label">Avg. Rent Price</span>
        </div>
        <div class="stat-card">
            <i class="ri-customer-service-line"></i>
            <span class="stat-number">${stats.totalSupportTickets}</span>
            <span class="stat-label">Support Tickets</span>
        </div>
    `;
}

// Rent Listings Table
function loadRentListingsTable() {
    const tbody = document.querySelector('#rent-listings-table tbody');
    if (!tbody) return;
    
    const listings = getListings();
    
    tbody.innerHTML = listings.map(listing => {
        const agent = getAgent(listing.agentId);
        return `
            <tr>
                <td>${listing.title}</td>
                <td>${listing.area}</td>
                <td>${listing.type}</td>
                <td>₦${listing.price.toLocaleString()}</td>
                <td>${agent?.name || 'N/A'}</td>
                <td>
                    <span class="availability-badge availability-${listing.available ? 'available' : 'unavailable'}">
                        ${listing.available ? 'Available' : 'Unavailable'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline btn-icon edit-listing-btn" 
                                data-listing-id="${listing.id}" data-type="rent" title="Edit">
                            <i class="ri-edit-line"></i>
                        </button>
                        <button class="btn btn-danger btn-icon delete-listing-btn" 
                                data-listing-id="${listing.id}" data-type="rent" title="Delete">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    setupListingTableActions();
}

// Sale Listings Table
function loadSaleListingsTable() {
    const tbody = document.querySelector('#sale-listings-table tbody');
    if (!tbody) return;
    
    const listings = getSaleListings();
    
    tbody.innerHTML = listings.map(listing => {
        const agent = getAgent(listing.agentId);
        return `
            <tr>
                <td>${listing.title}</td>
                <td>${listing.area}</td>
                <td>${listing.type}</td>
                <td>₦${listing.price.toLocaleString()}</td>
                <td>${agent?.name || 'N/A'}</td>
                <td>
                    <span class="availability-badge availability-${listing.available ? 'available' : 'unavailable'}">
                        ${listing.available ? 'Available' : 'Unavailable'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline btn-icon edit-listing-btn" 
                                data-listing-id="${listing.id}" data-type="sale" title="Edit">
                            <i class="ri-edit-line"></i>
                        </button>
                        <button class="btn btn-danger btn-icon delete-listing-btn" 
                                data-listing-id="${listing.id}" data-type="sale" title="Delete">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    setupListingTableActions();
}

// Agents Table
function loadAgentsTable() {
    const tbody = document.querySelector('#agents-table tbody');
    if (!tbody) return;
    
    const agents = getAgents();
    
    tbody.innerHTML = agents.map(agent => {
        const rentListings = getListings().filter(l => l.agentId === agent.id && l.available);
        const saleListings = getSaleListings().filter(l => l.agentId === agent.id && l.available);
        const activeListings = rentListings.length + saleListings.length;
        
        return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <img src="${agent.avatarUrl}" alt="${agent.name}" 
                             style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                        ${agent.name}
                    </div>
                </td>
                <td>${agent.phone}</td>
                <td>${agent.whatsapp}</td>
                <td>${agent.areasCovered.join(', ')}</td>
                <td>${activeListings}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline btn-icon edit-agent-btn" 
                                data-agent-id="${agent.id}" title="Edit">
                            <i class="ri-edit-line"></i>
                        </button>
                        <button class="btn btn-danger btn-icon delete-agent-btn" 
                                data-agent-id="${agent.id}" title="Delete">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    setupAgentTableActions();
}

// Applications Table
function loadApplicationsTable() {
    const tbody = document.querySelector('#applications-table tbody');
    if (!tbody) return;
    
    const applications = getApplications().sort((a, b) => b.createdAt - a.createdAt);
    
    tbody.innerHTML = applications.map(app => {
        const listing = getListing(app.apartmentId);
        const propertyTitle = listing ? listing.title : app.apartmentSnapshot?.title || 'Property Not Found';
        
        return `
            <tr>
                <td>${app.applicantName}</td>
                <td>${app.phone}</td>
                <td>${propertyTitle}</td>
                <td>${formatDate(app.createdAt)}</td>
                <td>${app.preferredContact}</td>
                <td>
                    <select class="application-status-select" data-application-id="${app.id}">
                        <option value="Submitted" ${app.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
                        <option value="Reviewed" ${app.status === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
                        <option value="Scheduled" ${app.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                        <option value="Approved" ${app.status === 'Approved' ? 'selected' : ''}>Approved</option>
                        <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </td>
                <td>
                    <div class="table-actions">
                        <a href="tel:${app.phone}" class="btn btn-outline btn-icon" title="Call">
                            <i class="ri-phone-line"></i>
                        </a>
                        <a href="https://wa.me/${app.phone.replace('+', '')}?text=${encodeURIComponent(`Hello ${app.applicantName}, regarding your application for ${propertyTitle}...`)}" 
                           class="btn btn-outline btn-icon" title="WhatsApp" target="_blank">
                            <i class="ri-whatsapp-line"></i>
                        </a>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    setupApplicationTableActions();
}

// Inspections Table
function loadInspectionsTable() {
    const tbody = document.querySelector('#inspections-table tbody');
    if (!tbody) return;
    
    const inspections = getInspections().sort((a, b) => new Date(a.date) - new Date(b.date));
    
    tbody.innerHTML = inspections.map(inspection => {
        const listing = getListing(inspection.apartmentId);
        const propertyTitle = listing ? listing.title : inspection.apartmentTitle || 'Property Not Found';
        
        return `
            <tr>
                <td>${inspection.applicantName}</td>
                <td>${inspection.phone}</td>
                <td>${propertyTitle}</td>
                <td>${new Date(inspection.date).toLocaleDateString()}</td>
                <td>${inspection.time}</td>
                <td>
                    <select class="inspection-status-select" data-inspection-id="${inspection.id}">
                        <option value="Pending" ${inspection.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Confirmed" ${inspection.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="Completed" ${inspection.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Cancelled" ${inspection.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <div class="table-actions">
                        <a href="tel:${inspection.phone}" class="btn btn-outline btn-icon" title="Call">
                            <i class="ri-phone-line"></i>
                        </a>
                        <a href="https://wa.me/${inspection.phone.replace('+', '')}?text=${encodeURIComponent(`Hello ${inspection.applicantName}, regarding your inspection for ${propertyTitle} on ${new Date(inspection.date).toLocaleDateString()} at ${inspection.time}...`)}" 
                           class="btn btn-outline btn-icon" title="WhatsApp" target="_blank">
                            <i class="ri-whatsapp-line"></i>
                        </a>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    setupInspectionTableActions();
}

// Support Tickets Table
function loadSupportTicketsTable() {
    const tbody = document.querySelector('#support-table tbody');
    if (!tbody) return;
    
    const tickets = getSupportTickets().sort((a, b) => b.createdAt - a.createdAt);
    
    tbody.innerHTML = tickets.map(ticket => `
        <tr>
            <td>${ticket.name}</td>
            <td>${ticket.phone}</td>
            <td>${ticket.subject}</td>
            <td>${formatDate(ticket.createdAt)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-outline btn-icon view-ticket-btn" 
                            data-ticket-id="${ticket.id}" title="View Details">
                        <i class="ri-eye-line"></i>
                    </button>
                    <a href="tel:${ticket.phone}" class="btn btn-outline btn-icon" title="Call">
                        <i class="ri-phone-line"></i>
                    </a>
                    ${ticket.email ? `
                        <a href="mailto:${ticket.email}" class="btn btn-outline btn-icon" title="Email">
                            <i class="ri-mail-line"></i>
                        </a>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
    
    setupSupportTableActions();
}

// Form Setup
function setupAdminForms() {
    // Add listing buttons
    document.getElementById('add-rent-listing-btn')?.addEventListener('click', () => {
        openListingModal('rent');
    });
    
    document.getElementById('add-sale-listing-btn')?.addEventListener('click', () => {
        openListingModal('sale');
    });
    
    // Add agent button
    document.getElementById('add-agent-btn')?.addEventListener('click', () => {
        openAgentModal();
    });
    
    // Listing form
    const listingForm = document.getElementById('listing-form');
    if (listingForm) {
        listingForm.addEventListener('submit', handleListingSubmit);
    }
    
    // Agent form
    const agentForm = document.getElementById('agent-form');
    if (agentForm) {
        agentForm.addEventListener('submit', handleAgentSubmit);
    }
    
    // Confirm delete
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    }
    
    // Populate agent areas checkboxes
    populateAgentAreasCheckboxes();
}

function populateAgentSelects() {
    const agents = getAgents();
    const selects = document.querySelectorAll('#listing-agent');
    
    selects.forEach(select => {
        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        agents.forEach(agent => {
            const option = document.createElement('option');
            option.value = agent.id;
            option.textContent = agent.name;
            select.appendChild(option);
        });
    });
}

function populateAgentAreasCheckboxes() {
    const container = document.getElementById('agent-areas-checkboxes');
    if (!container) return;
    
    const areas = ['Warri', 'Effurun', 'Ekpan', 'Ugborikoko', 'Airport Road', 'Jakpa', 'PTI', 'Udu', 'Ekete', 'Okuokoko'];
    
    container.innerHTML = areas.map(area => `
        <label class="checkbox-label">
            <input type="checkbox" name="areasCovered" value="${area}">
            <span class="checkmark"></span>
            ${area}
        </label>
    `).join('');
}

// Modal Functions
function openListingModal(type, listingId = null) {
    const modal = document.getElementById('listing-modal');
    const form = document.getElementById('listing-form');
    const title = document.getElementById('listing-modal-title');
    const typeInput = document.getElementById('listing-type');
    
    if (!modal || !form) return;
    
    // Reset form
    form.reset();
    
    // Set type
    typeInput.value = type;
    
    if (listingId) {
        // Edit mode
        title.textContent = `Edit ${type === 'rent' ? 'Rental' : 'Sale'} Listing`;
        const listing = type === 'rent' ? getListing(listingId) : getSaleListing(listingId);
        
        if (listing) {
            populateListingForm(form, listing);
        }
    } else {
        // Add mode
        title.textContent = `Add ${type === 'rent' ? 'Rental' : 'Sale'} Listing`;
    }
    
    openModal(modal);
}

function populateListingForm(form, listing) {
    form.querySelector('#listing-id').value = listing.id;
    form.querySelector('#listing-title').value = listing.title;
    form.querySelector('#listing-area').value = listing.area;
    form.querySelector('#listing-description').value = listing.description;
    form.querySelector('#listing-price').value = listing.price;
    form.querySelector('#listing-property-type').value = listing.type;
    form.querySelector('#listing-bedrooms').value = listing.bedrooms;
    form.querySelector('#listing-bathrooms').value = listing.bathrooms;
    form.querySelector('#listing-size').value = listing.sizeSqm || '';
    form.querySelector('#listing-agent').value = listing.agentId;
    form.querySelector('#listing-lead-image').value = listing.leadImageUrl;
    form.querySelector('#listing-images').value = (listing.imageUrls || []).join('\n');
    form.querySelector('#listing-available').checked = listing.available;
}

function openAgentModal(agentId = null) {
    const modal = document.getElementById('agent-modal');
    const form = document.getElementById('agent-form');
    const title = document.getElementById('agent-modal-title');
    
    if (!modal || !form) return;
    
    // Reset form
    form.reset();
    
    if (agentId) {
        // Edit mode
        title.textContent = 'Edit Agent';
        const agent = getAgent(agentId);
        
        if (agent) {
            populateAgentForm(form, agent);
        }
    } else {
        // Add mode
        title.textContent = 'Add Agent';
    }
    
    openModal(modal);
}

function populateAgentForm(form, agent) {
    form.querySelector('#agent-id').value = agent.id;
    form.querySelector('#agent-name').value = agent.name;
    form.querySelector('#agent-phone').value = agent.phone;
    form.querySelector('#agent-whatsapp').value = agent.whatsapp;
    form.querySelector('#agent-avatar').value = agent.avatarUrl;
    form.querySelector('#agent-bio').value = agent.bio || '';
    
    // Check areas
    agent.areasCovered.forEach(area => {
        const checkbox = form.querySelector(`input[name="areasCovered"][value="${area}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

// Form Handlers
function handleListingSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    showLoading(submitBtn, 'Saving...');
    
    setTimeout(() => {
        try {
            const listingData = {
                title: formData.get('title'),
                description: formData.get('description'),
                area: formData.get('area'),
                city: 'Warri',
                state: 'Delta State',
                price: parseInt(formData.get('price')),
                type: formData.get('propertyType'),
                bedrooms: parseInt(formData.get('bedrooms')),
                bathrooms: parseInt(formData.get('bathrooms')),
                sizeSqm: formData.get('size') ? parseInt(formData.get('size')) : null,
                agentId: formData.get('agentId'),
                leadImageUrl: formData.get('leadImageUrl'),
                imageUrls: formData.get('imageUrls') ? formData.get('imageUrls').split('\n').filter(url => url.trim()) : [],
                available: formData.has('available')
            };
            
            const listingId = formData.get('id');
            const listingType = formData.get('type');
            
            if (listingId) {
                // Update existing listing
                if (listingType === 'rent') {
                    updateListing(listingId, listingData);
                } else {
                    updateSaleListing(listingId, listingData);
                }
                showToast('Listing updated successfully!', 'success');
            } else {
                // Create new listing
                if (listingType === 'rent') {
                    addListing(listingData);
                } else {
                    addSaleListing(listingData);
                }
                showToast('Listing created successfully!', 'success');
            }
            
            closeModal(document.getElementById('listing-modal'));
            
        } catch (error) {
            console.error('Error saving listing:', error);
            showToast('Error saving listing. Please try again.', 'error');
        } finally {
            hideLoading(submitBtn);
        }
    }, 1000);
}

function handleAgentSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    showLoading(submitBtn, 'Saving...');
    
    setTimeout(() => {
        try {
            const agentData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                whatsapp: formData.get('whatsapp'),
                avatarUrl: formData.get('avatarUrl'),
                areasCovered: formData.getAll('areasCovered'),
                bio: formData.get('bio') || ''
            };
            
            const agentId = formData.get('id');
            
            if (agentId) {
                // Update existing agent
                updateAgent(agentId, agentData);
                showToast('Agent updated successfully!', 'success');
            } else {
                // Create new agent
                addAgent(agentData);
                showToast('Agent created successfully!', 'success');
            }
            
            closeModal(document.getElementById('agent-modal'));
            
        } catch (error) {
            console.error('Error saving agent:', error);
            showToast('Error saving agent. Please try again.', 'error');
        } finally {
            hideLoading(submitBtn);
        }
    }, 1000);
}

// Table Action Handlers
function setupListingTableActions() {
    document.querySelectorAll('.edit-listing-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const listingId = this.dataset.listingId;
            const type = this.dataset.type;
            openListingModal(type, listingId);
        });
    });
    
    document.querySelectorAll('.delete-listing-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const listingId = this.dataset.listingId;
            const type = this.dataset.type;
            const listing = type === 'rent' ? getListing(listingId) : getSaleListing(listingId);
            
            currentDeleteId = listingId;
            currentDeleteType = type === 'rent' ? 'rentListing' : 'saleListing';
            
            const modal = document.getElementById('confirm-modal');
            const message = document.getElementById('confirm-message');
            message.textContent = `Are you sure you want to delete "${listing?.title}"? This action cannot be undone.`;
            
            openModal(modal);
        });
    });
}

function setupAgentTableActions() {
    document.querySelectorAll('.edit-agent-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const agentId = this.dataset.agentId;
            openAgentModal(agentId);
        });
    });
    
    document.querySelectorAll('.delete-agent-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const agentId = this.dataset.agentId;
            const agent = getAgent(agentId);
            
            currentDeleteId = agentId;
            currentDeleteType = 'agent';
            
            const modal = document.getElementById('confirm-modal');
            const message = document.getElementById('confirm-message');
            message.textContent = `Are you sure you want to delete agent "${agent?.name}"? This action cannot be undone.`;
            
            openModal(modal);
        });
    });
}

function setupApplicationTableActions() {
    document.querySelectorAll('.application-status-select').forEach(select => {
        select.addEventListener('change', function() {
            const applicationId = this.dataset.applicationId;
            const newStatus = this.value;
            
            updateApplicationStatus(applicationId, newStatus);
            showToast('Application status updated', 'success', 2000);
        });
    });
}

function setupInspectionTableActions() {
    document.querySelectorAll('.inspection-status-select').forEach(select => {
        select.addEventListener('change', function() {
            const inspectionId = this.dataset.inspectionId;
            const newStatus = this.value;
            
            updateInspectionStatus(inspectionId, newStatus);
            showToast('Inspection status updated', 'success', 2000);
        });
    });
}

function setupSupportTableActions() {
    document.querySelectorAll('.view-ticket-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.dataset.ticketId;
            const tickets = getSupportTickets();
            const ticket = tickets.find(t => t.id === ticketId);
            
            if (ticket) {
                alert(`Support Ticket Details:\n\nName: ${ticket.name}\nPhone: ${ticket.phone}\nEmail: ${ticket.email || 'Not provided'}\nSubject: ${ticket.subject}\nDate: ${formatDateTime(ticket.createdAt)}\n\nMessage:\n${ticket.message}`);
            }
        });
    });
}

function handleConfirmDelete() {
    if (!currentDeleteId || !currentDeleteType) return;
    
    try {
        switch (currentDeleteType) {
            case 'rentListing':
                deleteListing(currentDeleteId);
                showToast('Rental listing deleted successfully', 'success');
                break;
            case 'saleListing':
                deleteSaleListing(currentDeleteId);
                showToast('Sale listing deleted successfully', 'success');
                break;
            case 'agent':
                deleteAgent(currentDeleteId);
                showToast('Agent deleted successfully', 'success');
                break;
        }
        
        closeModal(document.getElementById('confirm-modal'));
        
    } catch (error) {
        console.error('Error deleting item:', error);
        showToast('Error deleting item. Please try again.', 'error');
    } finally {
        currentDeleteId = null;
        currentDeleteType = null;
    }
}

// Export admin functions
window.admin = {
    setupAdminPage,
    checkAdminAuth,
    initializeAdminDashboard,
    switchAdminTab
};