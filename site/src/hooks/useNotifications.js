import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for managing notifications via Supabase.
 * Falls back to local-only state when Supabase is not configured.
 *
 * Supabase table required:
 *   - id, user_id, type (eval|deploy|cost|finetune|route|webhook|info|warning|error|success)
 *   - title, message, read (boolean), action_url (optional)
 *   - created_at
 */

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && !url.includes('placeholder');
};

// Demo data for local-only mode
const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-001',
    type: 'eval',
    title: 'Evaluation completed',
    message: 'eval-run-047 finished — GPT-4o scored 94.2%, Llama 3.1 70B scored 91.8%',
    read: false,
    action_url: '/dashboard/evaluations/eval-run-047',
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-002',
    type: 'deploy',
    title: 'Model deployed',
    message: 'Fine-tuned payments-v3 promoted to production via canary (100% traffic)',
    read: false,
    action_url: '/dashboard/deployments/dep-018',
    created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-003',
    type: 'cost',
    title: 'Cost alert',
    message: 'Daily spend reached $842 — 85% of $1,000 budget threshold',
    read: false,
    action_url: '/dashboard/billing',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-004',
    type: 'finetune',
    title: 'Fine-tuning complete',
    message: 'Job ft-support-chat-v4 finished in 47 min — accuracy 96.1% (+2.3%)',
    read: true,
    action_url: '/dashboard/fine-tuning/ft-042',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-005',
    type: 'route',
    title: 'Route updated',
    message: 'Auto-router shifted 15% traffic from Claude 3.5 to fine-tuned specialist (cost -22%)',
    read: true,
    action_url: '/dashboard/models-routing',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-006',
    type: 'webhook',
    title: 'Webhook failure',
    message: 'Endpoint https://api.acme.co/hooks/slancha returned 503 — 3 consecutive failures',
    read: true,
    action_url: '/dashboard/webhooks',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-007',
    type: 'eval',
    title: 'Drift detected',
    message: 'Quality score for summarization dropped 4.2% over 24h — auto-eval triggered',
    read: true,
    action_url: '/dashboard/evaluations',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-008',
    type: 'info',
    title: 'System update',
    message: 'New models available: Llama 3.3 70B, Claude Sonnet 4',
    read: false,
    action_url: null,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
    end: new Date(),
  });

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      let data;

      if (!isSupabaseConfigured()) {
        setNotifications(MOCK_NOTIFICATIONS);
        setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.read).length);
        setLoading(false);
        return;
      }

      const result = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString())
        .order('created_at', { ascending: false });

      if (result.error) {
        if (result.error.code === '42P01' || result.error.code === 'PGRST116') {
          if (import.meta.env.DEV) console.warn('notifications table not found, using mock data');
          setNotifications(MOCK_NOTIFICATIONS);
          setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.read).length);
        } else {
          throw result.error;
        }
      } else {
        data = result.data || [];
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to fetch notifications:', err);
      setError(err.message);
      setNotifications(MOCK_NOTIFICATIONS);
      setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.read).length);
    } finally {
      setLoading(false);
    }
  }, [user, dateRange]);

  useEffect(() => {
    setSupabaseConfigured(isSupabaseConfigured());
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark as read
  const markAsRead = async (notificationId) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return { error: null };
    }

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to mark as read:', err);
      return { error: err.message };
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      const unread = notifications.filter((n) => !n.read).length;
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      return { error: null, unreadCount: unread };
    }

    try {
      const unreadNotifs = notifications.filter((n) => !n.read);
      const ids = unreadNotifs.map((n) => n.id);

      if (ids.length === 0) {
        return { error: null, unreadCount: 0 };
      }

      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .in('id', ids)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      return { error: null, unreadCount: ids.length };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to mark all as read:', err);
      return { error: err.message };
    }
  };

  // Dismiss a notification (remove from list)
  const dismiss = async (notificationId) => {
    if (!user) return { error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setUnreadCount((prev) => (notifications.find((n) => n.id === notificationId)?.read ? prev : prev - 1));
      return { error: null };
    }

    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setUnreadCount((prev) => (notifications.find((n) => n.id === notificationId)?.read ? prev : prev - 1));
      return { error: null };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to dismiss notification:', err);
      return { error: err.message };
    }
  };

  // Filter by type
  const filterByType = (type) => {
    if (!type || type === 'All') return notifications;
    return notifications.filter((n) => n.type === type);
  };

  // Filter by read status
  const filterByReadStatus = (readStatus) => {
    if (readStatus === 'all') return notifications;
    return notifications.filter((n) => (readStatus === 'unread' ? !n.read : n.read));
  };

  // Type badge colors and labels
  const typeConfig = {
    eval: { label: 'Eval', color: '#8B5CF6', icon: '📊' },
    deploy: { label: 'Deploy', color: '#22C55E', icon: '🚀' },
    cost: { label: 'Cost', color: '#F59E0B', icon: '💰' },
    finetune: { label: 'Fine-tune', color: '#EC4899', icon: '⚡' },
    route: { label: 'Route', color: '#3B82F6', icon: '↻' },
    webhook: { label: 'Webhook', color: '#6B7280', icon: '🔗' },
    info: { label: 'Info', color: '#3B82F6', icon: 'ℹ️' },
    warning: { label: 'Warning', color: '#F59E0B', icon: '⚠️' },
    error: { label: 'Error', color: '#EF4444', icon: '❌' },
    success: { label: 'Success', color: '#22C55E', icon: '✅' },
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    supabaseConfigured,
    dateRange,
    setDateRange,
    markAsRead,
    markAllAsRead,
    dismiss,
    filterByType,
    filterByReadStatus,
    typeConfig,
    refetch: fetchNotifications,
  };
}
