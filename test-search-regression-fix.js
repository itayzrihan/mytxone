// Test script to verify the enhanced search regression fix
// This tests that both searchTasks and enhancedSearchTasks now generate searchAnalysis with keywords

async function testSearchRegessionFix() {
  console.log('🔍 Testing Enhanced Search Regression Fix...\n');
  
  try {
    // Import the action functions
    const { searchTasksAction, enhancedSearchTasksAction } = await import('./ai/heybos-actions/heybos-actions.ts');
    
    const testUserId = 'test-user-123';
    const testQuery = 'work tasks';
    
    // Test basic search action (should now generate keywords)
    console.log('1. Testing searchTasksAction...');
    const basicResult = await searchTasksAction({
      userId: testUserId,
      query: testQuery,
      limit: 20
    });
    
    console.log('✅ Basic Search Result:');
    console.log('- Action:', basicResult.action);
    console.log('- Query:', basicResult.query);
    console.log('- Status:', basicResult.status);
    console.log('- Has searchAnalysis:', !!basicResult.searchAnalysis);
    
    if (basicResult.searchAnalysis) {
      const analysis = basicResult.searchAnalysis;
      console.log('- Keyword counts:', {
        primaryKeywords: analysis.primaryKeywords?.length || 0,
        relatedKeywords: analysis.relatedKeywords?.length || 0,
        contextKeywords: analysis.contextKeywords?.length || 0,
        hebrewTerms: analysis.hebrewTerms?.length || 0,
      });
      console.log('- Sample keywords:', {
        primary: analysis.primaryKeywords?.slice(0, 3) || [],
        related: analysis.relatedKeywords?.slice(0, 3) || [],
        hebrew: analysis.hebrewTerms?.slice(0, 3) || []
      });
    } else {
      console.log('❌ No searchAnalysis found in basic search result');
    }
    
    console.log('\n2. Testing enhancedSearchTasksAction...');
    const enhancedResult = await enhancedSearchTasksAction({
      userId: testUserId,
      query: testQuery,
      limit: 20
    });
    
    console.log('✅ Enhanced Search Result:');
    console.log('- Action:', enhancedResult.action);
    console.log('- Query:', enhancedResult.query);
    console.log('- Status:', enhancedResult.status);
    console.log('- Has searchAnalysis:', !!enhancedResult.searchAnalysis);
    
    if (enhancedResult.searchAnalysis) {
      const analysis = enhancedResult.searchAnalysis;
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
    
    // Summary
    console.log('\n📊 Test Summary:');
    const basicHasKeywords = !!(basicResult.searchAnalysis && basicResult.searchAnalysis.primaryKeywords?.length > 0);
    const enhancedHasKeywords = !!(enhancedResult.searchAnalysis && enhancedResult.searchAnalysis.primaryKeywords?.length > 0);
    
    console.log(`- Basic search generates keywords: ${basicHasKeywords ? '✅' : '❌'}`);
    console.log(`- Enhanced search generates keywords: ${enhancedHasKeywords ? '✅' : '❌'}`);
    
    if (basicHasKeywords && enhancedHasKeywords) {
      console.log('\n🎉 SUCCESS: Regression fix appears to be working!');
      console.log('Both search functions now generate searchAnalysis with keywords.');
      console.log('The UI should now display keywords in enhanced search results.');
    } else {
      console.log('\n❌ ISSUE: Some search functions are still not generating keywords.');
      console.log('The regression may not be fully fixed.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSearchRegessionFix().catch(console.error);
