// Storage utility functions for Warri Apartment Hunt

function initializeStorage() {
    // Initialize with seed data if empty
    if (!localStorage.getItem('rentListings')) {
        const seedRentListings = [
            {
                id: "apt_001",
                title: "Grace Court Apartments",
                description: "Newly built 2BR apartment in Airport Road with secure parking, borehole water, and 24/7 security. Modern fittings and spacious rooms perfect for professionals and families.",
                area: "Airport Road",
                city: "Warri",
                state: "Delta State",
                price: 1200000,
                type: "2BR",
                bedrooms: 2,
                bathrooms: 2,
                sizeSqm: 90,
                leadImageUrl: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
                imageUrls: [
                    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800"
                ],
                agentId: "agt_001",
                available: true,
                createdAt: Date.now() - 86400000
            },
            {
                id: "apt_002",
                title: "Executive Lodge",
                description: "Luxury 3BR duplex in Effurun featuring modern kitchen, spacious living area, and private garden. Ideal for executives and families seeking comfort.",
                area: "Effurun",
                city: "Warri",
                state: "Delta State",
                price: 1800000,
                type: "3BR",
                bedrooms: 3,
                bathrooms: 3,
                sizeSqm: 120,
                leadImageUrl: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800",
                imageUrls: [
                    "https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1571475/pexels-photo-1571475.jpeg?auto=compress&cs=tinysrgb&w=800"
                ],
                agentId: "agt_002",
                available: true,
                createdAt: Date.now() - 172800000
            },
            {
                id: "apt_003",
                title: "Comfort Suites",
                description: "Affordable 1BR apartment in Jakpa area with good ventilation and easy access to major roads. Perfect for young professionals starting their career.",
                area: "Jakpa",
                city: "Warri",
                state: "Delta State",
                price: 800000,
                type: "1BR",
                bedrooms: 1,
                bathrooms: 1,
                sizeSqm: 60,
                leadImageUrl: "https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=800",
                imageUrls: [
                    "https://images.pexels.com/photos/1643385/pexels-photo-1643385.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1571466/pexels-photo-1571466.jpeg?auto=compress&cs=tinysrgb&w=800"
                ],
                agentId: "agt_001",
                available: true,
                createdAt: Date.now() - 259200000
            },
            {
                id: "apt_004",
                title: "Royal Heights",
                description: "Spacious self-contain apartment in PTI with modern amenities including fitted kitchen and wardrobe. Close to shopping centers and transport.",
                area: "PTI",
                city: "Warri",
                state: "Delta State",
                price: 600000,
                type: "Self-contain",
                bedrooms: 1,
                bathrooms: 1,
                sizeSqm: 45,
                leadImageUrl: "https://images.pexels.com/photos/1643387/pexels-photo-1643387.jpeg?auto=compress&cs=tinysrgb&w=800",
                imageUrls: [
                    "https://images.pexels.com/photos/1571469/pexels-photo-1571469.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1643388/pexels-photo-1643388.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1571472/pexels-photo-1571472.jpeg?auto=compress&cs=tinysrgb&w=800"
                ],
                agentId: "agt_003",
                available: true,
                createdAt: Date.now() - 345600000
            },
            {
                id: "apt_005",
                title: "Garden View Apartments",
                description: "Beautiful 2BR apartment in Ugborikoko with garden view and adequate parking space. Family-friendly environment with good security.",
                area: "Ugborikoko",
                city: "Warri",
                state: "Delta State",
                price: 1000000,
                type: "2BR",
                bedrooms: 2,
                bathrooms: 2,
                sizeSqm: 85,
                leadImageUrl: "https://images.pexels.com/photos/1571473/pexels-photo-1571473.jpeg?auto=compress&cs=tinysrgb&w=800",
                imageUrls: [
                    "https://images.pexels.com/photos/1643390/pexels-photo-1643390.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1571474/pexels-photo-1571474.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1643391/pexels-photo-1643391.jpeg?auto=compress&cs=tinysrgb&w=800"
                ],
                agentId: "agt_002",
                available: true,
                createdAt: Date.now() - 432000000
            },
            {
                id: "apt_006",
                title: "Peace Haven",
                description: "Cozy mini-flat in Ekpan with all modern conveniences. Quiet neighborhood perfect for students and young couples. Affordable and well-maintained.",
                area: "Ekpan",
                city: "Warri",
                state: "Delta State",
                price: 700000,
                type: "Mini-flat",
                bedrooms: 1,
                bathrooms: 1,
                sizeSqm: 50,
                leadImageUrl: "https://images.pexels.com/photos/1571476/pexels-photo-1571476.jpeg?auto=compress&cs=tinysrgb&w=800",
                imageUrls: [
                    "https://images.pexels.com/photos/1643392/pexels-photo-1643392.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1571477/pexels-photo-1571477.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1643393/pexels-photo-1643393.jpeg?auto=compress&cs=tinysrgb&w=800"
                ],
                agentId: "agt_003",
                available: true,
                createdAt: Date.now() - 518400000
            }
        ];
        
        localStorage.setItem('rentListings', JSON.stringify(seedRentListings));
    }
    
    // Initialize sale listings
    if (!localStorage.getItem('saleListings')) {
        const seedSaleListings = [
            {
                id: "sale_001",
                title: "Executive Bungalow",
                description: "Beautifully designed 3BR bungalow for sale in Airport Road. Features modern architecture, spacious compound, and premium location.",
                area: "Airport Road",
                city: "Warri",
                state: "Delta State",
                price: 25000000,
                type: "Bungalow",
                bedrooms: 3,
                bathrooms: 3,
                sizeSqm: 150,
                leadImageUrl: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
                imageUrls: [
                    "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1396139/pexels-photo-1396139.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1396140/pexels-photo-1396140.jpeg?auto=compress&cs=tinysrgb&w=800"
                ],
                agentId: "agt_001",
                available: true,
                createdAt: Date.now() - 259200000
            },
            {
                id: "sale_002",
                title: "Luxury Duplex",
                description: "Modern 4BR duplex in Effurun with swimming pool and garden. Premium finishing and excellent location for investment or personal use.",
                area: "Effurun",
                city: "Warri",
                state: "Delta State",
                price: 45000000,
                type: "Duplex",
                bedrooms: 4,
                bathrooms: 4,
                sizeSqm: 200,
                leadImageUrl: "https://images.pexels.com/photos/1396137/pexels-photo-1396137.jpeg?auto=compress&cs=tinysrgb&w=800",
                imageUrls: [
                    "https://images.pexels.com/photos/1396141/pexels-photo-1396141.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1396142/pexels-photo-1396142.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1396143/pexels-photo-1396143.jpeg?auto=compress&cs=tinysrgb&w=800"
                ],
                agentId: "agt_002",
                available: true,
                createdAt: Date.now() - 345600000
            },
            {
                id: "sale_003",
                title: "Family Home",
                description: "Well-built 3BR apartment for sale in Ugborikoko. Great for families looking for their own home with good access roads and amenities.",
                area: "Ugborikoko",
                city: "Warri",
                state: "Delta State",
                price: 18000000,
                type: "3BR",
                bedrooms: 3,
                bathrooms: 2,
                sizeSqm: 120,
                leadImageUrl: "https://images.pexels.com/photos/1396144/pexels-photo-1396144.jpeg?auto=compress&cs=tinysrgb&w=800",
                imageUrls: [
                    "https://images.pexels.com/photos/1396145/pexels-photo-1396145.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1396146/pexels-photo-1396146.jpeg?auto=compress&cs=tinysrgb&w=800"
                ],
                agentId: "agt_003",
                available: true,
                createdAt: Date.now() - 432000000
            }
        ];
        
        localStorage.setItem('saleListings', JSON.stringify(seedSaleListings));
    }
    
    // Initialize agents
    if (!localStorage.getItem('agents')) {
        const seedAgents = [
            {
                id: "agt_001",
                name: "Mr. Tega Okoro",
                avatarUrl: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
                phone: "+2348012345678",
                whatsapp: "+2348012345678",
                areasCovered: ["Warri", "Airport Road", "Effurun", "Jakpa"],
                bio: "Experienced real estate agent specializing in mid-market apartments and swift inspections. Over 5 years helping families find their perfect homes in Warri."
            },
            {
                id: "agt_002",
                name: "Mrs. Grace Emuobo",
                avatarUrl: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
                phone: "+2348087654321",
                whatsapp: "+2348087654321",
                areasCovered: ["Effurun", "Ugborikoko", "Ekete", "Udu"],
                bio: "Professional real estate consultant with expertise in luxury properties and investment opportunities. Committed to providing exceptional service to clients."
            },
            {
                id: "agt_003",
                name: "Mr. Samuel Ovbije",
                avatarUrl: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
                phone: "+2348098765432",
                whatsapp: "+2348098765432",
                areasCovered: ["PTI", "Ekpan", "Okuokoko", "Warri"],
                bio: "Young and dynamic agent focused on affordable housing solutions for students and young professionals. Quick response time and flexible viewing schedules."
            }
        ];
        
        localStorage.setItem('agents', JSON.stringify(seedAgents));
    }
    
    // Initialize empty arrays for other data if not present
    if (!localStorage.getItem('applications')) {
        localStorage.setItem('applications', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('inspections')) {
        localStorage.setItem('inspections', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('supportTickets')) {
        localStorage.setItem('supportTickets', JSON.stringify([]));
    }
}

// Rental listings functions
function getListings() {
    return JSON.parse(localStorage.getItem('rentListings') || '[]');
}

function getListing(id) {
    const listings = getListings();
    return listings.find(listing => listing.id === id);
}

function saveListings(listings) {
    localStorage.setItem('rentListings', JSON.stringify(listings));
    window.dispatchEvent(new CustomEvent('storageUpdated', {
        detail: { keys: ['rentListings'] }
    }));
}

function addListing(listing) {
    const listings = getListings();
    listing.id = 'apt_' + Date.now();
    listing.createdAt = Date.now();
    listings.push(listing);
    saveListings(listings);
    return listing;
}

function updateListing(id, updates) {
    const listings = getListings();
    const index = listings.findIndex(listing => listing.id === id);
    if (index !== -1) {
        listings[index] = { ...listings[index], ...updates };
        saveListings(listings);
        return listings[index];
    }
    return null;
}

function deleteListing(id) {
    const listings = getListings();
    const filtered = listings.filter(listing => listing.id !== id);
    saveListings(filtered);
}

// Sale listings functions
function getSaleListings() {
    return JSON.parse(localStorage.getItem('saleListings') || '[]');
}

function getSaleListing(id) {
    const listings = getSaleListings();
    return listings.find(listing => listing.id === id);
}

function saveSaleListings(listings) {
    localStorage.setItem('saleListings', JSON.stringify(listings));
    window.dispatchEvent(new CustomEvent('storageUpdated', {
        detail: { keys: ['saleListings'] }
    }));
}

function addSaleListing(listing) {
    const listings = getSaleListings();
    listing.id = 'sale_' + Date.now();
    listing.createdAt = Date.now();
    listings.push(listing);
    saveSaleListings(listings);
    return listing;
}

function updateSaleListing(id, updates) {
    const listings = getSaleListings();
    const index = listings.findIndex(listing => listing.id === id);
    if (index !== -1) {
        listings[index] = { ...listings[index], ...updates };
        saveSaleListings(listings);
        return listings[index];
    }
    return null;
}

function deleteSaleListing(id) {
    const listings = getSaleListings();
    const filtered = listings.filter(listing => listing.id !== id);
    saveSaleListings(filtered);
}

// Agents functions
function getAgents() {
    return JSON.parse(localStorage.getItem('agents') || '[]');
}

function getAgent(id) {
    const agents = getAgents();
    return agents.find(agent => agent.id === id);
}

function saveAgents(agents) {
    localStorage.setItem('agents', JSON.stringify(agents));
    window.dispatchEvent(new CustomEvent('storageUpdated', {
        detail: { keys: ['agents'] }
    }));
}

function addAgent(agent) {
    const agents = getAgents();
    agent.id = 'agt_' + Date.now();
    agents.push(agent);
    saveAgents(agents);
    return agent;
}

function updateAgent(id, updates) {
    const agents = getAgents();
    const index = agents.findIndex(agent => agent.id === id);
    if (index !== -1) {
        agents[index] = { ...agents[index], ...updates };
        saveAgents(agents);
        return agents[index];
    }
    return null;
}

function deleteAgent(id) {
    const agents = getAgents();
    const filtered = agents.filter(agent => agent.id !== id);
    saveAgents(filtered);
}

// Applications functions
function getApplications() {
    return JSON.parse(localStorage.getItem('applications') || '[]');
}

function getApplication(id) {
    const applications = getApplications();
    return applications.find(app => app.id === id);
}

function saveApplications(applications) {
    localStorage.setItem('applications', JSON.stringify(applications));
    window.dispatchEvent(new CustomEvent('storageUpdated', {
        detail: { keys: ['applications'] }
    }));
}

function addApplication(application) {
    const applications = getApplications();
    application.id = 'app_' + Date.now();
    application.createdAt = Date.now();
    application.status = application.status || 'Submitted';
    
    // Store apartment snapshot
    const listing = getListing(application.apartmentId);
    if (listing) {
        application.apartmentSnapshot = {
            title: listing.title,
            area: listing.area,
            price: listing.price,
            agentId: listing.agentId
        };
    }
    
    applications.push(application);
    saveApplications(applications);
    return application;
}

function updateApplicationStatus(id, status) {
    const applications = getApplications();
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
        applications[index].status = status;
        saveApplications(applications);
        return applications[index];
    }
    return null;
}

// Inspections functions
function getInspections() {
    return JSON.parse(localStorage.getItem('inspections') || '[]');
}

function saveInspections(inspections) {
    localStorage.setItem('inspections', JSON.stringify(inspections));
    window.dispatchEvent(new CustomEvent('storageUpdated', {
        detail: { keys: ['inspections'] }
    }));
}

function addInspection(inspection) {
    const inspections = getInspections();
    inspection.id = 'insp_' + Date.now();
    inspection.createdAt = Date.now();
    inspection.status = inspection.status || 'Pending';
    
    // Store apartment title for reference
    const listing = getListing(inspection.apartmentId);
    if (listing) {
        inspection.apartmentTitle = listing.title;
    }
    
    inspections.push(inspection);
    saveInspections(inspections);
    return inspection;
}

function updateInspectionStatus(id, status) {
    const inspections = getInspections();
    const index = inspections.findIndex(insp => insp.id === id);
    if (index !== -1) {
        inspections[index].status = status;
        saveInspections(inspections);
        return inspections[index];
    }
    return null;
}

// Support tickets functions
function getSupportTickets() {
    return JSON.parse(localStorage.getItem('supportTickets') || '[]');
}

function saveSupportTickets(tickets) {
    localStorage.setItem('supportTickets', JSON.stringify(tickets));
    window.dispatchEvent(new CustomEvent('storageUpdated', {
        detail: { keys: ['supportTickets'] }
    }));
}

function addSupportTicket(ticket) {
    const tickets = getSupportTickets();
    ticket.id = 'sup_' + Date.now();
    ticket.createdAt = Date.now();
    tickets.push(ticket);
    saveSupportTickets(tickets);
    return ticket;
}

// Statistics functions
function getStats() {
    const rentListings = getListings();
    const saleListings = getSaleListings();
    const agents = getAgents();
    const applications = getApplications();
    const inspections = getInspections();
    const supportTickets = getSupportTickets();
    
    const availableRentListings = rentListings.filter(l => l.available);
    const availableSaleListings = saleListings.filter(l => l.available);
    
    const totalPriceRent = availableRentListings.reduce((sum, l) => sum + l.price, 0);
    const avgPriceRent = availableRentListings.length > 0 ? Math.round(totalPriceRent / availableRentListings.length) : 0;
    
    const recentApplications = applications.filter(app => 
        Date.now() - app.createdAt < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    );
    
    return {
        totalRentListings: rentListings.length,
        availableRentListings: availableRentListings.length,
        totalSaleListings: saleListings.length,
        availableSaleListings: availableSaleListings.length,
        totalAgents: agents.length,
        totalApplications: applications.length,
        totalInspections: inspections.length,
        totalSupportTickets: supportTickets.length,
        avgPriceRent: avgPriceRent,
        recentApplications: recentApplications.length
    };
}

// Export functions for use in other modules
window.storage = {
    initializeStorage,
    
    // Rental listings
    getListings,
    getListing,
    addListing,
    updateListing,
    deleteListing,
    
    // Sale listings
    getSaleListings,
    getSaleListing,
    addSaleListing,
    updateSaleListing,
    deleteSaleListing,
    
    // Agents
    getAgents,
    getAgent,
    addAgent,
    updateAgent,
    deleteAgent,
    
    // Applications
    getApplications,
    getApplication,
    addApplication,
    updateApplicationStatus,
    
    // Inspections
    getInspections,
    addInspection,
    updateInspectionStatus,
    
    // Support tickets
    getSupportTickets,
    addSupportTicket,
    
    // Statistics
    getStats
};