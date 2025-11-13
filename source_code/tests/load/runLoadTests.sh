#!/bin/bash

k6 run -e NEXT_PUBLIC_SUPABASE_URL="https://pexedokpmsmkpcdjhzcc.supabase.co/rest/v1" -e NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBleGVkb2twbXNta3BjZGpoemNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTgwOTUsImV4cCI6MjA3NTA3NDA5NX0.1-v7bk9AOljPGa4JwltEbiX2DfHNta02d_rUI3pZE8k" createPieceLoadTest.js
# k6 run -e NEXT_PUBLIC_SUPABASE_URL="https://{PROJECT_ID}.supabase.co/rest/v1" -e NEXT_PUBLIC_SUPABASE_ANON_KEY="{PROJECT_API_KEY}" createPieceLoadTest.js
