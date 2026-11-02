'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FAQ, FAQ_CATEGORIES } from '@dashboard/features/search/faq';
import { searchFaq, tokenize } from '@dashboard/features/search/search';
import { Highlight } from '@dashboard/components/elements/Highlight';

/**
 * Help and FAQ. Questions are grouped by topic, or — once something is typed in
 * the search box (or arrives as `?q=` from the header search) — ranked by how
 * well they match. `?open=<id>` opens one question and scrolls to it, which is
 * where the header search sends a click on a FAQ result.
 */
export const Help = () => {
  const params = useSearchParams();
  const query = params.get('q') ?? '';
  const openParam = params.get('open');
  const tokens = useMemo(() => tokenize(query), [query]);

  const [category, setCategory] = useState('all');
  const [openIds, setOpenIds] = useState(() => new Set(openParam ? [openParam] : []));

  // Arriving at a question (from the header search): open it, show it, bring it into view.
  useEffect(() => {
    if (!openParam || !FAQ.some(item => item.id === openParam)) return;
    setCategory('all');
    setOpenIds(current => new Set(current).add(openParam));
    const frame = requestAnimationFrame(() => {
      const element = document.getElementById(`faq-${openParam}`);
      element?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
      element?.querySelector('button')?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [openParam]);

  const matches = useMemo(() => searchFaq(FAQ, query), [query]);
  const visible = category === 'all' ? matches : matches.filter(item => item.category === category);
  const searching = tokens.length > 0;

  // The native history API keeps useSearchParams in sync without a router round trip on every keystroke.
  const setQuery = value =>
    window.history.replaceState(null, '', value ? `?${new URLSearchParams({ q: value })}` : window.location.pathname);
  const toggle = id =>
    setOpenIds(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const groups = searching
    ? [{ id: 'results', label: null, items: visible }]
    : FAQ_CATEGORIES.map(cat => ({ id: cat.id, label: cat.label, items: visible.filter(item => item.category === cat.id) })).filter(
        group => group.items.length > 0,
      );

  return (
    <div className="Page Page-Help">
      <div className="PageHeading">
        <h1 className="PageHeading-Title">Help and FAQ</h1>
        <p className="PageHeading-Desc">
          Quick answers about credits, documents and API keys. Press <kbd className="Kbd">/</kbd> anywhere to search.
        </p>
      </div>

      <div className="HelpSearch">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          type="search"
          className="HelpSearch-Input"
          aria-label="Search the FAQ"
          placeholder="Search questions, e.g. “api key” or “payment”"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
      </div>

      <div className="Toolbar-Filters HelpFilters" role="group" aria-label="Topic">
        <button type="button" className={`Chip ${category === 'all' ? 'is-active' : ''}`} onClick={() => setCategory('all')}>
          All
        </button>
        {FAQ_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`Chip ${category === cat.id ? 'is-active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {searching && (
        <p className="HelpCount" role="status">
          {visible.length === 0
            ? `No questions match “${query.trim()}”.`
            : `${visible.length} ${visible.length === 1 ? 'question matches' : 'questions match'} “${query.trim()}”`}
        </p>
      )}

      {visible.length === 0 ? (
        <div className="HelpEmpty">
          <strong>Nothing found</strong>
          <span>Try fewer or different words, or pick another topic.</span>
          <button
            type="button"
            className="Button Button-Secondary"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
          >
            Clear search
          </button>
        </div>
      ) : (
        groups.map(group => (
          <section className="HelpGroup" key={group.id} aria-label={group.label ?? 'Results'}>
            {group.label && <h2 className="HelpGroup-Title">{group.label}</h2>}
            <div className="FaqList">
              {group.items.map(item => (
                <FaqItem key={item.id} item={item} open={openIds.has(item.id)} onToggle={() => toggle(item.id)} tokens={tokens} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

const FaqItem = ({ item, open, onToggle, tokens }) => {
  const buttonId = `faq-button-${item.id}`;
  const panelId = `faq-panel-${item.id}`;

  return (
    <div className={`FaqItem ${open ? 'is-open' : ''}`} id={`faq-${item.id}`}>
      <h3 className="FaqItem-Heading">
        <button type="button" className="FaqItem-Button" id={buttonId} aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
          <span className="FaqItem-Question">
            <Highlight text={item.question} tokens={tokens} />
          </span>
          <span className="FaqItem-Chevron" aria-hidden="true" />
        </button>
      </h3>
      <div className="FaqItem-Panel" id={panelId} role="region" aria-labelledby={buttonId}>
        <div className="FaqItem-PanelInner">
          <div className="FaqItem-Answer">
            {item.answer.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            {item.link && (
              <Link href={item.link.to} className="FaqItem-Link" tabIndex={open ? 0 : -1}>
                {item.link.label} <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
