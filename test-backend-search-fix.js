// Test script to verify backend fix for enhanced search keywords
// This tests whether the callSingleToolService now returns the full searchAnalysis object

const testUserId = 'test-user-123';

async function testBackendSearchAnalysis() {
  console.log('🧪 Testing Backend Enhanced Search Fix...\n');
  
  try {
    // Import the service
    const { callSingleToolService } = await import('../services/callSingleToolService.ts');
    
    // Test enhanced search with a simple query
    const messages = [
      {
        role: 'user' as const,
        content: 'search for work tasks'
      }
    ];
    
    const input = {
      messages,
      uid: testUserId,
      languageInstruction: 'Respond in English'
    };
    
    console.log('🔍 Testing enhanced search through backend service...');
    console.log('Input messages:', messages);
    
    const result = await callSingleToolService(input);
    
    if (result.success) {
      console.log('✅ Backend service call successful');
      console.log('Stream created:', !!result.stream);
      
      // Since this is a stream, we can't easily test the tool result here
      // But our debug logs in the service should show if the searchAnalysis is being returned
      console.log('\n📋 Result Summary:');
      console.log('- Success:', result.success);
      console.log('- Has stream:', !!result.stream);
      console.log('- Error:', result.error || 'none');
      
      console.log('\n✨ Check the backend console logs for searchAnalysis debug information!');
    } else {
      console.error('❌ Backend service call failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Alternative test: directly test the action functions
async function testActionFunctions() {
  console.log('\n🎯 Testing Action Functions Directly...\n');
  
  try {
    // Import the action functions
    const { enhancedSearchTasksAction, searchTasksAction } = await import('../ai/heybos-actions/heybos-actions.ts');
    
    // Test enhanced search action
    console.log('Testing enhancedSearchTasksAction...');
    const enhancedResult = await enhancedSearchTasksAction({
      userId: testUserId,
      query: 'work tasks',
      limit: 20
    });
    
    console.log('✅ Enhanced Search Result:');
    console.log('- Action:', enhancedResult.action);
    console.log('- Query:', enhancedResult.query);
    console.log('- Has searchAnalysis:', !!(enhancedResult as any).searchAnalysis);
    
    if ((enhancedResult as any).searchAnalysis) {
      const analysis = (enhancedResult as any).searchAnalysis;
      console.log('- Keyword counts:', {
        primaryKeywords: analysis.primaryKeywords?.length || 0,
        relatedKeywords: analysis.relatedKeywords?.length || 0,
        contextKeywords: analysis.contextKeywords?.length || 0,
        hebrewTerms: analysis.hebrewTerms?.length || 0,
        tagKeywords: analysis.tagKeywords?.length || 0
      });
      console.log('- Sample keywords:', {
        primary: analysis.primaryKeywords?.slice(0, 3) || [],
        related: analysis.relatedKeywords?.slice(0, 3) || [],
        tags: analysis.tagKeywords?.slice(0, 3) || []
      });
    }
    
    // Test basic search action
    console.log('\nTesting searchTasksAction...');
    const basicResult = await searchTasksAction({
      userId: testUserId,
      query: 'work tasks',
      limit: 20
    });
    
    console.log('✅ Basic Search Result:');
    console.log('- Action:', basicResult.action);
    console.log('- Query:', basicResult.query);
    console.log('- Has searchAnalysis:', !!(basicResult as any).searchAnalysis);
    
    if ((basicResult as any).searchAnalysis) {
      const analysis = (basicResult as any).searchAnalysis;
      console.log('- Keyword counts:', {
        primaryKeywords: analysis.primaryKeywords?.length || 0,
        relatedKeywords: analysis.relatedKeywords?.length || 0,
        contextKeywords: analysis.contextKeywords?.length || 0,
        hebrewTerms: analysis.hebrewTerms?.length || 0
      });
    }
    
    console.log('\n🎉 Action function tests completed!');
    
  } catch (error) {
    console.error('❌ Action function test failed:', error);
  }
}

// Run tests
async function runTests() {
  await testActionFunctions();
  await testBackendSearchAnalysis();
  
  console.log('\n📝 Summary:');
  console.log('1. Both action functions should return searchAnalysis objects with keyword arrays');
  console.log('2. The backend service should now pass these objects to the frontend');
  console.log('3. Check backend console logs for "[CallSingleToolService]" debug messages');
  console.log('4. Test in the actual app to see if frontend now receives keywords');
}

runTests().catch(console.error);
