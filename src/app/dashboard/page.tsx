import KeysManager from '@/components/keys-manager';
import ActivityFeed from '@/components/activity-feed';

export const metadata = { title: 'Dashboard' };

function Console() {
  return <DashboardClient />;
}

// client component does the fetching so the cross-site session cookie is included
import DashboardClient from '@/components/dashboard-client';

export default function DashboardPage() {
  return <DashboardClient />;
}
