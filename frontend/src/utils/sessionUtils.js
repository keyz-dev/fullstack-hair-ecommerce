// Generate a unique session ID for non-authenticated users
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID from localStorage
export const getSessionId = () => {
  let sessionId = localStorage.getItem('payment_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('payment_session_id', sessionId);
  }
  return sessionId;
};

// Clear session ID (useful when user logs in)
export const clearSessionId = () => {
  localStorage.removeItem('payment_session_id');
}; 