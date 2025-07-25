// Import mock socket service
import { 
  initializeSocket, 
  disconnectSocket, 
  testConnection,
  socketEvents 
} from '../mock/mockServices';

// Add the missing isSocketReady function
export const isSocketReady = () => {
  // Mock implementation always returns true
  console.log('Mock socket is ready');
      return true;
};

// Re-export the mock socket service
export { 
  initializeSocket, 
  disconnectSocket, 
  testConnection,
  socketEvents 
}; 