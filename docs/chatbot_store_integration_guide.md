# Chatbot Store Integration - Setup Guide

## What Was Implemented

The chatbot has been enhanced to answer questions about store locations, hours, and contact information by connecting to your Supabase database.

## Architecture

```
User Question
    ↓
Chatbot Frontend (chatbox-behavior.tsx)
    ↓
API Route (/api/openrouter_logic)
    ↓
    ├─→ Fetch Store Data (/api/stores)
    │       ↓
    │   LocationRepository → Supabase Database
    │       ↓
    │   Return formatted store data
    ↓
Combine: Store Context + User Question
    ↓
Send to PythonAnywhere AI
    ↓
Return AI Response with Store Info
    ↓
Display to User
```

## Files Modified/Created

### 1. New API Endpoint: `/app/api/stores/route.ts`
- Fetches all store locations from Supabase
- Uses LocationRepository for data access
- Returns JSON formatted store data

### 2. Updated API: `/app/api/openrouter_logic/route.js`
- Fetches store data before processing user message
- Formats store data into readable context
- Includes store context in messages sent to AI
- Handles errors gracefully (continues without store data if fetch fails)

### 3. Documentation: `/docs/chatbot_system_prompt.md`
- System prompt configuration for PythonAnywhere
- Instructions for the AI on how to use store data
- Testing checklist and troubleshooting guide

## Environment Variables

Add this to your `.env.local` file:

```env
# Base URL for API calls (used in production)
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# For local development, you can use:
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Note:** If not set, the API will default to `http://localhost:3000` for local development.

## Example Questions the Chatbot Can Now Answer

✅ **Store Hours:**
- "What are your store hours?"
- "Are you open on weekends?"
- "What time do you close on Friday?"
- "Are you open today?"

✅ **Locations:**
- "Where can I donate clothes?"
- "What's your address?"
- "Where are your stores located?"
- "Give me directions to your store"

✅ **Contact Information:**
- "How can I contact you?"
- "What's your phone number?"
- "How do I reach the Mayagüez location?"

✅ **Store Details:**
- "Tell me about your donation centers"
- "What services do you offer?"
- "Do you have multiple locations?"

## How It Works

1. **User asks a question** about locations or hours
2. **Frontend sends** the message to `/api/openrouter_logic`
3. **API fetches** latest store data from `/api/stores`
4. **Store data is formatted** into readable text:
   ```
   [SYSTEM CONTEXT - Store Information]
   1. Store Name
      Address: 123 Main St
      Store Hours:
         Monday: 9:00 AM - 5:00 PM
         Tuesday: 9:00 AM - 5:00 PM
         ...
   
   [USER QUESTION]
   What are your store hours?
   ```
5. **Enhanced message** is sent to PythonAnywhere AI
6. **AI uses store context** to provide accurate answer
7. **Response** is displayed to user with animations

## Data Freshness

- Store data is fetched **fresh from Supabase on every query**
- No caching - ensures users always get current information
- If database is updated, chatbot reflects changes immediately

## Error Handling

The implementation includes robust error handling:

- If store data fetch fails → chatbot continues with user question only
- If Supabase is down → chatbot still responds (without store context)
- If LocationRepository throws → error is logged, user sees generic response
- All errors are logged to console for debugging

## Next Steps for PythonAnywhere Configuration

1. **Update your AI system prompt** using the template in `/docs/chatbot_system_prompt.md`

2. **Configure your AI model** to:
   - Parse the `[SYSTEM CONTEXT]` section
   - Use that data to answer location/hours questions
   - Maintain friendly, helpful tone

3. **Test thoroughly** with the questions listed in the documentation

## Performance Considerations

- Store data is only fetched when processing user messages
- LocationRepository uses efficient Supabase queries
- Store data is formatted once per request
- No impact on chatbot's existing functionality (animations, persistence, resizing)

## Troubleshooting

**Chatbot doesn't mention stores:**
- Check browser console for API errors
- Verify Supabase connection in LocationRepository
- Check that `/api/stores` endpoint returns data
- Ensure PythonAnywhere is using the system prompt correctly

**Store data is incorrect:**
- Verify data in Supabase `stores` table
- Check LocationRepository implementation
- Test `/api/stores` endpoint directly in browser

**Performance is slow:**
- Store data fetch adds ~100-500ms per query
- Consider caching store data (with TTL) if needed
- Check Supabase query performance

## Database Schema Reference

The `stores` table in Supabase contains:

```typescript
{
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  store_hours: {
    monday?: {open: string; close: string};
    tuesday?: {open: string; close: string};
    // ... etc for all days
  };
  description?: string | null;
  contact_info?: string | null;
  image?: string | null;
}
```

## Support

If you encounter issues:
1. Check console logs (both browser and server)
2. Test `/api/stores` endpoint directly
3. Verify Supabase connection
4. Review LocationRepository implementation
5. Check PythonAnywhere logs for AI processing errors
