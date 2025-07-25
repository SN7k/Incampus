// Utility script to clear localStorage and force a refresh
// This is useful when updating mock data

// Clear all localStorage items
localStorage.clear();

// Log a message
console.log('localStorage cleared. Refreshing page...');

// Force a page refresh
window.location.reload(); 