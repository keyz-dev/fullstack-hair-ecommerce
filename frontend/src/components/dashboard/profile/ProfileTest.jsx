import React, { useEffect, useState } from 'react';
import { useProfile } from '../../../hooks';
import { Button } from '../../ui';

const ProfileTest = () => {
  const { user, getProfile, updateProfile, loading, error } = useProfile();
  const [testResult, setTestResult] = useState('');

  const runTest = async () => {
    setTestResult('Running tests...');
    
    try {
      // Test 1: Get profile
      const profile = await getProfile();
      console.log('Profile data:', profile);
      setTestResult(prev => prev + '\n✅ Profile fetch successful');
      
      // Test 2: Update profile
      const updateData = {
        firstName: user?.firstName || 'Test',
        lastName: user?.lastName || 'User',
        bio: 'This is a test bio from the profile system'
      };
      
      const updatedProfile = await updateProfile(updateData);
      console.log('Updated profile:', updatedProfile);
      setTestResult(prev => prev + '\n✅ Profile update successful');
      
      setTestResult(prev => prev + '\n🎉 All tests passed!');
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult(prev => prev + `\n❌ Test failed: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile System Test</h3>
      
      <div className="mb-4">
        <Button
          onClickHandler={runTest}
          isLoading={loading}
          additionalClasses="bg-accent text-white hover:bg-accent/90"
        >
          Run Profile Tests
        </Button>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
      
      {testResult && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Test Results:</h4>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Current User Data:</h4>
        <pre className="text-sm text-blue-700 whitespace-pre-wrap">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ProfileTest; 