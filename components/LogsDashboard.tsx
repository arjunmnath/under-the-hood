'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, where, Unsubscribe } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { LogEntry } from '@/types/log';
import LogCard from './LogCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LogOut, 
  Loader2, 
  Activity, 
  Filter,
  RefreshCw,
  Database,
  Clock,
  User
} from 'lucide-react';

export default function LogsDashboard() {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    let unsubscribe: Unsubscribe;

    const setupRealTimeListener = () => {
      try {
        // Create query for user's logs
        let q = query(
          collection(db, 'logs'),
          orderBy('timestamp', 'desc')
        );

        // Add level filter if not 'all'
        if (levelFilter !== 'all') {
          q = query(
            collection(db, 'logs'),
            where('level', '==', levelFilter),
            orderBy('timestamp', 'desc')
          );
        }

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const newLogs: LogEntry[] = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            } as LogEntry));

            setLogs(newLogs);
            setLoading(false);
            setIsConnected(true);
            setError('');
          },
          (error) => {
            console.error('Error fetching logs:', error);
            setError('Failed to fetch logs: ' + error.message);
            setLoading(false);
            setIsConnected(false);
          }
        );
      } catch (error) {
        console.error('Error setting up listener:', error);
        setError('Failed to connect to database');
        setLoading(false);
        setIsConnected(false);
      }
    };

    setupRealTimeListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, levelFilter]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const logCounts = logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Connecting to real-time logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Under The Hood</h1>
                  <p className="text-sm text-gray-400">Real-time application monitoring</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={isConnected ? "default" : "destructive"} 
                  className={isConnected ? "bg-green-500/10 text-green-400 border-green-500/30" : ""}
                >
                  <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User className="w-4 h-4" />
                {user?.email}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Logs</p>
                  <p className="text-2xl font-bold text-white">{logs.length}</p>
                </div>
                <Database className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Info</p>
                  <p className="text-2xl font-bold text-blue-400">{logCounts.info || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-400">{logCounts.warning || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Errors</p>
                  <p className="text-2xl font-bold text-red-400">{logCounts.error || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Debug</p>
                  <p className="text-2xl font-bold text-gray-400">{logCounts.debug || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="level-filter" className="text-sm font-medium text-gray-300">
                  Level:
                </label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all" className="text-white hover:bg-gray-600">All</SelectItem>
                    <SelectItem value="info" className="text-blue-400 hover:bg-gray-600">Info</SelectItem>
                    <SelectItem value="warning" className="text-yellow-400 hover:bg-gray-600">Warning</SelectItem>
                    <SelectItem value="error" className="text-red-400 hover:bg-gray-600">Error</SelectItem>
                    <SelectItem value="debug" className="text-gray-400 hover:bg-gray-600">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-500 bg-red-500/10">
            <CardContent className="p-4">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Logs List */}
        <div className="space-y-4">
          {logs.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No logs yet</h3>
                <p className="text-gray-500">
                  Your logs will appear here in real-time as they are generated.
                </p>
              </CardContent>
            </Card>
          ) : (
            logs.map((log) => (
              <LogCard key={log.id} log={log} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
