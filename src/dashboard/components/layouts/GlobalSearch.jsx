import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NAVIGATION } from '@dashboard/data';
import { helpPath } from '@dashboard/data/help';
import { search } from '@dashboard/features/search/search';
import { Highlight } from '@dashboard/components/elements/Highlight';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || '');

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.1.9-1.1 1.6v.1M12 16.8v.01" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);

const navIcon = id => NAVIGATION.find(item => item.id === id)?.icon;

/** One flat, ordered list of what Enter and the arrow keys can reach. */
const buildOptions = (results, query) => {
  const options = [
    ...results.pages.map(page => ({
      key: `page-${page.id}`,
      group: 'Pages',
      title: page.title,
      description: page.description,
      to: page.to,
      icon: page.id === 'help' ? <HelpIcon /> : navIcon(page.iconFrom ?? page.id) ?? <HelpIcon />,
    })),
    ...results.help.map(entry => ({
      key: `help-${entry.id}`,
      group: 'Help',
      title: entry.title,
      description: null,
      to: entry.to,
      icon: <HelpIcon />,
    })),
  ];

  if (query.trim()) {
    options.push({
      key: 'help-search',
      group: 'Help',
      title: `Search Help for “${query.trim()}”`,
      description: null,
      to: helpPath({ q: query.trim() }),
      icon: <SearchIcon />,
      isFallback: true,
    });
  }
  return options;
};

/**
 * The header's search: pages and Help questions in one box. Opening it with
 * nothing typed suggests the main pages and the popular questions; typing
 * narrows both. Press ⌘K / Ctrl K, or "/" anywhere outside a field, to jump to
 * it. Enter opens the highlighted result; the last row always searches Help for
 * the exact text, so there is always somewhere to go.
 */
export const GlobalSearch = () => {
  const router = useRouter();
  const baseId = useId();
  const listId = `${baseId}-list`;
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => search(query), [query]);
  const options = useMemo(() => buildOptions(results, query), [results, query]);
  const noMatches = query.trim() && results.pages.length === 0 && results.help.length === 0;

  // The best match is the one Enter takes.
  useEffect(() => {
    setActive(0);
  }, [query]);

  // ⌘K / Ctrl+K from anywhere; "/" when not typing in a field.
  useEffect(() => {
    const onKeyDown = event => {
      const target = event.target;
      const typing = target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (shortcut || (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey)) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // A tap or click elsewhere closes the list.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = event => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Keep the highlighted row in view, inside the list only.
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const row = list?.querySelector(`[data-index="${active}"]`);
    if (!list || !row) return;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < list.scrollTop + 8) list.scrollTop = Math.max(0, top - 8);
    else if (bottom > list.scrollTop + list.clientHeight - 8) list.scrollTop = bottom - list.clientHeight + 8;
  }, [active, open]);

  const go = option => {
    if (!option) return;
    setOpen(false);
    setQuery('');
    inputRef.current?.blur();
    router.push(option.to);
  };

  const onKeyDown = event => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) setOpen(true);
        else setActive(current => (current + 1) % options.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) setOpen(true);
        else setActive(current => (current - 1 + options.length) % options.length);
        break;
      case 'Home':
        if (open) {
          event.preventDefault();
          setActive(0);
        }
        break;
      case 'End':
        if (open) {
          event.preventDefault();
          setActive(options.length - 1);
        }
        break;
      case 'Enter':
        if (open && options.length > 0) {
          event.preventDefault();
          go(options[active]);
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
        } else if (query) {
          setQuery('');
        } else {
          inputRef.current?.blur();
        }
        break;
      default:
    }
  };

  return (
    <div className={`GlobalSearch ${open ? 'is-open' : ''}`} ref={rootRef} role="search">
      <span className="GlobalSearch-Icon" aria-hidden="true">
        <SearchIcon />
      </span>
      <input
        ref={inputRef}
        className="GlobalSearch-Input"
        type="text"
        role="combobox"
        aria-label="Search pages and help"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && options[active] ? `${baseId}-opt-${active}` : undefined}
        placeholder="Search pages and help…"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={query}
        onChange={event => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {query ? (
        <button
          type="button"
          className="GlobalSearch-Clear"
          aria-label="Clear search"
          onMouseDown={event => event.preventDefault()}
          onClick={() => {
            setQuery('');
            inputRef.current?.focus();
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      ) : (
        <kbd className="GlobalSearch-Shortcut" aria-hidden="true">
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      )}

      {open && (
        <div className="GlobalSearch-Panel">
          <div className="GlobalSearch-List" id={listId} role="listbox" aria-label="Results" ref={listRef}>
            {noMatches && <p className="GlobalSearch-Empty">Nothing matches “{query.trim()}” yet.</p>}
            {!query.trim() && <p className="GlobalSearch-Heading">Suggested</p>}

            {options.map((option, index) => {
              const showHeading = query.trim() && option.group !== options[index - 1]?.group && !option.isFallback;
              return (
                <React.Fragment key={option.key}>
                  {showHeading && <p className="GlobalSearch-Heading">{option.group}</p>}
                  <div
                    id={`${baseId}-opt-${index}`}
                    data-index={index}
                    role="option"
                    aria-selected={index === active}
                    className={`GlobalSearch-Option ${index === active ? 'is-active' : ''} ${option.isFallback ? 'is-fallback' : ''}`}
                    onMouseDown={event => {
                      event.preventDefault();
                      go(option);
                    }}
                    onMouseMove={() => setActive(index)}
                  >
                    <span className="GlobalSearch-OptionIcon">{option.icon}</span>
                    <span className="GlobalSearch-OptionText">
                      <span className="GlobalSearch-OptionTitle">
                        {option.isFallback ? option.title : <Highlight text={option.title} tokens={results.tokens} />}
                      </span>
                      {option.description && <span className="GlobalSearch-OptionDesc">{option.description}</span>}
                    </span>
                    <span className="GlobalSearch-OptionEnter" aria-hidden="true">
                      ↵
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className="GlobalSearch-Foot" aria-hidden="true">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> to move
            </span>
            <span>
              <kbd>↵</kbd> to open
            </span>
            <span>
              <kbd>esc</kbd> to close
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
