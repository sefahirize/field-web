"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { ABOUT_MENU, INDUSTRIES, LINKS, RESOURCES_MENU } from "./content";
import { FieldMark, LineIcon } from "./icons";
import s from "./site.module.css";

type MenuId = "useCases" | "resources" | "about";

/**
 * The Blueprint header. Mouse users open the menus by hovering (CSS); a click,
 * a tap or Enter on the trigger opens them too, and Escape, a click outside or
 * moving focus away closes them. Under 960px the links move into a sheet.
 */
export const SiteHeader = () => {
  const [open, setOpen] = useState<MenuId | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const trigger = navRef.current?.querySelector<HTMLButtonElement>(`[data-menu="${open}"]`);
      setOpen(null);
      trigger?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = (id: MenuId) => setOpen(current => (current === id ? null : id));

  // Closes a menu when focus leaves it (Tab past its last link).
  const onItemBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(null);
  };

  const itemProps = (id: MenuId) => ({
    className: s.navItem,
    "data-open": open === id ? "" : undefined,
    onBlur: onItemBlur,
  });

  const triggerProps = (id: MenuId) => ({
    type: "button" as const,
    className: s.navTrigger,
    "data-menu": id,
    "aria-expanded": open === id,
    "aria-controls": `menu-${id}`,
    onClick: () => toggle(id),
  });

  return (
    <>
    <header className={s.header}>
      <div className={`${s.rail} ${s.pad}`}>
        <nav ref={navRef} className={s.nav} aria-label="Main">
          <Link className={s.logo} href={LINKS.home} aria-label="Field home">
            <FieldMark />
            <b>Field</b>
          </Link>

          <div className={s.navList}>
            <div {...itemProps("useCases")}>
              <button {...triggerProps("useCases")}>
                Use cases <LineIcon name="chevron" size={14} className={s.chev} />
              </button>
              <div id="menu-useCases" className={s.dropdown} style={{ width: 760 }}>
                <div className={s.ddCols}>
                  {[INDUSTRIES.slice(0, 4), INDUSTRIES.slice(4)].map((column, c) => (
                    <div className={s.ddCol} key={c}>
                      <div className={s.ddHead} aria-hidden={c > 0 || undefined}>
                        {c === 0 ? "By industry" : " "}
                      </div>
                      {column.map((industry, i) => (
                        <a
                          key={industry.name}
                          className={s.ddLink}
                          href={industry.href}
                          style={{ "--i": c * 4 + i } as React.CSSProperties}
                        >
                          <img src={industry.icon} alt="" width={36} height={36} />
                          <span>
                            <b>{industry.name}</b>
                            <em>{industry.desc}</em>
                          </span>
                        </a>
                      ))}
                    </div>
                  ))}
                  <div className={s.ddAside}>
                    <span className={s.eyeAccent}>Not sure?</span>
                    <span className={s.ddAsideText}>Every page shows which of the ten products fit and what comes back.</span>
                    <Link className={s.ddAsideLink} href={LINKS.contact}>
                      Talk to us
                      <span className={s.arrow}>
                        <LineIcon name="arrow" size={16} />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div {...itemProps("resources")}>
              <button {...triggerProps("resources")}>
                Resources <LineIcon name="chevron" size={14} className={s.chev} />
              </button>
              <div id="menu-resources" className={s.dropdown} style={{ width: 620 }}>
                <div className={s.ddCols}>
                  {RESOURCES_MENU.map((group, g) => (
                    <div className={s.ddCol} key={group.title}>
                      <div className={s.ddHead}>{group.title}</div>
                      {group.links.map((link, i) => (
                        <a
                          key={link.label}
                          className={s.ddLink}
                          href={link.href}
                          style={{ "--i": g * 3 + i } as React.CSSProperties}
                        >
                          <span className={s.ico}>
                            <LineIcon name={link.icon} />
                          </span>
                          <span>
                            <b>{link.label}</b>
                            <em>{link.desc}</em>
                          </span>
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
                <a className={s.ddFoot} href={LINKS.docs}>
                  <span className={s.ico}>
                    <LineIcon name="book" />
                  </span>
                  <span style={{ flex: 1 }}>
                    <b>Documentation</b>
                    <small>docs.joinfield.ai</small>
                  </span>
                  <LineIcon name="external" size={16} />
                </a>
              </div>
            </div>

            <Link className={s.navTrigger} href={LINKS.pricing}>
              Pricing
            </Link>
            <a className={s.navTrigger} href={LINKS.docs}>
              Docs
              <span className={s.externalMark}>
                <LineIcon name="external" size={14} />
              </span>
            </a>

            <div {...itemProps("about")}>
              <button {...triggerProps("about")}>
                About <LineIcon name="chevron" size={14} className={s.chev} />
              </button>
              <div id="menu-about" className={s.dropdown} style={{ width: 330 }}>
                <div className={s.ddCol}>
                  <div className={s.ddHead}>Company</div>
                  {ABOUT_MENU.map((link, i) => (
                    <a key={link.label} className={s.ddLink} href={link.href} style={{ "--i": i } as React.CSSProperties}>
                      <span className={s.ico}>
                        <LineIcon name={link.icon} />
                      </span>
                      <span>
                        <b>{link.label}</b>
                        <em>{link.desc}</em>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={s.navEnd}>
            <a className={`${s.navTrigger} ${s.hideSmall} ${s.signedOut}`} href={LINKS.logIn}>
              Log in
            </a>
            <a className={`${s.btn} ${s.btnDark} ${s.signedOut}`} href={LINKS.signUp}>
              Sign up
            </a>
            <a className={`${s.btn} ${s.btnDark} ${s.signedIn}`} href={LINKS.dashboard}>
              Dashboard
            </a>
            <button
              type="button"
              className={s.burger}
              aria-label="Open menu"
              aria-expanded={sheetOpen}
              aria-controls="site-sheet"
              onClick={() => setSheetOpen(true)}
            >
              <LineIcon name="burger" />
            </button>
          </div>
        </nav>
      </div>
    </header>
    {/* Outside <header>: its stacking context and entry animation would trap a fixed sheet. */}
    <PhoneSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
};

/** The menu under 960px. Rendered always and hidden with `inert`, so it can animate both ways. */
const PhoneSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    onClose();
    returnFocus.current?.focus();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    // Widening the window past the breakpoint leaves no way to close it.
    const wide = window.matchMedia("(min-width: 961px)");
    const onWide = () => wide.matches && onClose();
    document.addEventListener("keydown", onKeyDown);
    wide.addEventListener("change", onWide);
    return () => {
      root.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
      wide.removeEventListener("change", onWide);
    };
  }, [open, close, onClose]);

  const state = open ? "" : undefined;
  let row = 0;
  const next = () => ({ "--i": row++ }) as React.CSSProperties;

  return (
    <>
      <div className={s.sheetBackdrop} data-open={state} onClick={close} aria-hidden="true" />
      <div
        id="site-sheet"
        className={s.sheet}
        data-open={state}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
      >
        <div className={s.sheetHead}>
          <Link className={s.logo} href={LINKS.home} aria-label="Field home" onClick={onClose}>
            <FieldMark />
            <b>Field</b>
          </Link>
          <button ref={closeRef} type="button" className={s.burger} style={{ display: "inline-flex" }} aria-label="Close menu" onClick={close}>
            <LineIcon name="close" />
          </button>
        </div>
        <div className={s.sheetBody}>
          <details className={s.sheetGroup} open style={next()}>
            <summary>
              Use cases <LineIcon name="chevron" />
            </summary>
            <div className={s.sheetLinks}>
              {INDUSTRIES.map(industry => (
                <a key={industry.name} href={industry.href} onClick={onClose}>
                  <img src={industry.icon} alt="" width={28} height={28} />
                  {industry.name}
                </a>
              ))}
            </div>
          </details>
          <details className={s.sheetGroup} style={next()}>
            <summary>
              Resources <LineIcon name="chevron" />
            </summary>
            <div className={s.sheetLinks}>
              {RESOURCES_MENU.flatMap(group => group.links).map(link => (
                <a key={link.label} href={link.href} onClick={onClose}>
                  {link.label}
                </a>
              ))}
            </div>
          </details>
          <Link className={s.sheetRow} href={LINKS.pricing} style={next()} onClick={onClose}>
            Pricing
          </Link>
          <a className={s.sheetRow} href={LINKS.docs} style={next()} onClick={onClose}>
            Docs <LineIcon name="external" size={16} />
          </a>
          <details className={s.sheetGroup} style={{ ...next(), borderTop: "1px solid var(--line)" }}>
            <summary>
              About <LineIcon name="chevron" />
            </summary>
            <div className={s.sheetLinks}>
              {ABOUT_MENU.map(link => (
                <a key={link.label} href={link.href} onClick={onClose}>
                  {link.label}
                </a>
              ))}
            </div>
          </details>
          <div className={s.sheetCtas} style={next()}>
            <a className={`${s.btn} ${s.btnDark} ${s.signedOut}`} href={LINKS.signUp}>
              Sign up
            </a>
            <a className={`${s.btn} ${s.btnLine} ${s.signedOut}`} href={LINKS.logIn}>
              Log in
            </a>
            <a className={`${s.btn} ${s.btnDark} ${s.signedIn}`} href={LINKS.dashboard}>
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
