// UI utility functions for Warri Apartment Hunt

// Navigation
function setupNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Modal management
function openModal(modal) {
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = modal.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (firstElement) firstElement.focus();
        
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function setupModalHandlers() {
    // Close modal when clicking backdrop or close button
    document.querySelectorAll('[data-modal-close]').forEach(element => {
        element.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

// Toast notifications
function showToast(message, type = 'success', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'ri-check-line' : 'ri-error-warning-line';
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${icon} toast-icon"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger reflow and show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Listing card rendering
function renderListingCard(listing, showDetails = false) {
    const agent = getAgent(listing.agentId);
    const detailsId = `details-${listing.id}`;
    
    return `
        <div class="listing-card">
            <div class="listing-image">
                <img src="${listing.leadImageUrl}" alt="${listing.title}" loading="lazy">
                <div class="listing-badge">${listing.available ? 'Available' : 'Unavailable'}</div>
            </div>
            <div class="listing-content">
                <h3 class="listing-title">${listing.title}</h3>
                <p class="listing-location">
                    <i class="ri-map-pin-line"></i>
                    ${listing.area}, ${listing.city}, ${listing.state}
                </p>
                <p class="listing-description">${listing.description.substring(0, 140)}${listing.description.length > 140 ? '...' : ''}</p>
                <div class="listing-price">₦${listing.price.toLocaleString()}/year</div>
                <div class="listing-specs">
                    <span class="spec-item">
                        <i class="ri-hotel-bed-line"></i>
                        ${listing.bedrooms} bed${listing.bedrooms !== 1 ? 's' : ''}
                    </span>
                    <span class="spec-item">
                        <i class="ri-drop-line"></i>
                        ${listing.bathrooms} bath${listing.bathrooms !== 1 ? 's' : ''}
                    </span>
                    ${listing.sizeSqm ? `<span class="spec-item"><i class="ri-ruler-line"></i>${listing.sizeSqm}m²</span>` : ''}
                </div>
                <div class="listing-agent">
                    <img src="${agent?.avatarUrl || '/assets/img/default-agent.jpg'}" alt="${agent?.name || 'Agent'}" class="agent-avatar">
                    <span class="agent-name">${agent?.name || 'N/A'}</span>
                </div>
                <div class="listing-actions">
                    <button class="btn btn-outline btn-small more-details-btn" 
                            data-listing-id="${listing.id}" 
                            data-target="${detailsId}"
                            aria-expanded="false"
                            aria-controls="${detailsId}">
                        <i class="ri-eye-line"></i>
                        More Details
                    </button>
                    <a href="/apply.html?apartmentId=${listing.id}" class="btn btn-primary btn-small">
                        <i class="ri-file-list-3-line"></i>
                        Apply
                    </a>
                </div>
                ${showDetails ? `
                    <div class="listing-details" id="${detailsId}">
                        <div class="listing-details-content">
                            ${renderListingDetails(listing, agent)}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function renderListingDetails(listing, agent) {
    const galleryImages = [listing.leadImageUrl, ...(listing.imageUrls || [])];
    
    return `
        <div class="details-gallery">
            <div class="gallery-main" data-gallery-images='${JSON.stringify(galleryImages)}'>
                <img src="${listing.leadImageUrl}" alt="${listing.title}" class="gallery-main-image">
            </div>
            <div class="gallery-thumbs">
                ${galleryImages.map((img, index) => `
                    <div class="gallery-thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <img src="${img}" alt="Gallery image ${index + 1}">
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="details-description">
            <h4>Description</h4>
            <p>${listing.description}</p>
        </div>
        
        <div class="details-specs">
            <div class="spec-card">
                <div class="spec-value">${listing.bedrooms}</div>
                <div class="spec-label">Bedroom${listing.bedrooms !== 1 ? 's' : ''}</div>
            </div>
            <div class="spec-card">
                <div class="spec-value">${listing.bathrooms}</div>
                <div class="spec-label">Bathroom${listing.bathrooms !== 1 ? 's' : ''}</div>
            </div>
            ${listing.sizeSqm ? `
                <div class="spec-card">
                    <div class="spec-value">${listing.sizeSqm}</div>
                    <div class="spec-label">Square Meters</div>
                </div>
            ` : ''}
            <div class="spec-card">
                <div class="spec-value">${listing.type}</div>
                <div class="spec-label">Property Type</div>
            </div>
        </div>
        
        <div class="details-agent">
            <div class="agent-profile">
                <img src="${agent?.avatarUrl || '/assets/img/default-agent.jpg'}" alt="${agent?.name || 'Agent'}" class="agent-avatar-large">
                <div class="agent-info">
                    <h4>${agent?.name || 'N/A'}</h4>
                    <p class="agent-phone">
                        <i class="ri-phone-line"></i>
                        ${agent?.phone || 'N/A'}
                    </p>
                    <p class="agent-whatsapp">
                        <i class="ri-whatsapp-line"></i>
                        WhatsApp Available
                    </p>
                </div>
            </div>
            <div class="agent-contact-actions">
                <a href="https://wa.me/${agent?.whatsapp?.replace('+', '')}?text=${encodeURIComponent(`Hello, I'm interested in ${listing.title}. Can we discuss?`)}" 
                   class="btn btn-primary btn-small" target="_blank">
                    <i class="ri-whatsapp-line"></i>
                    WhatsApp
                </a>
                <a href="tel:${agent?.phone}" class="btn btn-outline btn-small">
                    <i class="ri-phone-line"></i>
                    Call
                </a>
            </div>
        </div>
        
        <div class="details-actions">
            <button class="btn btn-primary schedule-inspection-btn" data-apartment-id="${listing.id}">
                <i class="ri-calendar-check-line"></i>
                Schedule Inspection
            </button>
            <a href="/apply.html?apartmentId=${listing.id}" class="btn btn-outline">
                <i class="ri-file-list-3-line"></i>
                Apply Now
            </a>
        </div>
    `;
}

// Sale listing card rendering
function renderSaleListingCard(listing) {
    const agent = getAgent(listing.agentId);
    
    return `
        <div class="listing-card">
            <div class="listing-image">
                <img src="${listing.leadImageUrl}" alt="${listing.title}" loading="lazy">
                <div class="listing-badge sale-badge">For Sale</div>
            </div>
            <div class="listing-content">
                <h3 class="listing-title">${listing.title}</h3>
                <p class="listing-location">
                    <i class="ri-map-pin-line"></i>
                    ${listing.area}, ${listing.city}, ${listing.state}
                </p>
                <p class="listing-description">${listing.description.substring(0, 140)}${listing.description.length > 140 ? '...' : ''}</p>
                <div class="listing-price">₦${listing.price.toLocaleString()}</div>
                <div class="listing-specs">
                    <span class="spec-item">
                        <i class="ri-hotel-bed-line"></i>
                        ${listing.bedrooms} bed${listing.bedrooms !== 1 ? 's' : ''}
                    </span>
                    <span class="spec-item">
                        <i class="ri-drop-line"></i>
                        ${listing.bathrooms} bath${listing.bathrooms !== 1 ? 's' : ''}
                    </span>
                    ${listing.sizeSqm ? `<span class="spec-item"><i class="ri-ruler-line"></i>${listing.sizeSqm}m²</span>` : ''}
                </div>
                <div class="listing-agent">
                    <img src="${agent?.avatarUrl || '/assets/img/default-agent.jpg'}" alt="${agent?.name || 'Agent'}" class="agent-avatar">
                    <span class="agent-name">${agent?.name || 'N/A'}</span>
                </div>
                <div class="listing-actions">
                    <button class="btn btn-primary contact-agent-btn" data-listing-id="${listing.id}">
                        <i class="ri-user-3-line"></i>
                        Contact Agent
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Setup listing card interactions
function setupListingCards() {
    // More details toggle
    document.querySelectorAll('.more-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const details = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (details.classList.contains('open')) {
                details.classList.remove('open');
                this.setAttribute('aria-expanded', 'false');
                icon.className = 'ri-eye-line';
                this.innerHTML = '<i class="ri-eye-line"></i> More Details';
            } else {
                details.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
                icon.className = 'ri-eye-close-line';
                this.innerHTML = '<i class="ri-eye-close-line"></i> Less Details';
            }
        });
    });
    
    // Gallery interactions
    document.querySelectorAll('.gallery-main').forEach(gallery => {
        gallery.addEventListener('click', function() {
            const images = JSON.parse(this.dataset.galleryImages);
            openGalleryModal(images, 0);
        });
    });
    
    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const gallery = this.closest('.details-gallery').querySelector('.gallery-main');
            const images = JSON.parse(gallery.dataset.galleryImages);
            const mainImg = gallery.querySelector('.gallery-main-image');
            
            // Update main image
            mainImg.src = images[index];
            
            // Update active thumb
            this.parentElement.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Schedule inspection buttons
    document.querySelectorAll('.schedule-inspection-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const apartmentId = this.dataset.apartmentId;
            openScheduleInspectionModal(apartmentId);
        });
    });
}

// Gallery modal
function openGalleryModal(images, startIndex = 0) {
    const modal = document.getElementById('gallery-modal');
    const mainImage = document.getElementById('gallery-main-image');
    const thumbsContainer = document.getElementById('gallery-thumbs');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    
    if (!modal) return;
    
    let currentIndex = startIndex;
    
    // Set up images
    appState.setGalleryImages(images);
    appState.setImageIndex(startIndex);
    
    // Update display
    function updateGallery() {
        const currentImage = appState.getCurrentImage();
        mainImage.src = currentImage;
        
        // Update thumbnails
        thumbsContainer.innerHTML = images.map((img, index) => `
            <div class="gallery-thumb ${index === appState.currentImageIndex ? 'active' : ''}" data-index="${index}">
                <img src="${img}" alt="Gallery image ${index + 1}">
            </div>
        `).join('');
        
        // Setup thumb clicks
        thumbsContainer.querySelectorAll('.gallery-thumb').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                appState.setImageIndex(index);
                updateGallery();
            });
        });
    }
    
    // Navigation
    prevBtn.onclick = () => {
        appState.prevImage();
        updateGallery();
    };
    
    nextBtn.onclick = () => {
        appState.nextImage();
        updateGallery();
    };
    
    // Keyboard navigation
    const keyHandler = (e) => {
        if (e.key === 'ArrowLeft') {
            appState.prevImage();
            updateGallery();
        } else if (e.key === 'ArrowRight') {
            appState.nextImage();
            updateGallery();
        }
    };
    
    document.addEventListener('keydown', keyHandler);
    
    // Cleanup when modal closes
    const modalCloseHandler = () => {
        document.removeEventListener('keydown', keyHandler);
        modal.removeEventListener('click', modalCloseHandler);
    };
    
    modal.addEventListener('click', modalCloseHandler, { once: true });
    
    updateGallery();
    openModal(modal);
}

// Schedule inspection modal
function openScheduleInspectionModal(apartmentId) {
    const modal = document.getElementById('inspection-modal');
    const apartmentIdInput = document.getElementById('inspection-apartment-id');
    const dateInput = document.getElementById('inspection-date');
    
    if (modal && apartmentIdInput) {
        apartmentIdInput.value = apartmentId;
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        openModal(modal);
    }
}

// Form validation utilities
function validateNigerianPhone(phone) {
    // Nigerian phone number patterns
    const patterns = [
        /^\+234[0-9]{10}$/, // +234XXXXXXXXXX
        /^234[0-9]{10}$/, // 234XXXXXXXXXX
        /^0[0-9]{10}$/, // 0XXXXXXXXXX
    ];
    
    return patterns.some(pattern => pattern.test(phone));
}

function formatNigerianPhone(phone) {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (digits.startsWith('234') && digits.length === 13) {
        return '+' + digits;
    } else if (digits.startsWith('0') && digits.length === 11) {
        return '+234' + digits.substring(1);
    } else if (digits.length === 10) {
        return '+234' + digits;
    }
    
    return phone; // Return original if can't format
}

function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatDateTime(timestamp) {
    return new Date(timestamp).toLocaleString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function truncateText(text, length = 100) {
    return text.length > length ? text.substring(0, length) + '...' : text;
}

// Form utilities
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        if (data[key]) {
            //  Handle multiple values (checkboxes)
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

function resetForm(form) {
    form.reset();
    
    // Clear any custom validation states
    form.querySelectorAll('.form-input, .form-select').forEach(input => {
        input.classList.remove('error', 'success');
    });
    
    // Clear any error messages
    form.querySelectorAll('.error-message').forEach(msg => {
        msg.remove();
    });
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--danger)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Loading states
function showLoading(element, text = 'Loading...') {
    const originalContent = element.innerHTML;
    element.dataset.originalContent = originalContent;
    element.innerHTML = `<i class="ri-loader-4-line" style="animation: spin 1s linear infinite;"></i> ${text}`;
    element.disabled = true;
}

function hideLoading(element) {
    const originalContent = element.dataset.originalContent;
    if (originalContent) {
        element.innerHTML = originalContent;
        delete element.dataset.originalContent;
    }
    element.disabled = false;
}

// Initialize UI components
document.addEventListener('DOMContentLoaded', function() {
    setupModalHandlers();
});

// Export UI functions
window.ui = {
    setupNavigation,
    openModal,
    closeModal,
    showToast,
    renderListingCard,
    renderSaleListingCard,
    setupListingCards,
    openGalleryModal,
    openScheduleInspectionModal,
    validateNigerianPhone,
    formatNigerianPhone,
    validateEmail,
    formatCurrency,
    formatDate,
    formatDateTime,
    truncateText,
    getFormData,
    resetForm,
    showFieldError,
    clearFieldError,
    showLoading,
    hideLoading
};