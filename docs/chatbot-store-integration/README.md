# Chatbot Store Integration 🤖🏪

## Overview

The chatbot (Sleevy) has been enhanced to answer questions about store locations, hours, and contact information by connecting directly to the Supabase database.

## Features Added

### 1. Store Data API (`/api/stores`)
- ✅ Fetches all store locations from Supabase
- ✅ Uses existing LocationRepository for data access
- ✅ Returns formatted JSON data
- ✅ Includes hours, address, contact info, coordinates

### 2. Enhanced Chatbot API (`/api/openrouter_logic`)
- ✅ Automatically fetches store data before processing questions
- ✅ Formats store information into AI-readable context
- ✅ Includes context with user's question
- ✅ Graceful error handling (works even if store fetch fails)

### 3. Documentation
- ✅ System prompt guide for PythonAnywhere configuration
- ✅ Setup and troubleshooting guide
- ✅ Test suite for verification

## Quick Start

### 1. Test the Store API

Open your browser and navigate to:
```
http://localhost:3000/api/stores
```

You should see JSON output like:
```json
{
  "stores": [
    {
      "id": "1",
      "name": "Mayagüez Donation Center",
      "address": "123 Main Street, Mayagüez, PR 00680",
      "store_hours": {
        "monday": { "open": "9:00 AM", "close": "5:00 PM" },
        "tuesday": { "open": "9:00 AM", "close": "5:00 PM" },
        ...
      },
      "contact_info": "(787) 555-1234",
      "description": "Main donation center",
      "latitude": 18.2015,
      "longitude": -67.1397
    }
  ]
}
```

### 2. Test the Chatbot Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the application and click the chatbot icon

3. Ask questions like:
   - "What are your store hours?"
   - "Where can I donate clothes?"
   - "Are you open on weekends?"
   - "What's your address?"

### 3. Run Automated Tests

Open the browser console and run:
```javascript
testChatbotIntegration()
```

This will test:
- ✅ Store API endpoint
- ✅ Data format validation
- ✅ Chatbot integration

## Example Conversations

### Example 1: Store Hours
**User:** "What are your store hours?"

**Sleevy:** "Here are our store hours:

**Mayagüez Donation Center**
- Monday: 9:00 AM - 5:00 PM
- Tuesday: 9:00 AM - 5:00 PM
- Wednesday: 9:00 AM - 5:00 PM
- Thursday: 9:00 AM - 5:00 PM
- Friday: 9:00 AM - 5:00 PM
- Saturday: 10:00 AM - 2:00 PM
- Sunday: Closed

Feel free to visit us during these hours!"

### Example 2: Location
**User:** "Where can I drop off donations?"

**Sleevy:** "You can drop off donations at:

📍 **Mayagüez Donation Center**
123 Main Street, Mayagüez, PR 00680
📞 Contact: (787) 555-1234

We accept donations during our regular business hours. You can also check our map for directions!"

### Example 3: Weekend Hours
**User:** "Are you open on Saturdays?"

**Sleevy:** "Yes! We're open on Saturdays from 10:00 AM to 2:00 PM at our Mayagüez Donation Center. We're closed on Sundays."

## Configuration

### Environment Variables

Create/update `.env.local`:
```env
# For production
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com

# For local development (optional, defaults to localhost:3000)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### PythonAnywhere Setup

Update your AI system prompt on PythonAnywhere with the content from:
```
/docs/chatbot_system_prompt.md
```

Key points for the system prompt:
- Instruct AI to use `[SYSTEM CONTEXT - Store Information]`
- Format responses clearly with addresses and hours
- Be friendly and helpful
- Acknowledge when information isn't available

## Architecture

```
┌─────────────────┐
│  User Question  │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Chatbot Frontend   │
│ (chatbox-behavior)  │
└────────┬────────────┘
         │
         ▼
┌──────────────────────────┐
│  /api/openrouter_logic   │
│  ┌────────────────────┐  │
│  │ Fetch Store Data   │  │
│  │   /api/stores      │  │
│  │        │           │  │
│  │        ▼           │  │
│  │  LocationRepo      │  │
│  │        │           │  │
│  │        ▼           │  │
│  │    Supabase        │  │
│  └────────┬───────────┘  │
│           │              │
│           ▼              │
│  Format Store Context    │
│           │              │
│           ▼              │
│  Combine with Question   │
└───────────┬──────────────┘
            │
            ▼
    ┌──────────────────┐
    │  PythonAnywhere  │
    │    AI Model      │
    └────────┬─────────┘
             │
             ▼
    ┌─────────────────┐
    │  AI Response    │
    │  with Store     │
    │  Information    │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Display to     │
    │  User           │
    └─────────────────┘
```

## Data Flow

1. **User asks question** → Frontend captures input
2. **POST to /api/openrouter_logic** → Server receives request
3. **GET /api/stores** → Fetch latest store data from Supabase
4. **Format store data** → Convert to readable text format
5. **Combine context + question** → Create enhanced message
6. **Send to PythonAnywhere** → AI processes with store context
7. **Return response** → AI answer includes store information
8. **Display to user** → Show formatted response with animations

## Files Modified/Created

### New Files
- `/app/api/stores/route.ts` - Store data API endpoint
- `/docs/chatbot_system_prompt.md` - AI configuration guide
- `/docs/chatbot_store_integration_guide.md` - Setup documentation
- `/tests/chatbot-store-integration.test.js` - Test suite
- `/docs/chatbot-store-integration/README.md` - This file

### Modified Files
- `/app/api/openrouter_logic/route.js` - Enhanced with store context

## Troubleshooting

### Issue: Chatbot doesn't mention stores

**Check:**
1. Is `/api/stores` returning data? (Test in browser)
2. Is Supabase connection working?
3. Are there stores in the database?
4. Check browser console for errors
5. Is PythonAnywhere using the system prompt?

**Debug:**
```javascript
// Test store API
fetch('/api/stores').then(r => r.json()).then(console.log)

// Check chatbot logs
// Look in browser console during chat interaction
```

### Issue: Store hours are wrong

**Check:**
1. Verify data in Supabase `stores` table
2. Check `store_hours` format matches schema
3. Ensure LocationRepository is fetching correctly

**Fix:**
Update store data in Supabase with correct hours format:
```json
{
  "monday": { "open": "9:00 AM", "close": "5:00 PM" },
  "tuesday": { "open": "9:00 AM", "close": "5:00 PM" }
}
```

### Issue: API errors

**Check:**
- LocationRepository import path
- Supabase client configuration
- TypeScript compilation errors

**Debug:**
```bash
# Check for compilation errors
npm run build

# Check server logs
# Look in terminal where dev server is running
```

## Performance

- **Store data fetch:** ~100-500ms per query
- **No caching:** Fresh data on every request
- **Error handling:** Continues without store data if fetch fails
- **No impact:** Existing chatbot features (animations, persistence) unaffected

## Future Enhancements

Potential improvements:
- [ ] Cache store data with TTL (Time To Live)
- [ ] Filter stores by user's location
- [ ] Show nearest store based on coordinates
- [ ] Add store images to responses
- [ ] Real-time hours (check if currently open)
- [ ] Special hours/holiday closures
- [ ] Multi-language support for store info

## Support

For issues or questions:
1. Check this README
2. Review `/docs/chatbot_store_integration_guide.md`
3. Run test suite: `testChatbotIntegration()`
4. Check browser and server console logs
5. Verify Supabase database connection

## Success Criteria

✅ `/api/stores` returns all store data
✅ Chatbot receives store context in messages
✅ AI can answer location questions accurately
✅ AI can provide store hours correctly
✅ Error handling works (chatbot continues if store fetch fails)
✅ No performance degradation
✅ Existing features still work (animations, history, resizing)

---

**Version:** 1.0
**Last Updated:** November 23, 2025
**Maintainer:** Development Team
