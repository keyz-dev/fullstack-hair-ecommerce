# Profile System Documentation

## Overview

The BraidSter Profile System provides comprehensive user profile management functionality for both client and admin users. The system is built with a component-based architecture, ensuring maintainability and reusability across different user roles.

## Architecture

### Backend Components

#### 1. User Model (`backend/src/models/user.js`)
- **Enhanced Schema**: Includes comprehensive profile fields
- **New Fields**:
  - `firstName`, `lastName` (replaces `name`)
  - `dateOfBirth`, `gender`, `bio`
  - `preferences` (notifications, privacy, theme, language, currency)
  - `emailVerified`, `lastLogin`
- **Virtual Fields**: `name` for backward compatibility
- **Validation**: Built-in validation for all fields

#### 2. User Controller (`backend/src/controller/user.js`)
- **Profile Management**:
  - `getUserProfile()` - Fetch user profile with stats
  - `updateProfile()` - Update profile information
  - `updatePassword()` - Change password with validation
  - `updateAvatar()` - Upload/update profile picture
  - `deleteAvatar()` - Remove profile picture
  - `getUserStats()` - Get user activity statistics
  - `updatePreferences()` - Update user preferences

#### 3. User Routes (`backend/src/routes/user.js`)
```
GET    /user/profile      - Get user profile
PUT    /user/profile      - Update profile
PUT    /user/password     - Change password
PUT    /user/avatar       - Upload avatar
DELETE /user/avatar       - Remove avatar
GET    /user/stats        - Get user statistics
PUT    /user/preferences  - Update preferences
```

#### 4. Validation Schemas (`backend/src/schema/userSchema.js`)
- **userUpdateSchema**: Profile update validation
- **userPasswordUpdateSchema**: Password change validation
- **userPreferencesSchema**: Preferences update validation

### Frontend Components

#### 1. Profile Hook (`frontend/src/hooks/useProfile.js`)
- **State Management**: Loading, error states
- **API Integration**: All profile operations
- **Context Updates**: Automatic user context updates
- **Error Handling**: Comprehensive error handling with toast notifications

#### 2. Profile API (`frontend/src/api/auth.js`)
- **profileApi Object**: All profile-related API calls
- **File Upload**: Avatar upload with FormData
- **Error Handling**: Consistent error responses

#### 3. Profile Components (`frontend/src/components/dashboard/profile/`)

##### ProfilePage.jsx
- **Main Container**: Tabbed interface for all profile sections
- **State Management**: User stats and active tab
- **Responsive Design**: Mobile-friendly layout

##### ProfileOverview.jsx
- **Read-only Display**: User information and statistics
- **Profile Completion**: Visual progress indicator
- **Account Status**: Email verification, activity level
- **User Stats**: Orders, reviews, member since

##### ProfileEdit.jsx
- **Form Management**: Comprehensive profile editing
- **Avatar Upload**: File upload with preview
- **Validation**: Client-side form validation
- **Real-time Updates**: Live character count for bio

##### SecuritySettings.jsx
- **Password Management**: Change password with strength indicator
- **Security Overview**: Account status, last password change
- **Security Tips**: Best practices guidance
- **Password Visibility**: Toggle password visibility

##### PreferencesSettings.jsx
- **Notification Settings**: Email, SMS, push notifications
- **Privacy Settings**: Profile visibility, contact info display
- **Display Settings**: Theme, language, currency
- **Auto-save**: Automatic preference saving

##### ProfileStats.jsx
- **Activity Overview**: Member since, last login, activity level
- **Statistics Cards**: Orders, reviews, profile completion
- **Recent Activity**: Timeline of user actions
- **Account Health**: Status indicators and tips

## Features

### 1. Profile Management
- **Personal Information**: First name, last name, email, phone
- **Additional Details**: Date of birth, gender, bio
- **Avatar Management**: Upload, preview, remove profile pictures
- **Profile Completion**: Visual indicator of profile completeness

### 2. Security Features
- **Password Change**: Secure password updates with validation
- **Password Strength**: Real-time strength indicator
- **Security Overview**: Account status and security tips
- **Password Visibility**: Toggle password field visibility

### 3. Preferences System
- **Notification Preferences**: Email, SMS, push notifications
- **Privacy Settings**: Profile visibility, contact info display
- **Display Preferences**: Theme, language, currency selection
- **Auto-save**: Automatic saving of preference changes

### 4. Activity Tracking
- **User Statistics**: Orders, reviews, profile completion
- **Activity Level**: Based on last login frequency
- **Recent Activity**: Timeline of user actions
- **Account Health**: Status indicators and recommendations

### 5. Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tabbed Interface**: Organized sections for better UX
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

## Usage

### For Developers

#### 1. Using the Profile Hook
```javascript
import { useProfile } from '../hooks';

const MyComponent = () => {
  const { 
    user, 
    loading, 
    error, 
    updateProfile, 
    updatePassword,
    updateAvatar 
  } = useProfile();

  const handleProfileUpdate = async (data) => {
    try {
      await updateProfile(data);
      // Profile updated successfully
    } catch (error) {
      // Handle error
    }
  };
};
```

#### 2. Adding Profile Routes
The profile routes are already configured for both client and admin users:
- Client: `/client/profile`
- Admin: `/admin/profile`

#### 3. Customizing Profile Components
All components are modular and can be customized:
```javascript
import { ProfilePage } from '../components/dashboard/profile';

// Custom profile page with additional tabs
const CustomProfilePage = () => {
  const customTabs = [
    // ... custom tabs
  ];
  
  return <ProfilePage tabs={customTabs} />;
};
```

### For Users

#### 1. Accessing Profile
- Navigate to profile from dashboard header dropdown
- Or directly visit `/client/profile` or `/admin/profile`

#### 2. Profile Sections
- **Overview**: View profile information and statistics
- **Edit Profile**: Update personal information and avatar
- **Security**: Change password and view security status
- **Preferences**: Manage notifications and privacy settings
- **Activity**: View account statistics and recent activity

#### 3. Profile Completion
- Fill in all profile fields to achieve 100% completion
- Complete profiles unlock additional features
- Visual progress indicator shows completion status

## Database Schema

### User Model Fields
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  phone: String,
  avatar: String,
  dateOfBirth: Date,
  gender: Enum ['male', 'female', 'other', 'prefer-not-to-say'],
  bio: String (max 500 chars),
  preferences: {
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    },
    privacy: {
      profileVisibility: Enum ['public', 'private', 'friends'],
      showEmail: Boolean,
      showPhone: Boolean
    },
    theme: Enum ['light', 'dark', 'auto'],
    language: String,
    currency: String
  },
  emailVerified: Boolean,
  lastLogin: Date,
  role: Enum ['client', 'admin', 'staff', 'vendor'],
  // ... other fields
}
```

## API Endpoints

### Profile Management
```
GET    /api/user/profile      - Get user profile
PUT    /api/user/profile      - Update profile
PUT    /api/user/password     - Change password
PUT    /api/user/avatar       - Upload avatar
DELETE /api/user/avatar       - Remove avatar
GET    /api/user/stats        - Get user statistics
PUT    /api/user/preferences  - Update preferences
```

### Request/Response Examples

#### Get Profile
```javascript
// Response
{
  "success": true,
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "avatar": "https://...",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male",
    "bio": "About me...",
    "preferences": { ... },
    "emailVerified": true,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "role": "client"
  }
}
```

#### Update Profile
```javascript
// Request
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "bio": "Updated bio"
}

// Response
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

## Security Considerations

### 1. Password Security
- Passwords are hashed using bcrypt
- Password strength validation
- Current password verification for changes

### 2. Data Validation
- Server-side validation for all inputs
- Client-side validation for better UX
- Input sanitization and type checking

### 3. File Upload Security
- Avatar file type validation
- File size limits (5MB)
- Secure file storage with Cloudinary

### 4. Privacy Controls
- User-controlled profile visibility
- Optional contact information display
- Granular notification preferences

## Future Enhancements

### 1. Two-Factor Authentication
- SMS-based 2FA
- Authenticator app support
- Backup codes system

### 2. Social Login Integration
- Google, Facebook, Apple login
- Profile data synchronization
- Account linking

### 3. Advanced Privacy Features
- Custom privacy levels
- Data export functionality
- Account deletion options

### 4. Enhanced Activity Tracking
- Detailed activity logs
- Analytics dashboard
- Achievement system

## Troubleshooting

### Common Issues

#### 1. Profile Not Loading
- Check authentication status
- Verify API endpoints are accessible
- Check browser console for errors

#### 2. Avatar Upload Fails
- Verify file type (JPG, PNG, GIF)
- Check file size (max 5MB)
- Ensure Cloudinary configuration

#### 3. Password Change Fails
- Verify current password is correct
- Check password strength requirements
- Ensure proper validation

#### 4. Preferences Not Saving
- Check network connectivity
- Verify API response format
- Check for validation errors

### Debug Tools

#### Profile Test Component
Use the `ProfileTest` component to verify system functionality:
```javascript
import ProfileTest from '../components/dashboard/profile/ProfileTest';

// Add to any page for testing
<ProfileTest />
```

#### Console Logging
All profile operations include detailed console logging for debugging.

## Contributing

### Adding New Profile Features

1. **Backend**: Add fields to user model and controller
2. **Frontend**: Create new components or extend existing ones
3. **Validation**: Add appropriate validation schemas
4. **Testing**: Update tests and documentation
5. **Documentation**: Update this documentation

### Code Style Guidelines

- Follow existing component patterns
- Use TypeScript for new components
- Maintain responsive design
- Include proper error handling
- Add comprehensive comments

## Support

For technical support or questions about the profile system:
- Check the troubleshooting section
- Review API documentation
- Contact the development team
- Create an issue in the project repository 