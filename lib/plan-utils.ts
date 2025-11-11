/**
 * Plan Utility Functions
 * 
 * Centralized utility functions for working with user subscription plans.
 * This eliminates repeated inline logic across components.
 */

import { SubscriptionTier } from './use-subscription';

/**
 * Get the resource limit for a given plan
 * @param plan - The user's subscription plan ('free', 'basic', 'pro')
 * @returns The limit for resources (meetings, communities, etc.)
 */
export function getLimitForPlan(plan: SubscriptionTier | null): number {
  if (plan === 'pro') return Infinity;
  if (plan === 'basic') return 3;
  return 1; // free
}

/**
 * Check if a plan is free (including null/undefined)
 * @param plan - The user's subscription plan
 * @returns true if the plan is free or undefined
 */
export function isFreePlan(plan: SubscriptionTier | null): boolean {
  return !plan || plan === 'free';
}

/**
 * Check if a plan is a paid plan (basic or pro)
 * @param plan - The user's subscription plan
 * @returns true if the plan is basic or pro
 */
export function isPaidPlan(plan: SubscriptionTier | null): boolean {
  return plan === 'basic' || plan === 'pro';
}

/**
 * Get CSS grid layout classes based on plan
 * Used for responsive pricing card layouts
 * @param plan - The user's subscription plan
 * @returns CSS class string for grid layout
 */
export function getPricingGridClasses(plan: SubscriptionTier | null): string {
  return isFreePlan(plan)
    ? 'md:grid md:grid-cols-3 md:gap-6'  // Show all 3 pricing cards for free users
    : 'md:grid md:grid-cols-2 md:gap-6'; // Show only 2 cards (basic + pro) for paid users
}

/**
 * Check if user can create more resources based on their plan and current count
 * @param plan - The user's subscription plan
 * @param currentCount - Current number of resources (meetings/communities)
 * @returns true if user can create more resources
 */
export function canCreateMoreResources(
  plan: SubscriptionTier | null,
  currentCount: number
): boolean {
  const limit = getLimitForPlan(plan);
  return currentCount < limit;
}
