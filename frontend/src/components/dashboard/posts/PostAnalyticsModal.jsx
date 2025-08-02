import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui';
import { usePost } from '../../../hooks';

const PostAnalyticsModal = ({ isOpen, onClose, post }) => {
  const { actions } = usePost();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      fetchAnalytics();
    }
  }, [isOpen, post]);

  const fetchAnalytics = async () => {
    if (!post) return;
    
    setLoading(true);
    try {
      const data = await actions.fetchAnalytics(post._id);
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post Analytics" size="lg">
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading analytics...</p>
          </div>
        ) : analytics ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analytics.views}</div>
                <div className="text-sm text-blue-500">Views</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analytics.likes}</div>
                <div className="text-sm text-green-500">Likes</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{analytics.comments}</div>
                <div className="text-sm text-purple-500">Comments</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{analytics.shares}</div>
                <div className="text-sm text-orange-500">Shares</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                Engagement Rate: {analytics.engagementRate}%
              </div>
              <div className="text-sm text-gray-600">
                Based on likes and comments relative to views
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                Total Replies: {analytics.totalReplies}
              </div>
              <div className="text-sm text-gray-600">
                Total replies to comments
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No analytics data available</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PostAnalyticsModal; 