import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

/**
 * A select you can type into — the ARIA combobox pattern with a list popup.
 *
 * Closed, it shows the chosen option (icon + label). Open, the same field takes
 * what you type and filters the list by label and hint. Keyboard: ↓ ↑ move,
 * Enter picks, Esc closes and keeps the old value, Home/End jump, Tab leaves.
 *
 * `options`: `[{ value, label, hint?, icon?, disabled?, note? }]` — `icon` is a
 * node drawn before the label; a disabled option stays listed (with its `note`)
 * so people see why it cannot be picked rather than wondering where it went.
 */
export const SearchSelect = ({
  id,
  value,
  options,
  onChange,
  placeholder = 'Select',
  searchPlaceholder = 'Search…',
  emptyText = 'No match',
  disabled = false,
  invalid = false,
  describedBy,
  inputRef,
}) => {
  const autoId = useId();
  const baseId = id || `ss-${autoId}`;
  const listId = `${baseId}-list`;
  const rootRef = useRef(null);
  const listRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  // Where the list opens, decided from the room left in the viewport.
  const [placement, setPlacement] = useState({ right: false, up: false, maxHeight: 320 });

  const selected = options.find(option => option.value === value) ?? null;

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return options;
    return options.filter(option => `${option.label} ${option.hint ?? ''}`.toLocaleLowerCase().includes(needle));
  }, [options, query]);

  const enabledIndexes = useMemo(
    () => filtered.reduce((acc, option, index) => (option.disabled ? acc : [...acc, index]), []),
    [filtered],
  );

  const openList = () => {
    if (disabled || open) return;
    setQuery('');
    setOpen(true);
    const at = options.findIndex(option => option.value === value && !option.disabled);
    setActive(at >= 0 ? at : options.findIndex(option => !option.disabled));
  };

  const closeList = () => {
    setOpen(false);
    setQuery('');
  };

  const choose = option => {
    if (!option || option.disabled) return;
    onChange(option.value);
    closeList();
  };

  // While typing, the first match is the one Enter will take.
  useEffect(() => {
    if (open) setActive(enabledIndexes[0] ?? -1);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the highlighted option in view. Only the list scrolls — scrollIntoView
  // would also drag the page along (sideways, if the list pokes out of it).
  useEffect(() => {
    if (!open || active < 0) return;
    const list = listRef.current;
    const option = list?.querySelector(`[data-index="${active}"]`);
    if (!list || !option) return;
    const top = option.offsetTop;
    const bottom = top + option.offsetHeight;
    if (top < list.scrollTop + 6) list.scrollTop = Math.max(0, top - 6);
    else if (bottom > list.scrollTop + list.clientHeight - 6) list.scrollTop = bottom - list.clientHeight + 6;
  }, [active, open]);

  // Open towards the side with room: to the left when the list would run past
  // the right edge (a select at the top right of a page), upwards when there is
  // more space above than below.
  useLayoutEffect(() => {
    if (!open || !rootRef.current || !listRef.current) return;
    const margin = 12;
    const field = rootRef.current.getBoundingClientRect();
    const list = listRef.current;
    const listWidth = list.offsetWidth;
    const listHeight = Math.min(list.scrollHeight + 2, 320);
    const below = window.innerHeight - field.bottom - margin;
    const above = field.top - margin;
    const up = listHeight > below && above > below;
    const right = field.left + listWidth > window.innerWidth - margin && field.right - listWidth >= margin;
    const maxHeight = Math.max(160, Math.min(320, up ? above : below));
    setPlacement(prev => (prev.right === right && prev.up === up && prev.maxHeight === maxHeight ? prev : { right, up, maxHeight }));
  }, [open, filtered.length]);

  // A tap or click elsewhere closes the list.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = event => {
      if (!rootRef.current?.contains(event.target)) closeList();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const move = step => {
    if (enabledIndexes.length === 0) return;
    setActive(current => {
      const position = enabledIndexes.indexOf(current);
      const next =
        position === -1 ? (step > 0 ? 0 : enabledIndexes.length - 1) : (position + step + enabledIndexes.length) % enabledIndexes.length;
      return enabledIndexes[next];
    });
  };

  const onKeyDown = event => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) openList();
        else move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) openList();
        else move(-1);
        break;
      case 'Home':
        if (open) {
          event.preventDefault();
          setActive(enabledIndexes[0] ?? -1);
        }
        break;
      case 'End':
        if (open) {
          event.preventDefault();
          setActive(enabledIndexes[enabledIndexes.length - 1] ?? -1);
        }
        break;
      case 'Enter':
        if (open) {
          event.preventDefault();
          choose(filtered[active]);
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          event.stopPropagation();
          closeList();
        }
        break;
      case 'Tab':
        if (open) closeList();
        break;
      default:
    }
  };

  const showSelected = !open && selected;

  return (
    <div className={`SearchSelect ${open ? 'is-open' : ''} ${invalid ? 'is-invalid' : ''} ${disabled ? 'is-disabled' : ''}`} ref={rootRef}>
      {showSelected && selected.icon && <span className="SearchSelect-Icon">{selected.icon}</span>}
      <input
        id={baseId}
        ref={inputRef}
        className={`SearchSelect-Input ${showSelected && selected.icon ? 'has-icon' : ''}`}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && active >= 0 ? `${baseId}-opt-${active}` : undefined}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        disabled={disabled}
        placeholder={open ? searchPlaceholder : placeholder}
        value={open ? query : selected?.label ?? ''}
        onChange={event => {
          if (!open) setOpen(true);
          setQuery(event.target.value);
        }}
        onClick={openList}
        onKeyDown={onKeyDown}
        onFocus={event => event.target.select?.()}
      />
      <button
        type="button"
        className="SearchSelect-Toggle"
        tabIndex={-1}
        aria-label={open ? 'Close list' : 'Open list'}
        disabled={disabled}
        onMouseDown={event => event.preventDefault()}
        onClick={() => {
          if (open) closeList();
          else {
            openList();
            document.getElementById(baseId)?.focus();
          }
        }}
      >
        <span className="SearchSelect-Chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul
          className={`SearchSelect-List ${placement.right ? 'is-right' : ''} ${placement.up ? 'is-up' : ''}`}
          id={listId}
          role="listbox"
          ref={listRef}
          style={{ maxHeight: placement.maxHeight }}
        >
          {filtered.length === 0 && (
            <li className="SearchSelect-Empty" role="presentation">
              {emptyText}
              {query.trim() && <> for “{query.trim()}”</>}
            </li>
          )}
          {filtered.map((option, index) => (
            <li
              key={option.value}
              id={`${baseId}-opt-${index}`}
              data-index={index}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              className={`SearchSelect-Option ${index === active ? 'is-active' : ''} ${option.value === value ? 'is-selected' : ''} ${
                option.disabled ? 'is-disabled' : ''
              }`}
              // Keep focus in the input; picking is done on mouse down.
              onMouseDown={event => {
                event.preventDefault();
                choose(option);
              }}
              onMouseMove={() => !option.disabled && setActive(index)}
            >
              {option.icon && <span className="SearchSelect-OptionIcon">{option.icon}</span>}
              <span className="SearchSelect-OptionText">
                <span className="SearchSelect-OptionLabel">{option.label}</span>
                {option.hint && <span className="SearchSelect-OptionHint">{option.hint}</span>}
              </span>
              {option.disabled && option.note && <span className="SearchSelect-OptionNote">{option.note}</span>}
              {option.value === value && !option.disabled && (
                <svg className="SearchSelect-Check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
