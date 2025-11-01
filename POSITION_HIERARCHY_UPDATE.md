# Position Hierarchy System - Implementation Update

## Overview
Enhanced the tagging system to include a hierarchical position system. Users can now select their department and then choose a specific position within that department.

## New Features

### 1. Department & Position Selection
- **Location**: Profile page, next to the user's name (only visible in Edit mode)
- **Two-level selection**:
  1. Department (HR, Developer, Design)
  2. Position (specific to selected department)

### 2. Position Hierarchy by Department

#### HR Department
- HR Director
- HR Manager
- HR Lead
- HR Co-Lead
- Senior HR Specialist
- HR Specialist
- HR Coordinator
- HR Assistant
- Recruiter
- Talent Acquisition Specialist

#### Developer Department
- CTO
- Engineering Director
- Engineering Manager
- Tech Lead
- Senior Software Engineer
- Software Engineer
- Junior Software Engineer
- DevOps Engineer
- QA Engineer
- Frontend Developer
- Backend Developer
- Full Stack Developer
- Intern Developer

#### Design Department
- Design Director
- Design Manager
- Lead Designer
- Senior UX/UI Designer
- UX/UI Designer
- Junior Designer
- Graphic Designer
- Product Designer
- Design Intern

## Changes Made

### Backend Changes

#### 1. User Model (`backend/src/models/User.js`)
```javascript
position: {
    type: String,
    default: null
}
```
- Added `position` field to store user's specific role within their department

#### 2. Auth Controller (`backend/src/controllers/authController.js`)
- Updated `updateUserProfile` to accept and save `position` field
- Updated all populate calls to include `position` field

#### 3. Post Controller (`backend/src/controllers/postController.js`)
- Updated all populate calls to include `position` field for post authors and comment authors

### Frontend Changes

#### 1. Profile Page (`frontend/src/Profile.jsx`)

**New Components:**
- `POSITION_HIERARCHY` constant with predefined positions for each department
- Department & Position selection dropdowns (visible only in edit mode)
- Cascading dropdown behavior (position options change based on selected department)

**UI Updates:**
- Moved department/position selectors to profile info section (next to name)
- Display department badge and position badge below user name
- Show department and position in About section
- Display position next to author names in posts
- Position resets when department changes

**State Management:**
- Added `position` to `editFormData` state
- Updated all form handlers to manage position

#### 2. Feed Page (`frontend/src/Feed.jsx`)
- Added `POSITION_HIERARCHY` constant (same structure as Profile)
- Display position next to author names in posts
- Position shown after department tag with bullet separator

#### 3. Profile Styles (`frontend/src/Profile.css`)

**New CSS Classes:**
- `.profile-role-info` - Container for department and position badges
- `.profile-position` - Position badge styling (dark green)
- `.profile-role-selection` - Container for edit mode dropdowns
- `.role-selection-group` - Individual dropdown group
- `.role-label` - Label for dropdowns
- `.role-select` - Dropdown styling
- `.post-author-position` - Position display in posts
- `.about-role-section` - Container for role info in About

#### 4. Feed Styles (`frontend/src/Feed.css`)
- `.post-author-position` - Position display in feed posts

## Visual Design

### Profile Header
```
┌─────────────────────────────────────────┐
│  [Profile Photo]  John Doe              │
│                   2 posts               │
│                   [HR] [HR Manager]     │
│                                         │
│  [Department: ▼]  [Position: ▼]       │
│  (Edit mode only)                       │
└─────────────────────────────────────────┘
```

### Post Author Display
```
John Doe [HR] • HR Manager
```

### About Section
```
About
─────────────────────
No information added yet.

Department: HR
Position: HR Manager
```

## How to Use

### Setting Your Department & Position:
1. Go to your Profile page
2. Click "✏️ Edit Profile"
3. In the profile info section (next to your name), you'll see two dropdowns:
   - **Department**: Select HR, Developer, or Design
   - **Position**: Select your specific role (options change based on department)
4. Click "💾 Save"

### Viewing Roles:
- **Profile Page**: Department and position badges appear below the user's name
- **About Tab**: Shows department and position in a dedicated section
- **Posts**: Author's department (green badge) and position (text) appear next to their name
- **Feed**: Same display as posts

## Technical Details

### Data Flow
1. User selects department → Position dropdown populates with relevant options
2. Changing department → Position resets to empty
3. Save → Both department and position sent to backend
4. Display → Shows both if set, only department if position is empty

### Validation
- Department is optional (can be "No Department")
- Position is optional (can be "Select Position" or empty)
- Position dropdown only appears when department is selected
- Changing department automatically clears position selection

### Database
- `tag` field: Stores department ('HR', 'Developer', 'Design', or null)
- `position` field: Stores position name as string (or null)
- Both fields are optional and can be updated independently

## Benefits

1. **Better Organization**: Clear hierarchical structure for company roles
2. **Professional Display**: Shows both department and specific position
3. **Flexibility**: Users can set department only or both department and position
4. **Easy Updates**: Users can change their position as they grow in the company
5. **Context in Posts**: Readers can see the author's role and position at a glance

## Future Enhancements (Optional)

Consider adding:
1. **Position-based Permissions**: Different capabilities based on position
2. **Seniority Levels**: Visual indicators for leadership roles
3. **Department Pages**: View all members of a department
4. **Organization Chart**: Visual hierarchy of the company structure
5. **Position Search**: Filter users by specific positions
6. **Team Management**: Directors/Managers can see their team members
7. **Custom Positions**: Allow admins to add new positions
8. **Multi-Department Support**: Users in multiple departments

## Migration Notes

- Existing users will have `position: null` by default
- Users need to manually set their position through Edit Profile
- No data migration required - system handles null values gracefully
- **Remember to restart your backend server** for model changes to take effect
