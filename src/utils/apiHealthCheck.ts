// Mock API health check
export const checkApiHealth = async (): Promise<boolean> => {
  console.log('Mock API health check');
  // Always return true for mock implementation
  return true;
};

export default checkApiHealth;

/**
 * Logs API connection status to console
 */
export const logApiStatus = async (): Promise<void> => {
  const health = await checkApiHealth();
  
  if (health) {
    console.log('%c' + 'Connected to InCampus API successfully', 'color: green; font-weight: bold;');
    console.log('%cAPI URL: ' + import.meta.env.VITE_API_URL, 'color: blue;');
    console.log('%cMock Data: ' + (import.meta.env.VITE_USE_MOCK_DATA === 'true' ? 'Enabled' : 'Disabled'), 'color: blue;');
  } else {
    console.error('Could not connect to InCampus API. Some features may not work correctly.');
    console.warn('Falling back to mock data where available');
  }
};
