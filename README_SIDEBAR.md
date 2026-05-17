# AI Chat Box Frontend

Modern React + Material UI chat interface with conversation sidebar, similar to ChatGPT/Claude.

## Features

✨ **New Features in This Update:**

- 🗂️ **ChatGPT-Style Sidebar** - Professional conversation list with active highlighting
- 📱 **Responsive Design** - Desktop fixed sidebar, mobile hamburger drawer
- 💾 **Persistent Conversations** - All chats stored in MongoDB backend
- 🔄 **Conversation Management** - Create, load, and delete previous conversations
- 🎯 **Auto-Generated Titles** - Titles auto-generated from first user message
- ⏰ **Timestamps** - Last updated time and message previews
- 🎨 **Modern UI** - Smooth transitions, hover effects, clean design
- ⌨️ **Smooth UX** - Loading states, empty states, error handling

## Stack

- **React** 19.2
- **Material UI** 9.0 (MUI)
- **Vite** - Lightning-fast build tool
- **Axios** - HTTP client
- **React Markdown** - Message formatting

## Quick Start

### Prerequisites

- Node.js (v16+)
- Backend server running on `http://localhost:8000`

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will start on `http://localhost:5173`

### Build

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx                    # Main app with sidebar layout
│   ├── main.jsx                   # Entry point
│   ├── index.css                  # Global styles
│   ├── components/
│   │   ├── Header.jsx             # Chat header
│   │   ├── ChatInput.jsx           # Message input field
│   │   ├── MessageList.jsx         # Messages display
│   │   ├── MessageBubble.jsx       # Individual message
│   │   ├── TypingIndicator.jsx     # AI typing animation
│   │   ├── Sidebar.jsx             # NEW: Main sidebar
│   │   └── ConversationItem.jsx    # NEW: Conversation list item
│   ├── pages/
│   │   └── ChatPage.jsx            # Main chat page (updated)
│   └── services/
│       └── api.js                  # API client (updated)
├── package.json
├── vite.config.js
└── index.html
```

## Component Overview

### New Components

#### **Sidebar.jsx**

Main sidebar component with responsive behavior:

- Responsive sidebar (fixed on desktop, drawer on mobile)
- Conversation list with scrolling
- New Chat button
- Delete conversation buttons (appear on hover)
- Empty state handling
- Loading indicators

**Props:**

```javascript
{
  activeConversationId,    // Currently selected conversation
  onConversationSelect,    // Callback when user clicks conversation
  onNewChat,              // Callback for new chat button
  drawerOpen,             // Mobile drawer visibility
  onDrawerClose,          // Close mobile drawer
  isDrawerMode,           // True if mobile drawer, false if desktop
}
```

#### **ConversationItem.jsx**

Individual conversation list item:

- Title and preview text
- Formatted timestamp (e.g., "2h ago")
- Active state highlighting
- Hover effects with delete button
- Truncated content display

**Props:**

```javascript
{
  conversation,     // Conversation data object
  isActive,        // Is this conversation currently selected
  onSelect,        // Click handler
  onDelete,        // Delete handler
}
```

### Updated Components

#### **App.jsx (Layout)**

Now includes:

- Sidebar component (desktop fixed, mobile drawer)
- Responsive layout with flexbox
- Mobile menu button with hamburger icon
- State management for active conversation
- localStorage persistence for active chat

#### **ChatPage.jsx (Chat Logic)**

Updated to:

- Accept `activeConversationId` prop
- Load conversation on ID change
- Auto-create new conversations
- Notify parent of updates (for sidebar refresh)
- Better responsive sizing with mobile menu offset

#### **api.js (API Service)**

New functions added:

```javascript
getConversationId()           // Get/create current ID
setConversationId(id)         // Update current ID
createNewConversation()       // Create new conversation
getConversations()            // Fetch all conversations (for sidebar)
updateConversationTitle(id, title)  // Update title
deleteConversation(id)        // Delete conversation
```

## Responsive Behavior

### Desktop (≥960px)

- Fixed sidebar (280px width)
- Sidebar always visible
- Chat area takes remaining space
- Full layout used

### Mobile (<960px)

- Hidden sidebar by default
- Hamburger menu button (top-left)
- Click menu to open drawer
- Drawer overlays chat area
- Automatically closes when conversation selected

## Color Scheme

```javascript
primary:     '#0ea5e9'  // Sky blue
secondary:   '#64748b'  // Slate
background:  '#f8fafc'  // Light slate
paper:       '#ffffff'  // White
error:       '#ef4444'  // Red
success:     '#4ade80'  // Green
```

## Styling & UX Details

### Transitions

- All interactive elements have `transition: all 200ms ease`
- Smooth color and size changes on hover

### Hover Effects

- Sidebar items: light background on hover
- New Chat button: blue border and shadow on hover
- Delete button: red color on hover
- Conversation item: highlights entire row

### Active State

- Blue left border (3px)
- Light blue background
- Blue text color

### Empty States

- "No conversations yet" message
- Centered, muted text

### Loading States

- Spinner while fetching conversations
- Typing indicator during AI response

## Data Flow

```
User clicks conversation in Sidebar
           ↓
onConversationSelect fired
           ↓
activeConversationId updated
           ↓
ChatPage receives new ID (via key prop)
           ↓
useEffect triggers with new ID
           ↓
Fetch conversation from backend
           ↓
Messages loaded into state
           ↓
MessageList re-renders with messages
```

## API Integration

### Backend Connection

Frontend connects to backend API at `http://localhost:8000`

Configure in `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### Endpoints Used

- `GET /conversations` - Fetch all conversations (sidebar)
- `GET /conversation/:id` - Load specific conversation
- `POST /conversations` - Create new conversation
- `DELETE /conversation/:id` - Delete conversation
- `POST /ask` - Send message to AI

## localStorage Usage

Stores:

```javascript
localStorage.setItem('conversationId', id)      // Current active chat
localStorage.setItem('activeConversationId', id) // Selected conversation
```

Persists:

- Active conversation ID across page refreshes
- User's last viewed chat

## Styling Approach

- **Material UI Components** for consistent design
- **sx prop** for inline styling (MUI's CSS-in-JS)
- **Responsive design** with `useMediaQuery` hook
- **Theme customization** in App.jsx
- **CSS-in-JS** for dynamic styles

## Advanced Features

### Auto-Title Generation

First user message automatically becomes conversation title:

```javascript
// Backend generates: "Who is Rahul" (truncated to 50 chars)
// Frontend displays in sidebar
```

### Timestamp Formatting

Displays relative time in sidebar:

- "Just now" - < 1 hour
- "2h ago" - < 24 hours
- "3d ago" - < 1 week
- "Jan 15" - older

### Message Preview

Last message (truncated to 100 chars) shows in sidebar for context.

### Conversation Persistence

All conversations stored in MongoDB:

- Full message history
- Metadata (title, timestamps)
- Automatic updates on new messages

## Performance Optimizations

- Components split for better reusability
- Proper key prop in lists for React reconciliation
- useEffect dependencies properly configured
- Sidebar doesn't re-render chat unnecessarily
- Lazy loading of conversations via API

## Troubleshooting

### Sidebar Not Showing

- Verify API endpoint is running: `http://localhost:8000`
- Check browser console for errors
- Ensure `getConversations()` returns data

### Conversations Not Persisting

- Verify MongoDB is connected in backend
- Check Network tab for API responses
- Ensure backend `.env` has correct `MONGODB_URI`

### Mobile Responsive Issues

- Clear browser cache
- Check useMediaQuery breakpoint (default: 960px)
- Verify viewport meta tag in `index.html`

### Styles Not Applying

- Material UI theme should load automatically
- Check console for CSS/theme errors
- Clear node_modules and reinstall: `npm install`

## Next Steps

1. Connect to your AI provider (OpenAI, Anthropic, etc.)
2. Customize colors and branding in `App.jsx` theme
3. Add user authentication (optional)
4. Deploy to production (Vercel, Netlify)
5. Set up proper error boundaries

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Environment Variables

No .env needed for frontend (backend URL is hardcoded to localhost:8000)

For production, add to `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:8000'),
  },
})
```

Then use: `import.meta.env.VITE_API_URL`

## Contributing

When adding new features:

1. Keep components focused and reusable
2. Use MUI components for consistency
3. Maintain responsive design
4. Add proper error handling
5. Test on both desktop and mobile
