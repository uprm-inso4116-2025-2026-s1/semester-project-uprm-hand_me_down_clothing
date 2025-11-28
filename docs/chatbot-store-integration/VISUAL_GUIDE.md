# Chatbot Store Integration - Visual Guide

## Quick Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER ASKS QUESTION                          │
│              "What are your store hours?"                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CHATBOT FRONTEND                             │
│         (chatbox-behavior.tsx - Already Implemented)            │
│                                                                 │
│  ✅ Bubble animations                                          │
│  ✅ Message persistence                                        │
│  ✅ Resizable window                                           │
│  ✅ Typing indicator                                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
            POST /api/openrouter_logic { message: "..." }
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              API: /api/openrouter_logic (UPDATED)               │
│                                                                 │
│  Step 1: Fetch Store Data                                      │
│  ┌────────────────────────────────────────┐                    │
│  │  GET /api/stores                       │                    │
│  │         │                               │                    │
│  │         ▼                               │                    │
│  │  [NEW] API: /api/stores/route.ts       │                    │
│  │         │                               │                    │
│  │         ▼                               │                    │
│  │  LocationRepository.fetchAllLocations()│                    │
│  │         │                               │                    │
│  │         ▼                               │                    │
│  │  Supabase Database (stores table)      │                    │
│  │         │                               │                    │
│  │         ▼                               │                    │
│  │  Returns: {                             │                    │
│  │    stores: [                            │                    │
│  │      {                                  │                    │
│  │        name, address, hours,            │                    │
│  │        contact_info, description        │                    │
│  │      }                                  │                    │
│  │    ]                                    │                    │
│  │  }                                      │                    │
│  └────────────────────────────────────────┘                    │
│                        │                                        │
│  Step 2: Format Store Data                                     │
│  ┌────────────────────────────────────────┐                    │
│  │ Convert to readable text:              │                    │
│  │                                        │                    │
│  │ [SYSTEM CONTEXT - Store Information]  │                    │
│  │ 1. Mayagüez Donation Center           │                    │
│  │    Address: 123 Main St               │                    │
│  │    Store Hours:                       │                    │
│  │      Monday: 9:00 AM - 5:00 PM        │                    │
│  │      Tuesday: 9:00 AM - 5:00 PM       │                    │
│  │      ...                              │                    │
│  │    Contact: (787) 555-1234           │                    │
│  └────────────────────────────────────────┘                    │
│                        │                                        │
│  Step 3: Combine Context + User Question                       │
│  ┌────────────────────────────────────────┐                    │
│  │ [SYSTEM CONTEXT - Store Information]  │                    │
│  │ <formatted store data>                │                    │
│  │                                        │                    │
│  │ [USER QUESTION]                       │                    │
│  │ What are your store hours?            │                    │
│  └────────────────────────────────────────┘                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
              POST to PythonAnywhere AI
        https://dev2604.pythonanywhere.com/api/chat
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PYTHONANYWHERE AI                             │
│                                                                 │
│  System Prompt (Configure on PythonAnywhere):                  │
│  ┌────────────────────────────────────────┐                    │
│  │ "You are Sleevy, a helpful assistant   │                    │
│  │  Always use the [SYSTEM CONTEXT]       │                    │
│  │  to answer store-related questions..." │                    │
│  └────────────────────────────────────────┘                    │
│                        │                                        │
│  AI Processing:                                                 │
│  - Reads store context                                          │
│  - Understands user question                                    │
│  - Formulates helpful response                                  │
│  - Includes specific hours/address                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    Returns AI Response
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  RESPONSE TO FRONTEND                           │
│                                                                 │
│  {                                                              │
│    response: "Here are our store hours:                        │
│               Mayagüez Donation Center                         │
│               Monday: 9:00 AM - 5:00 PM                        │
│               Tuesday: 9:00 AM - 5:00 PM                       │
│               ..."                                             │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DISPLAY TO USER                              │
│                                                                 │
│  ✅ Message appears with slide-in animation                    │
│  ✅ Stored in localStorage (persists on close)                 │
│  ✅ Auto-scrolls to show response                              │
│  ✅ User can resize window                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Data Structure

### Supabase Database (stores table)
```
┌────────────────────────────────┐
│ id: string (primary key)       │
│ name: string                   │
│ address: string                │
│ latitude: number               │
│ longitude: number              │
│ description?: string           │
│ contact_info?: string          │
│ store_hours: {                 │
│   monday?: {                   │
│     open: "9:00 AM"           │
│     close: "5:00 PM"          │
│   }                            │
│   tuesday?: {...}             │
│   ...                          │
│ }                              │
│ image?: string                 │
└────────────────────────────────┘
```

### LocationRepository (Domain Layer)
```
┌──────────────────────────────────┐
│ LocationRepository               │
├──────────────────────────────────┤
│ + fetchAllLocations()           │
│ + fetchLocationByID(id)         │
│ + createLocation(loc)           │
│ + updateLocation(loc)           │
│ + removeLocation(loc)           │
└──────────────────────────────────┘
         ▲
         │ Uses
         │
┌──────────────────────────────────┐
│ LocationFactory                  │
├──────────────────────────────────┤
│ + toDomainFormat(raw)           │
│ + toPersistenceFormat(domain)   │
└──────────────────────────────────┘
```

## Question Types Supported

### ✅ Store Hours
- "What are your store hours?"
- "When are you open?"
- "What time do you close?"
- "Are you open on weekends?"
- "What are your Sunday hours?"

### ✅ Locations
- "Where can I donate clothes?"
- "What's your address?"
- "Where are you located?"
- "Do you have multiple locations?"
- "How do I get to your store?"

### ✅ Contact Information
- "How can I contact you?"
- "What's your phone number?"
- "How do I reach you?"
- "Can I call ahead?"

### ✅ General Store Info
- "Tell me about your donation centers"
- "What services do you offer?"
- "Can you describe your locations?"

## Error Handling Flow

```
┌─────────────────────────────────┐
│ User asks question              │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Try: Fetch store data           │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │         │
Success    Failure
    │         │
    ▼         ▼
Store     No store
context   context
    │         │
    └────┬────┘
         │
         ▼
┌─────────────────────────────────┐
│ Continue with AI request        │
│ (with or without store data)    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ AI responds                     │
│ (mentions no info if missing)   │
└─────────────────────────────────┘
```

## Configuration Checklist

### ✅ Backend (Already Done)
- [x] Created `/api/stores` endpoint
- [x] Updated `/api/openrouter_logic` with store context
- [x] Added error handling
- [x] Used existing LocationRepository

### ⚙️ PythonAnywhere (You Need to Do)
- [ ] Update system prompt (see `/docs/chatbot_system_prompt.md`)
- [ ] Configure AI to use `[SYSTEM CONTEXT]`
- [ ] Test with sample questions

### 🧪 Testing (You Can Do)
- [ ] Test `/api/stores` in browser
- [ ] Run `testChatbotIntegration()` in console
- [ ] Ask chatbot store-related questions
- [ ] Verify responses are accurate

### 🌐 Deployment (Optional)
- [ ] Set `NEXT_PUBLIC_BASE_URL` environment variable
- [ ] Deploy to production
- [ ] Test in production environment

## Quick Test Commands

```bash
# Start development server
npm run dev

# In browser console:
# Test store API
fetch('/api/stores').then(r => r.json()).then(console.log)

# Test chatbot integration
testChatbotIntegration()

# Manual test through UI
# 1. Click chatbot icon
# 2. Ask: "What are your store hours?"
# 3. Verify response includes actual hours from database
```

## Success Indicators

✅ **Working Correctly:**
- `/api/stores` returns store data
- Chatbot mentions specific store names
- Hours are accurate from database
- Addresses are provided correctly
- Response time is reasonable (<2 seconds)

❌ **Not Working:**
- Chatbot says "I don't have store information"
- Hours are wrong or generic
- No specific addresses mentioned
- Very slow response times
- Console shows errors

## Next Steps

1. **Start your dev server** → `npm run dev`
2. **Test the API** → Visit `http://localhost:3000/api/stores`
3. **Test the chatbot** → Ask store-related questions
4. **Configure PythonAnywhere** → Update system prompt
5. **Deploy** → Set environment variables and deploy

---

**Need Help?** Check `/docs/chatbot_store_integration_guide.md` for detailed troubleshooting.
