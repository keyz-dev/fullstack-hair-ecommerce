const AdminLog = require('../models/adminLog');

/**
 * Create an admin log entry
 * @param {Object} logData - The log data
 * @param {string} logData.user - The user ID (will be mapped to admin)
 * @param {string} logData.action - The action performed
 * @param {string} logData.details - Additional details about the action
 * @param {string} logData.resourceId - The ID of the resource being acted upon (will be mapped to targetId)
 * @param {string} logData.resourceType - The type of resource (will be mapped to targetModel)
 * @returns {Promise<Object>} The created admin log entry
 */
const createAdminLog = async (logData) => {
  try {
    const adminLog = new AdminLog({
      admin: logData.user, // Map user to admin field
      action: logData.action,
      targetModel: logData.resourceType, // Map resourceType to targetModel
      targetId: logData.resourceId, // Map resourceId to targetId
      details: logData.details
    });

    await adminLog.save();
    return adminLog;
  } catch (error) {
    console.error('Error creating admin log:', error);
    // Don't throw error to prevent breaking the main operation
    return null;
  }
};

module.exports = {
  createAdminLog
}; 