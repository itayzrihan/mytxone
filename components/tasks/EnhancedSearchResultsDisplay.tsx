import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Task } from '../types';
import TaskItem from './TaskItem';
import SearchAnalysis from './SearchAnalysis';

interface EnhancedSearchResultsDisplayProps {
  result: any;
  isLoading: boolean;
  onRetry: () => void;
}

const EnhancedSearchResultsDisplay: React.FC<EnhancedSearchResultsDisplayProps> = ({
  result,
  isLoading,
  onRetry,
}) => {
  let tasks: Task[] = [];
  let totalFound = 0;
  let searchAnalysis: any = null;
  let query = '';
  let enhancedSearch = false;
  let message = '';

  try {
    if (Array.isArray(result)) {
      // Handle case where result is directly an array of tasks
      tasks = result;
      totalFound = result.length;
      message = `Found ${totalFound} tasks`;
    } else if (result && typeof result === 'object') {
      // Handle standard result object structure
      tasks = (result as any).tasks || [];
      searchAnalysis = (result as any).searchAnalysis || null;
      query = (result as any).query || '';
      totalFound = (result as any).totalFound || tasks.length;
      enhancedSearch = !!(result as any).searchAnalysis;
      message = (result as any).message || `Found ${totalFound} tasks`;
      
      // Handle case where backend returns action instruction
      if ((result as any).action === 'searchTasks' && (result as any).status === 'searching') {
        message = 'Searching for tasks...';
      }
    }
  } catch (error) {
    console.error('Error processing search result:', error);
  }

  const [showAnalysis, setShowAnalysis] = useState(false);

  const toggleAnalysis = () => {
    setShowAnalysis(prev => !prev);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (totalFound === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>{message}</Text>
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>

      {enhancedSearch && searchAnalysis && (
        <TouchableOpacity
          onPress={toggleAnalysis}
          style={styles.analysisToggle}
        >
          <Text style={styles.analysisToggleText}>
            {showAnalysis ? '▼' : '▶'} Search Analysis ({
              (searchAnalysis.primaryKeywords?.length || 0) +
              (searchAnalysis.relatedKeywords?.length || 0) +
              (searchAnalysis.contextKeywords?.length || 0) +
              (searchAnalysis.hebrewTerms?.length || 0)
            } keywords)
          </Text>
        </TouchableOpacity>
      )}

      {/* Search Analysis Details */}
      {showAnalysis && searchAnalysis && (
        <SearchAnalysis analysis={searchAnalysis} />
      )}

      <FlatList
        data={tasks}
        renderItem={({ item }) => <TaskItem task={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  analysisToggle: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
    marginBottom: 8,
  },
  analysisToggleText: {
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default EnhancedSearchResultsDisplay;