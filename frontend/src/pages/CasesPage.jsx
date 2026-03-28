import { useEffect, useState } from 'react';
import api from '../api/client.js';

const emptyCase = {
  title: '',
  description: '',
  caseType: 'General',
  tags: ''
};

const CasesPage = () => {
  const [cases, setCases] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [form, setForm] = useState(emptyCase);

  const load = async () => {
    const [casesRes, recRes] = await Promise.all([
      api.get('/cases'),
      api.get('/cases/recommend/urgent')
    ]);
    setCases(casesRes.data);
    setRecommended(recRes.data.topUrgent || []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/cases', { ...form, tags: form.tags.split(',').map((tag) => tag.trim()) });
    setForm(emptyCase);
    await load();
  };

  return (
    <section>
      <div className="split">
        <form className="card" onSubmit={submit}>
          <h3>File a new case</h3>
          <input
            placeholder="Case title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Detailed case description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <input
            placeholder="Case type"
            value={form.caseType}
            onChange={(e) => setForm({ ...form, caseType: e.target.value })}
          />
          <input
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <button type="submit">Create case with AI analysis</button>
        </form>

        <article className="card">
          <h3>Urgent recommendation queue</h3>
          <ol>
            {recommended.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ol>
        </article>
      </div>

      <h3>All cases</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Priority</th>
            <th>Status</th>
            <th>AI Summary</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((item) => (
            <tr key={item._id}>
              <td>{item.title}</td>
              <td>{item.caseType}</td>
              <td>{item.priority}</td>
              <td>{item.status}</td>
              <td>{item.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default CasesPage;
