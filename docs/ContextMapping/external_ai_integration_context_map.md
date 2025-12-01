# Context Map for External AI Integration

## 🎯 Objective
Visualize the strategic relationship between the internal Chatbot system and the external AI provider using a Context Map. This document defines boundaries and clarifies how our internal model interacts with foreign data models, ensuring model integrity.

---

## 📊 Context Map Diagram

```
┌─────────────────────────────────────────┐
│                                         │
│        Chatbot Context                  │
│     (Internal Domain Model)             │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  UI Components:                │    │
│  │  - ChatWindow                  │    │
│  │  - MessageInterface            │    │
│  │  - Store Integration           │    │
│  ├────────────────────────────────┤    │
│  │  Domain Logic:                 │    │
│  │  - Message Format              │    │
│  │  - Store Context               │    │
│  │  - LocationRepository          │    │
│  └────────────────────────────────┘    │
│                 │                       │
└─────────────────┼───────────────────────┘
                  │
                  │ Anti-Corruption Layer (ACL)
                  │ [openrouter_logic/route.js]
                  │
                  │ • Translates external API responses
                  │ • Enriches messages with store context
                  │ • Prevents external concepts from
                  │   leaking into internal domain
                  │
┌─────────────────▼───────────────────────┐
│                                         │
│     External AI Context                 │
│   (PythonAnywhere/OpenRouter API)       │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  External Services:            │    │
│  │  - OpenRouter API              │    │
│  │  - AI Model Provider           │    │
│  │  - PythonAnywhere Endpoint     │    │
│  ├────────────────────────────────┤    │
│  │  External Data Structures:     │    │
│  │  - API Request Format          │    │
│  │  - API Response Format         │    │
│  │  - Model-specific Schemas      │    │
│  └────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔍 Context Relationship Explanation

### Anti-Corruption Layer (ACL)

The `openrouter_logic/route.js` module acts as the **Adapter/Anti-Corruption Layer** that translates the external API's data structures into our internal Message format, preventing external concepts from leaking into our domain.

### Key Responsibilities of the ACL

1. **Request Translation**
   - Converts internal message format to external API format
   - Enriches user messages with store context from `LocationRepository`
   - Formats store data according to AI provider requirements

2. **Response Translation**
   - Transforms external API responses into internal domain format
   - Ensures consistent message structure for the UI layer
   - Handles error cases and provides fallback responses

3. **Domain Isolation**
   - Shields internal domain from external API changes
   - Prevents external terminology from entering the ubiquitous language
   - Maintains clean separation between contexts

---

## 🏗️ Integration Pattern Details

### Data Flow

```
User Input → MessageInterface → ACL (openrouter_logic) → External AI API
                ↑                                              ↓
                └──────────── Translated Response ─────────────┘
```

### ACL Implementation Highlights

```javascript
// From: openrouter_logic/route.js

// 1. Fetch internal domain data
const storesData = await fetchStoresFromDatabase();
const storeContext = formatStoreDataForAI(storesData);

// 2. Translate to external API format
const enhancedMessage = storeContext 
  ? `[SYSTEM CONTEXT - Store Information]\n${storeContext}\n\n[USER QUESTION]\n${message}`
  : message;

// 3. Call external API
const response = await fetch("https://dev2604.pythonanywhere.com/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: enhancedMessage }),
});

// 4. Return translated response to internal context
return NextResponse.json(data);
```

---

## 📋 Context Boundaries

### Chatbot Context (Internal)
- **Ubiquitous Language**: Message, Store, Location, User, Context
- **Bounded Entities**: 
  - Location (domain object from LocationRepository)
  - Message (internal communication format)
  - Store Context (domain-specific enrichment)
- **Ownership**: Internal development team

### External AI Context
- **External Terminology**: API Request, API Response, Model Parameters
- **External Entities**: 
  - Chat endpoint
  - AI model responses
  - External error formats
- **Ownership**: Third-party service (PythonAnywhere/OpenRouter)

---

## ✅ Benefits of This Pattern

1. **Maintainability**: Changes to external API only require updates in the ACL
2. **Testability**: ACL can be tested independently from both contexts
3. **Flexibility**: Easy to swap AI providers without affecting internal domain
4. **Clarity**: Clear boundary between what we control and what we don't
5. **Domain Integrity**: Internal model remains pure and focused on business logic

---

## 🔄 Future Considerations

- **Multiple AI Providers**: ACL can be extended to support multiple external AI services
- **Caching Strategy**: Add caching layer within ACL to optimize external API calls
- **Rate Limiting**: Implement rate limiting logic in ACL to prevent API quota exhaustion
- **Monitoring**: Add observability to track translation performance and errors

---

## 📚 Related Documentation

- [Context Mapping (Listings & Filters)](./ContextMapping.adoc)

---

**Last Updated**: November 23, 2025  
**Author**: Strategic Design Documentation Team  
**Status**: Active
