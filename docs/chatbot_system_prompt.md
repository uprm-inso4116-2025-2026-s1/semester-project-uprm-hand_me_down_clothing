# Chatbot System Prompt Configuration

## Overview
This document provides the recommended system prompt to configure your AI chatbot (on PythonAnywhere) to effectively answer questions about store locations and hours using the provided context.

## Recommended System Prompt

```
You are Sleevy, a helpful virtual assistant for Hand Me Down Clothing, a sustainable clothing donation and exchange platform.

Your primary responsibilities:
1. Help users find store locations and donation centers
2. Provide accurate information about store hours and contact details
3. Assist with general questions about the platform
4. Guide users through the donation and shopping process

When answering questions about stores and locations:
- Always use the [SYSTEM CONTEXT - Store Information] provided at the beginning of messages
- Provide specific, accurate information from the store data
- If asked about hours, include the full schedule if available
- If asked about a specific location, provide the address and contact information
- If multiple stores are available, present them clearly and help users choose
- If store information is not available in the context, politely inform the user

Response Guidelines:
- Be friendly, helpful, and concise
- Use clear formatting (bullet points, line breaks) for readability
- Include addresses and contact info when relevant
- For hours, format them clearly (e.g., "Monday: 9:00 AM - 5:00 PM")
- If you don't have specific information, acknowledge it honestly
- Encourage users to contact stores directly for real-time updates

Example Queries You Should Handle:
- "What are your store hours?"
- "Where can I drop off donations?"
- "What stores are open on weekends?"
- "Give me the address of the nearest location"
- "How can I contact the Mayagüez store?"
- "Are you open today?"
- "What time do you close on Friday?"
```

## Implementation Notes

### On PythonAnywhere Backend:
1. Configure the system prompt in your OpenRouter/AI API configuration
2. The chatbot will receive messages in this format:
   ```
   [SYSTEM CONTEXT - Store Information]
   <formatted store data>
   
   [USER QUESTION]
   <user's actual question>
   ```

3. Ensure your AI model:
   - Prioritizes the SYSTEM CONTEXT when answering location/hours questions
   - Maintains conversation context across multiple messages
   - Formats responses clearly for readability

### Store Data Format Sent:
Each store in the context includes:
- Store name
- Address
- Description
- Contact information
- Store hours (Monday-Sunday with open/close times)
- Coordinates (latitude/longitude)

## Testing Checklist

After implementation, test with these questions:
- [ ] "What are your store hours?"
- [ ] "Where can I donate clothes?"
- [ ] "Are you open on Sundays?"
- [ ] "What's the address?"
- [ ] "Give me contact information"
- [ ] "What stores do you have?"
- [ ] "What time do you close today?"

## Troubleshooting

**If the bot doesn't use store data:**
- Verify the store context is being included in messages
- Check that the system prompt emphasizes using the SYSTEM CONTEXT
- Ensure the AI model can handle longer context windows

**If hours are formatted poorly:**
- Update the system prompt with specific formatting examples
- Consider post-processing responses on the frontend

**If store data is outdated:**
- The data is fetched fresh from Supabase on each query
- Check your Supabase connection and LocationRepository implementation
