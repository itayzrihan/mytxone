// Test script to verify backend fix for enhanced search keywords
// This tests whether the callSingleToolService now returns the full searchAnalysis object

const testUserId = 'test-user-123';

async function testActionFunctions() {
  console.log('🎯 Testing Action Functions Directly...\n');
  
  try {
    // Import the action functions
    const { enhancedSearchTasksAction, searchTasksAction } = await import('./ai/heybos-actions/heybos-actions');
    
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
    console.log('- Status:', enhancedResult.status);
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
    } else {
      console.log('❌ No searchAnalysis found in enhanced search result');
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
    console.log('- Status:', basicResult.status);
    console.log('- Has searchAnalysis:', !!(basicResult as any).searchAnalysis);
    
    if ((basicResult as any).searchAnalysis) {
      const analysis = (basicResult as any).searchAnalysis;
      console.log('- Keyword counts:', {
        primaryKeywords: analysis.primaryKeywords?.length || 0,
        relatedKeywords: analysis.relatedKeywords?.length || 0,
        contextKeywords: analysis.contextKeywords?.length || 0,
        hebrewTerms: analysis.hebrewTerms?.length || 0
      });
    } else {
      console.log('❌ No searchAnalysis found in basic search result');
    }
    
    console.log('\n🎉 Action function tests completed!');
    
    // Summary
    console.log('\n📝 Test Summary:');
    console.log('- Enhanced search returns searchAnalysis:', !!(enhancedResult as any).searchAnalysis);
    console.log('- Basic search returns searchAnalysis:', !!(basicResult as any).searchAnalysis);
    
    if ((enhancedResult as any).searchAnalysis) {
      console.log('✅ Backend actions are generating keyword analysis - fix should work!');
    } else {
      console.log('❌ Backend actions are not generating keyword analysis - issue persists');
    }
    
  } catch (error) {
    console.error('❌ Action function test failed:', error);
  }
}

// Run the test
testActionFunctions().catch(console.error);
