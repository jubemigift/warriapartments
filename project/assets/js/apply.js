// Application form handling for Warri Apartment Hunt

function setupApplyPage() {
    populateApartmentSelect();
    loadMyApplications();
    setupApplicationForm();
    setupRefreshButton();
    
    // Check for apartment ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const apartmentId = urlParams.get('apartmentId');
    if (apartmentId) {
        const select = document.getElementById('apartment-select');
        if (select) {
            select.value = apartmentId;
        }
    }
}

function populateApartmentSelect() {
    const select = document.getElementById('apartment-select');
    if (!select) return;
    
    const listings = getListings().filter(listing => listing.available);
    
    // Clear existing options except the first one
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    listings.forEach(listing => {
        const option = document.createElement('option');
        option.value = listing.id;
        option.textContent = `${listing.title} - ${listing.area} (₦${listing.price.toLocaleString()}/year)`;
        select.appendChild(option);
    });
    
    if (listings.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No available apartments';
        option.disabled = true;
        select.appendChild(option);
    }
}

function setupApplicationForm() {
    const form = document.getElementById('application-form');
    if (!form) return;
    
    form.addEventListener('submit', handleApplicationSubmit);
    
    // Phone number formatting
    const phoneInput = document.getElementById('applicant-phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value) {
                this.value = formatNigerianPhone(this.value);
            }
        });
        
        phoneInput.addEventListener('input', function() {
            clearFieldError(this);
        });
    }
    
    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Specific field validations
    if (value && field.type === 'tel') {
        if (!validateNigerianPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid Nigerian phone number';
        }
    }
    
    if (value && field.type === 'email') {
        if (!validateEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    if (value && field.type === 'date') {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            isValid = false;
            errorMessage = 'Move-in date cannot be in the past';
        }
    }
    
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function validateApplicationForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function handleApplicationSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateApplicationForm(form)) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }
    
    showLoading(submitBtn, 'Submitting...');
    
    // Simulate network delay
    setTimeout(() => {
        try {
            const formData = getFormData(form);
            
            // Create application object
            const application = {
                apartmentId: formData.apartmentId,
                applicantName: formData.applicantName,
                phone: formatNigerianPhone(formData.phone),
                email: formData.email || '',
                preferredContact: formData.preferredContact,
                currentAddress: formData.currentAddress,
                employmentStatus: formData.employmentStatus,
                moveInDate: formData.moveInDate,
                notes: formData.notes || ''
            };
            
            // Save application
            const savedApplication = addApplication(application);
            
            // Show success message
            showToast('Application submitted successfully!', 'success');
            
            // Reset form
            resetForm(form);
            
            // Refresh applications list
            loadMyApplications();
            
            // Show print option
            setTimeout(() => {
                if (confirm('Would you like to print your application for your records?')) {
                    showPrintModal(savedApplication);
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error submitting application:', error);
            showToast('Error submitting application. Please try again.', 'error');
        } finally {
            hideLoading(submitBtn);
        }
    }, 1000);
}

function loadMyApplications() {
    const container = document.getElementById('applications-list');
    if (!container) return;
    
    const applications = getApplications().sort((a, b) => b.createdAt - a.createdAt);
    
    if (applications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="ri-file-list-3-line"></i>
                <h4>No Applications Yet</h4>
                <p>Your submitted applications will appear here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = applications.map(app => renderApplicationCard(app)).join('');
    setupApplicationCards();
}

function renderApplicationCard(application) {
    const listing = getListing(application.apartmentId);
    const propertyTitle = listing ? listing.title : application.apartmentSnapshot?.title || 'Property Not Found';
    const propertyArea = listing ? listing.area : application.apartmentSnapshot?.area || '';
    const propertyPrice = listing ? listing.price : application.apartmentSnapshot?.price || 0;
    
    return `
        <div class="application-card">
            <div class="application-header">
                <div class="application-property">${propertyTitle}</div>
                <div class="application-status status-${application.status.toLowerCase().replace(' ', '-')}">
                    ${application.status}
                </div>
            </div>
            <div class="application-details">
                <p><strong>Location:</strong> ${propertyArea}</p>
                <p><strong>Price:</strong> ₦${propertyPrice.toLocaleString()}/year</p>
                <p><strong>Applied:</strong> ${formatDate(application.createdAt)}</p>
                <p><strong>Move-in Date:</strong> ${new Date(application.moveInDate).toLocaleDateString()}</p>
                <p><strong>Contact Preference:</strong> ${application.preferredContact}</p>
            </div>
            <div class="application-actions">
                <button class="btn btn-outline btn-small print-application-btn" data-application-id="${application.id}">
                    <i class="ri-printer-line"></i>
                    Print
                </button>
                ${listing ? `
                    <a href="/listings.html#listing-${listing.id}" class="btn btn-outline btn-small">
                        <i class="ri-eye-line"></i>
                        View Property
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

function setupApplicationCards() {
    document.querySelectorAll('.print-application-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const applicationId = this.dataset.applicationId;
            const application = getApplication(applicationId);
            if (application) {
                showPrintModal(application);
            }
        });
    });
}

function setupRefreshButton() {
    const refreshBtn = document.getElementById('refresh-applications');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            showLoading(this, 'Refreshing...');
            
            setTimeout(() => {
                loadMyApplications();
                hideLoading(this);
                showToast('Applications refreshed', 'success', 2000);
            }, 500);
        });
    }
}

function showPrintModal(application) {
    const modal = document.getElementById('print-modal');
    const printContent = document.getElementById('print-content');
    
    if (!modal || !printContent) return;
    
    const listing = getListing(application.apartmentId);
    const agent = listing ? getAgent(listing.agentId) : null;
    
    printContent.innerHTML = generatePrintContent(application, listing, agent);
    
    openModal(modal);
}

function generatePrintContent(application, listing, agent) {
    const propertyTitle = listing ? listing.title : application.apartmentSnapshot?.title || 'Property Not Found';
    const propertyArea = listing ? listing.area : application.apartmentSnapshot?.area || '';
    const propertyPrice = listing ? listing.price : application.apartmentSnapshot?.price || 0;
    
    return `
        <div class="print-application">
            <div class="print-header">
                <div class="print-logo">
                    <div class="nav-logo"></div>
                    <h2>Warri Apartment Hunt</h2>
                </div>
                <div class="print-date">
                    Application Date: ${formatDate(application.createdAt)}
                </div>
            </div>
            
            <h3>Apartment Application</h3>
            
            <div class="print-section">
                <h4>Property Information</h4>
                <table class="print-table">
                    <tr>
                        <td><strong>Property Name:</strong></td>
                        <td>${propertyTitle}</td>
                    </tr>
                    <tr>
                        <td><strong>Location:</strong></td>
                        <td>${propertyArea}, Warri, Delta State</td>
                    </tr>
                    <tr>
                        <td><strong>Annual Rent:</strong></td>
                        <td>₦${propertyPrice.toLocaleString()}</td>
                    </tr>
                    ${listing ? `
                        <tr>
                            <td><strong>Property Type:</strong></td>
                            <td>${listing.type}</td>
                        </tr>
                        <tr>
                            <td><strong>Bedrooms:</strong></td>
                            <td>${listing.bedrooms}</td>
                        </tr>
                        <tr>
                            <td><strong>Bathrooms:</strong></td>
                            <td>${listing.bathrooms}</td>
                        </tr>
                    ` : ''}
                </table>
            </div>
            
            <div class="print-section">
                <h4>Applicant Information</h4>
                <table class="print-table">
                    <tr>
                        <td><strong>Full Name:</strong></td>
                        <td>${application.applicantName}</td>
                    </tr>
                    <tr>
                        <td><strong>Phone Number:</strong></td>
                        <td>${application.phone}</td>
                    </tr>
                    <tr>
                        <td><strong>Email:</strong></td>
                        <td>${application.email || 'Not provided'}</td>
                    </tr>
                    <tr>
                        <td><strong>Preferred Contact:</strong></td>
                        <td>${application.preferredContact}</td>
                    </tr>
                    <tr>
                        <td><strong>Current Address:</strong></td>
                        <td>${application.currentAddress}</td>
                    </tr>
                    <tr>
                        <td><strong>Employment Status:</strong></td>
                        <td>${application.employmentStatus}</td>
                    </tr>
                    <tr>
                        <td><strong>Proposed Move-in Date:</strong></td>
                        <td>${new Date(application.moveInDate).toLocaleDateString()}</td>
                    </tr>
                </table>
            </div>
            
            ${application.notes ? `
                <div class="print-section">
                    <h4>Additional Notes</h4>
                    <p>${application.notes}</p>
                </div>
            ` : ''}
            
            ${agent ? `
                <div class="print-section">
                    <h4>Agent Information</h4>
                    <table class="print-table">
                        <tr>
                            <td><strong>Agent Name:</strong></td>
                            <td>${agent.name}</td>
                        </tr>
                        <tr>
                            <td><strong>Phone:</strong></td>
                            <td>${agent.phone}</td>
                        </tr>
                        <tr>
                            <td><strong>WhatsApp:</strong></td>
                            <td>${agent.whatsapp}</td>
                        </tr>
                    </table>
                </div>
            ` : ''}
            
            <div class="print-section">
                <h4>Application Status</h4>
                <p><strong>Current Status:</strong> <span class="status-${application.status.toLowerCase().replace(' ', '-')}">${application.status}</span></p>
                <p><strong>Application ID:</strong> ${application.id}</p>
            </div>
            
            <div class="print-footer">
                <p><strong>Warri Apartment Hunt</strong></p>
                <p>Warri, Delta State, Nigeria</p>
                <p>All agent fees are Fixed, affordable and fair, no extra cost!</p>
            </div>
        </div>
        
        <style>
            @media print {
                .print-application {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    color: #000;
                }
                
                .print-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #4B0082;
                    padding-bottom: 15px;
                }
                
                .print-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .print-logo .nav-logo {
                    width: 40px;
                    height: 40px;
                    background: #4B0082;
                    border-radius: 8px;
                }
                
                .print-section {
                    margin-bottom: 25px;
                }
                
                .print-section h4 {
                    color: #4B0082;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                    margin-bottom: 15px;
                }
                
                .print-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .print-table td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #eee;
                    vertical-align: top;
                }
                
                .print-table td:first-child {
                    width: 200px;
                    background: #f8f9fa;
                }
                
                .print-footer {
                    margin-top: 40px;
                    text-align: center;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                    color: #666;
                }
                
                .status-submitted { color: #f59e0b; }
                .status-reviewed { color: #3b82f6; }
                .status-approved { color: #16a34a; }
                .status-rejected { color: #ef4444; }
            }
        </style>
    `;
}

// Export apply functions
window.apply = {
    setupApplyPage,
    populateApartmentSelect,
    loadMyApplications,
    showPrintModal
};