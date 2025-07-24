import React from 'react';

const UserInfo = ({ user, placeholder }) => {
    const imagePlaceholder = placeholder || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541';

    return (
        <div className="flex items-center">
            <img
                className="h-8 w-8 rounded-full object-cover"
                src={user?.avatar || imagePlaceholder}
                alt={user?.name || 'User'}
            />
            <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{user?.name || 'N/A'}</div>
                <div className="text-sm text-gray-500">{user?.email || ''}</div>
            </div>
        </div>
    );
};

export default UserInfo;
