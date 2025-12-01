// Test file for chatbot store integration
// Run this in browser console or as a Node script to test the API

// Test 1: Check if stores API endpoint works
async function testStoresAPI() {
  console.log("🧪 Testing /api/stores endpoint...");
  
  try {
    const response = await fetch('/api/stores');
    const data = await response.json();
    
    if (response.ok && data.stores) {
      console.log("✅ Stores API working!");
      console.log(`📊 Found ${data.stores.length} stores`);
      console.log("📍 Store data sample:", data.stores[0]);
      return true;
    } else {
      console.error("❌ Stores API failed:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing stores API:", error);
    return false;
  }
}

// Test 2: Check if chatbot receives store context
async function testChatbotWithStoreQuestion() {
  console.log("\n🧪 Testing chatbot with store-related question...");
  
  try {
    const response = await fetch('/api/openrouter_logic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "What are your store hours?" })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Chatbot API working!");
      console.log("💬 Response:", data.response);
      return true;
    } else {
      console.error("❌ Chatbot API failed:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing chatbot:", error);
    return false;
  }
}

// Test 3: Verify store data format
async function testStoreDataFormat() {
  console.log("\n🧪 Testing store data format...");
  
  try {
    const response = await fetch('/api/stores');
    const data = await response.json();
    
    if (!data.stores || data.stores.length === 0) {
      console.error("❌ No stores found in database");
      return false;
    }
    
    const store = data.stores[0];
    const requiredFields = ['id', 'name', 'address', 'latitude', 'longitude', 'store_hours'];
    const missingFields = requiredFields.filter(field => !(field in store));
    
    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields);
      return false;
    }
    
    console.log("✅ Store data format is correct!");
    console.log("📋 Sample store:", {
      name: store.name,
      address: store.address,
      hasHours: !!store.store_hours
    });
    
    return true;
  } catch (error) {
    console.error("❌ Error testing store data format:", error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Starting Chatbot Store Integration Tests\n");
  console.log("=" .repeat(50));
  
  const test1 = await testStoresAPI();
  const test2 = await testStoreDataFormat();
  const test3 = await testChatbotWithStoreQuestion();
  
  console.log("\n" + "=".repeat(50));
  console.log("\n📊 Test Results:");
  console.log(`   Stores API: ${test1 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Data Format: ${test2 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Chatbot Integration: ${test3 ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = test1 && test2 && test3;
  console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️  Some tests failed'}`);
  
  return allPassed;
}

// Export for use in console or testing framework
if (typeof window !== 'undefined') {
  window.testChatbotIntegration = runAllTests;
  console.log("💡 Run 'testChatbotIntegration()' in the console to test the integration");
}

export { testStoresAPI, testChatbotWithStoreQuestion, testStoreDataFormat, runAllTests };
