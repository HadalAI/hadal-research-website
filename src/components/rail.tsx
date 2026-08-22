import { fetchWorkers } from '@/lib/data';
import ActivityFeed from '@/components/activity-feed';
import TopContributors from '@/components/top-contributors';

/** Right rail (lg+): live activity + top contributors stacked. */
export default async function Rail() {
  const workers = await fetchWorkers();
  return (
    <div className="space-y-6">
      <ActivityFeed limit={4} />
      <TopContributors rows={workers} />
    </div>
  );
}
