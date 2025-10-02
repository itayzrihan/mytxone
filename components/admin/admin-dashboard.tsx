"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Shield, Users, Crown, Calendar, Clock, AlertTriangle, Star, Gem, Zap } from 'lucide-react';
import type { SafeUser } from '@/db/queries';

interface AdminDashboardProps {
  currentUser: {
    id: string;
    email?: string;
  };
}

interface UserStats {
  total: number;
  admins: number;
  users: number;
  subscriptions: {
    free: number;
    basic: number;
    pro: number;
  }
}

export default function AdminDashboard({ currentUser }: AdminDashboardProps) {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({ 
    total: 0, 
    admins: 0, 
    users: 0,
    subscriptions: { free: 0, basic: 0, pro: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [updatingSubscription, setUpdatingSubscription] = useState<string | null>(null);

  // Fetch users and stats
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch users
      const usersResponse = await fetch('/api/admin/users');
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const usersData = await usersResponse.json();
      setUsers(usersData.users);
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats');
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats');
      }
      const statsData = await statsResponse.json();
      setUserStats(statsData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: 'user' | 'admin') => {
    // Prevent self-demotion
    if (userId === currentUser.id && newRole === 'user') {
      setError('You cannot demote yourself from admin role');
      return;
    }

    try {
      setUpdatingRole(userId);
      setError(null);
      
      const response = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update role');
      }

      // Refresh data after successful update
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleSubscriptionUpdate = async (userId: string, newSubscription: 'free' | 'basic' | 'pro') => {
    try {
      setUpdatingSubscription(userId);
      setError(null);
      
      const response = await fetch('/api/admin/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, subscription: newSubscription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update subscription');
      }

      // Refresh data after successful update
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription');
    } finally {
      setUpdatingSubscription(null);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-red-500/20 text-red-300 border-red-400/30' : 'bg-blue-500/20 text-blue-300 border-blue-400/30';
  };

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'pro':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'basic':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'free':
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getSubscriptionIcon = (subscription: string) => {
    switch (subscription) {
      case 'pro':
        return <Gem className="w-3 h-3 mr-1" />;
      case 'basic':
        return <Star className="w-3 h-3 mr-1" />;
      case 'free':
      default:
        return <Zap className="w-3 h-3 mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/70">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
          <Shield className="w-10 h-10 text-red-400" />
          Admin Dashboard
        </h1>
        <p className="text-white/70">
          Manage users and system settings securely
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="bg-red-500/20 border-red-400/30 text-red-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Total Users</CardTitle>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.total}</div>
            <p className="text-xs text-white/50">
              Active system users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Administrators</CardTitle>
            <Crown className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.admins}</div>
            <p className="text-xs text-white/50">
              Users with admin access
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Regular Users</CardTitle>
            <User className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.users}</div>
            <p className="text-xs text-white/50">
              Standard user accounts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Free Users</CardTitle>
            <Zap className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.subscriptions.free}</div>
            <p className="text-xs text-white/50">
              Free tier users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Basic Users</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.subscriptions.basic}</div>
            <p className="text-xs text-white/50">
              Basic tier users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Pro Users</CardTitle>
            <Gem className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userStats.subscriptions.pro}</div>
            <p className="text-xs text-white/50">
              Pro tier users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
          <CardDescription className="text-white/60">
            Manage user roles, subscriptions, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white/70">Email</TableHead>
                  <TableHead className="text-white/70">Role</TableHead>
                  <TableHead className="text-white/70">Subscription</TableHead>
                  <TableHead className="text-white/70">Created</TableHead>
                  <TableHead className="text-white/70">Last Updated</TableHead>
                  <TableHead className="text-white/70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white">
                      <div className="flex items-center gap-2">
                        {user.id === currentUser.id && (
                          <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-400/30">
                            You
                          </Badge>
                        )}
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getRoleColor(user.role)}
                      >
                        {user.role === 'admin' ? (
                          <Crown className="w-3 h-3 mr-1" />
                        ) : (
                          <User className="w-3 h-3 mr-1" />
                        )}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getSubscriptionColor(user.subscription)}
                      >
                        {getSubscriptionIcon(user.subscription)}
                        {user.subscription}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-white/70">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(user.updatedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        {/* Role Management */}
                        <div className="flex gap-2">
                          {user.role === 'admin' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRoleUpdate(user.id, 'user')}
                              disabled={updatingRole === user.id || user.id === currentUser.id}
                              className="bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30 text-xs"
                            >
                              {updatingRole === user.id ? 'Updating...' : 'Make User'}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRoleUpdate(user.id, 'admin')}
                              disabled={updatingRole === user.id}
                              className="bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30 text-xs"
                            >
                              {updatingRole === user.id ? 'Updating...' : 'Make Admin'}
                            </Button>
                          )}
                        </div>
                        
                        {/* Subscription Management */}
                        <div className="flex gap-1">
                          {['free', 'basic', 'pro'].map((sub) => (
                            <Button
                              key={sub}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSubscriptionUpdate(user.id, sub as 'free' | 'basic' | 'pro')}
                              disabled={updatingSubscription === user.id || user.subscription === sub}
                              className={`text-xs ${
                                user.subscription === sub 
                                  ? 'bg-white/10 border-white/20 text-white/50 cursor-not-allowed' 
                                  : sub === 'pro' 
                                    ? 'bg-purple-500/20 border-purple-400/30 text-purple-300 hover:bg-purple-500/30'
                                    : sub === 'basic'
                                      ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30'
                                      : 'bg-gray-500/20 border-gray-400/30 text-gray-300 hover:bg-gray-500/30'
                              }`}
                            >
                              {updatingSubscription === user.id ? '...' : sub}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}