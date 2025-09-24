// State management for Warri Apartment Hunt
// This file provides reactive state management and derived data

class AppState {
    constructor() {
        this.searchFilters = {
            location: '',
            bedrooms: '',
            minBudget: '',
            maxBudget: '',
            type: '',
            available: true
        };
        
        this.currentSort = 'newest';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        
        this.selectedListing = null;
        this.galleryImages = [];
        this.currentImageIndex = 0;
        
        this.cache = {
            filteredListings: null,
            searchTerm: null
        };
        
        // Listen for storage updates to invalidate cache
        window.addEventListener('storageUpdated', (event) => {
            if (event.detail.keys.includes('rentListings') || event.detail.keys.includes('saleListings')) {
                this.invalidateCache();
            }
        });
    }
    
    // Cache management
    invalidateCache() {
        this.cache.filteredListings = null;
        this.cache.searchTerm = null;
    }
    
    // Search and filter functions
    updateSearchFilters(filters) {
        this.searchFilters = { ...this.searchFilters, ...filters };
        this.invalidateCache();
        this.currentPage = 1; // Reset to first page when filters change
    }
    
    clearSearchFilters() {
        this.searchFilters = {
            location: '',
            bedrooms: '',
            minBudget: '',
            maxBudget: '',
            type: '',
            available: true
        };
        this.invalidateCache();
        this.currentPage = 1;
    }
    
    updateSort(sortBy) {
        this.currentSort = sortBy;
        this.invalidateCache();
    }
    
    // Listing filtering with caching
    getFilteredListings(listingType = 'rent') {
        const cacheKey = `${listingType}_${JSON.stringify(this.searchFilters)}_${this.currentSort}`;
        
        if (this.cache.searchTerm === cacheKey && this.cache.filteredListings) {
            return this.cache.filteredListings;
        }
        
        let listings = listingType === 'rent' ? getListings() : getSaleListings();
        
        // Apply filters
        listings = this.applyFilters(listings);
        
        // Apply sort
        listings = this.applySort(listings);
        
        // Cache results
        this.cache.filteredListings = listings;
        this.cache.searchTerm = cacheKey;
        
        return listings;
    }
    
    applyFilters(listings) {
        return listings.filter(listing => {
            // Location filter
            if (this.searchFilters.location && listing.area !== this.searchFilters.location) {
                return false;
            }
            
            // Bedrooms filter
            if (this.searchFilters.bedrooms) {
                const filterBeds = parseInt(this.searchFilters.bedrooms);
                if (filterBeds === 3 && listing.bedrooms < 3) return false;
                if (filterBeds !== 3 && listing.bedrooms !== filterBeds) return false;
            }
            
            // Budget filters
            if (this.searchFilters.minBudget) {
                const minBudget = parseInt(this.searchFilters.minBudget);
                if (listing.price < minBudget) return false;
            }
            
            if (this.searchFilters.maxBudget) {
                const maxBudget = parseInt(this.searchFilters.maxBudget);
                if (listing.price > maxBudget) return false;
            }
            
            // Type filter
            if (this.searchFilters.type && listing.type !== this.searchFilters.type) {
                return false;
            }
            
            // Available filter
            if (this.searchFilters.available && !listing.available) {
                return false;
            }
            
            return true;
        });
    }
    
    applySort(listings) {
        const sorted = [...listings];
        
        switch (this.currentSort) {
            case 'newest':
                return sorted.sort((a, b) => b.createdAt - a.createdAt);
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'bedrooms-asc':
                return sorted.sort((a, b) => a.bedrooms - b.bedrooms);
            case 'bedrooms-desc':
                return sorted.sort((a, b) => b.bedrooms - a.bedrooms);
            case 'area':
                return sorted.sort((a, b) => a.area.localeCompare(b.area));
            default:
                return sorted;
        }
    }
    
    // Pagination
    getPaginatedListings(listingType = 'rent') {
        const allFiltered = this.getFilteredListings(listingType);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        
        return {
            listings: allFiltered.slice(startIndex, endIndex),
            totalItems: allFiltered.length,
            currentPage: this.currentPage,
            totalPages: Math.ceil(allFiltered.length / this.itemsPerPage),
            hasNextPage: endIndex < allFiltered.length,
            hasPrevPage: this.currentPage > 1
        };
    }
    
    setPage(page) {
        this.currentPage = Math.max(1, page);
    }
    
    nextPage() {
        const paginated = this.getPaginatedListings();
        if (paginated.hasNextPage) {
            this.currentPage++;
        }
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }
    
    // Derived data functions
    getUniqueLocations(listingType = 'rent') {
        const listings = listingType === 'rent' ? getListings() : getSaleListings();
        const locations = [...new Set(listings.map(l => l.area))];
        return locations.sort();
    }
    
    getUniqueTypes(listingType = 'rent') {
        const listings = listingType === 'rent' ? getListings() : getSaleListings();
        const types = [...new Set(listings.map(l => l.type))];
        return types.sort();
    }
    
    getPriceRange(listingType = 'rent') {
        const listings = listingType === 'rent' ? getListings() : getSaleListings();
        if (listings.length === 0) return { min: 0, max: 0 };
        
        const prices = listings.map(l => l.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
            avg: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
        };
    }
    
    getBedroomCounts(listingType = 'rent') {
        const listings = listingType === 'rent' ? getListings() : getSaleListings();
        const counts = {};
        
        listings.forEach(listing => {
            const beds = listing.bedrooms;
            const key = beds >= 3 ? '3+' : beds.toString();
            counts[key] = (counts[key] || 0) + 1;
        });
        
        return counts;
    }
    
    // Agent-related derived data
    getAgentListings(agentId, listingType = 'rent') {
        const listings = listingType === 'rent' ? getListings() : getSaleListings();
        return listings.filter(l => l.agentId === agentId && l.available);
    }
    
    getAgentStats(agentId) {
        const rentListings = this.getAgentListings(agentId, 'rent');
        const saleListings = this.getAgentListings(agentId, 'sale');
        const applications = getApplications().filter(app => {
            const listing = getListing(app.apartmentId);
            return listing && listing.agentId === agentId;
        });
        
        return {
            activeRentListings: rentListings.length,
            activeSaleListings: saleListings.length,
            totalApplications: applications.length,
            averageRentPrice: rentListings.length > 0 
                ? Math.round(rentListings.reduce((sum, l) => sum + l.price, 0) / rentListings.length)
                : 0
        };
    }
    
    // Application-related functions
    getUserApplications(phone) {
        return getApplications().filter(app => app.phone === phone);
    }
    
    getApplicationByProperty(apartmentId) {
        return getApplications().filter(app => app.apartmentId === apartmentId);
    }
    
    // Gallery state management
    setGalleryImages(images) {
        this.galleryImages = images;
        this.currentImageIndex = 0;
    }
    
    nextImage() {
        if (this.currentImageIndex < this.galleryImages.length - 1) {
            this.currentImageIndex++;
        } else {
            this.currentImageIndex = 0; // Loop back to first
        }
        return this.galleryImages[this.currentImageIndex];
    }
    
    prevImage() {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
        } else {
            this.currentImageIndex = this.galleryImages.length - 1; // Loop to last
        }
        return this.galleryImages[this.currentImageIndex];
    }
    
    setImageIndex(index) {
        if (index >= 0 && index < this.galleryImages.length) {
            this.currentImageIndex = index;
            return this.galleryImages[this.currentImageIndex];
        }
        return null;
    }
    
    getCurrentImage() {
        return this.galleryImages[this.currentImageIndex] || null;
    }
    
    // Search suggestions
    getSearchSuggestions(query, listingType = 'rent') {
        if (!query || query.length < 2) return [];
        
        const listings = listingType === 'rent' ? getListings() : getSaleListings();
        const suggestions = new Set();
        
        query = query.toLowerCase();
        
        listings.forEach(listing => {
            // Match title
            if (listing.title.toLowerCase().includes(query)) {
                suggestions.add(listing.title);
            }
            
            // Match area
            if (listing.area.toLowerCase().includes(query)) {
                suggestions.add(listing.area);
            }
            
            // Match type
            if (listing.type.toLowerCase().includes(query)) {
                suggestions.add(listing.type);
            }
            
            // Match description keywords
            const words = listing.description.toLowerCase().split(' ');
            words.forEach(word => {
                if (word.includes(query) && word.length > 3) {
                    suggestions.add(word);
                }
            });
        });
        
        return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
    }
    
    // Quick stats for dashboard
    getQuickStats() {
        const stats = getStats();
        const applications = getApplications();
        const inspections = getInspections();
        
        // Recent activity (last 7 days)
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const recentApplications = applications.filter(app => app.createdAt > weekAgo);
        const recentInspections = inspections.filter(insp => insp.createdAt > weekAgo);
        
        // Status breakdown
        const statusCounts = {};
        applications.forEach(app => {
            statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
        });
        
        return {
            ...stats,
            recentApplications: recentApplications.length,
            recentInspections: recentInspections.length,
            applicationStatusCounts: statusCounts
        };
    }
}

// Create global state instance
const appState = new AppState();

// Export state functions
window.appState = appState;

// Export commonly used functions to global scope for backward compatibility
window.getFilteredListings = (type) => appState.getFilteredListings(type);
window.updateSearchFilters = (filters) => appState.updateSearchFilters(filters);
window.clearSearchFilters = () => appState.clearSearchFilters();
window.updateSort = (sortBy) => appState.updateSort(sortBy);