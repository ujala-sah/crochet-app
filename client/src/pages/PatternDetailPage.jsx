import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import SmartImage from '../components/SmartImage.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Spinner from '../components/Spinner.jsx';

export default function PatternDetailPage() {
  const { id } = useParams();
  const [pattern, setPattern] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api(`/patterns/${id}`);
        setPattern(data.pattern);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <Spinner label="Loading pattern" />;
  if (error || !pattern) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Pattern not found</h1>
        <p className="mt-2 text-ink-700/80">{error || 'This pattern is no longer listed.'}</p>
        <Link to="/patterns" className="btn-primary mt-6">
          Back to Patterns
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Patterns', to: '/patterns' },
          { label: pattern.name },
        ]}
      />
      <div className="grid gap-10 md:grid-cols-2">
        <SmartImage src={pattern.image} alt={pattern.name} className="h-[420px] w-full rounded-3xl object-cover shadow-card" />
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="chip">{pattern.category}</span>
            <span className="chip bg-sage-400/30">{pattern.difficulty}</span>
          </div>
          <h1 className="mt-3 font-display text-4xl text-ink-900">{pattern.name}</h1>
          <p className="mt-4 leading-relaxed text-ink-700/90">{pattern.description}</p>
          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">Materials required</dt>
              <dd className="text-ink-700/85">{pattern.materials}</dd>
            </div>
            {pattern.estimatedSkill && (
              <div>
                <dt className="font-semibold">Estimated skill level</dt>
                <dd>{pattern.estimatedSkill}</dd>
              </div>
            )}
            {pattern.hookSize && (
              <div>
                <dt className="font-semibold">Hook size</dt>
                <dd>{pattern.hookSize}</dd>
              </div>
            )}
            {pattern.yarnWeight && (
              <div>
                <dt className="font-semibold">Yarn weight</dt>
                <dd>{pattern.yarnWeight}</dd>
              </div>
            )}
            {pattern.additionalInfo && (
              <div>
                <dt className="font-semibold">Additional information</dt>
                <dd>{pattern.additionalInfo}</dd>
              </div>
            )}
          </dl>
          <Link to="/patterns" className="btn-secondary mt-8">
            Back to Patterns
          </Link>
        </div>
      </div>
    </div>
  );
}
