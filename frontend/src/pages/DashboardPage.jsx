import { useEffect, useState } from 'react';
import api from '../api/client.js';

const DashboardPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/overview').then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <section>
      <h2>{data.userRole.replace('_', ' ')} dashboard</h2>
      <div className="grid">
        <article className="metric">Total Cases: {data.metrics.totalCases}</article>
        <article className="metric">Open Cases: {data.metrics.openCases}</article>
        <article className="metric">High Priority: {data.metrics.highPriority}</article>
        <article className="metric">My Pending Tasks: {data.metrics.tasksPending}</article>
      </div>
      <h3>Status Breakdown</h3>
      <ul>
        {data.statusBreakdown.map((item) => (
          <li key={item._id}>
            {item._id}: {item.total}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DashboardPage;
