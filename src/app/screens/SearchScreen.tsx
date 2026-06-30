import { useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { useApp } from "../App";
import { C, CAT } from "../theme";
import { EntryCard } from "../components/EntryCard";

export function SearchScreen() {
  const { moments, navigate, goBack } = useApp();
  const [query, setQuery] = useState('');

  const results = query.trim().length >= 2
    ? moments.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.detail?.toLowerCase().includes(query.toLowerCase()) ||
        CAT[m.category].label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const recent = moments.slice(0, 3);

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      {/* Search Bar */}
      <div style={{
        background: C.card, borderBottom: `1px solid ${C.border}`,
        padding: '52px 16px 12px',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <button onClick={goBack} style={{
          background: '#F2EFEB', border: 'none', borderRadius: '50%',
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}>
          <ArrowLeft size={18} color={C.text} />
        </button>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 10,
          background: '#F2EFEB', borderRadius: 12, padding: '10px 14px',
        }}>
          <Search size={16} color={C.textSoft} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search your memories..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 15, color: C.text,
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={15} color={C.textSoft} />
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 16px 32px' }}>
        {query.trim().length < 2 ? (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Recent
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recent.map(m => (
                <EntryCard key={m.id} moment={m} compact onClick={() => navigate('moment-detail', { id: m.id })} />
              ))}
            </div>

            {/* Browse by category */}
            <p style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '24px 0 12px' }}>
              Browse by Category
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {Object.entries(CAT).map(([key, cat]) => {
                const count = moments.filter(m => m.category === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => { setQuery(cat.label); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 14px', borderRadius: 20,
                      background: cat.bg, border: `1px solid ${cat.color}30`,
                      cursor: 'pointer', fontSize: 13, fontWeight: 600, color: cat.color,
                    }}
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                    <span style={{ background: cat.color, color: 'white', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: '0 0 6px' }}>No results found</p>
            <p style={{ fontSize: 14, color: C.textSoft, margin: 0 }}>
              Try searching by title, detail, or category
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.textSoft, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              {results.length} Result{results.length !== 1 ? 's' : ''}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.map(m => (
                <EntryCard key={m.id} moment={m} onClick={() => navigate('moment-detail', { id: m.id })} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
