import Link from "next/link";

import { FOOTER_COLUMNS, LEGAL_LINKS, LINKS } from "./content";
import { FieldMark } from "./icons";
import s from "./site.module.css";

export const SiteFooter = () => (
  <footer className={s.footer}>
    <div className={`${s.rail} ${s.pad}`}>
      <div className={s.footTop}>
        <div className={s.footBrand}>
          <Link className={s.logo} href={LINKS.home} aria-label="Field home">
            <FieldMark color="#FFFFFF" />
            <b>Field</b>
          </Link>
          <p>Document and AI products behind one API key.</p>
          <div className={s.footButtons}>
            <a className={`${s.footSignUp} ${s.signedOut}`} href={LINKS.signUp}>
              Sign up
            </a>
            <a className={`${s.footLogIn} ${s.signedOut}`} href={LINKS.logIn}>
              Log in
            </a>
            <a className={`${s.footSignUp} ${s.signedIn}`} href={LINKS.dashboard}>
              Dashboard
            </a>
          </div>
        </div>
        <nav className={s.footNav} aria-label="Footer">
          {FOOTER_COLUMNS.map(column => (
            <div className={s.footCol} key={column.title}>
              <div className={s.footHead}>{column.title}</div>
              {column.links.map(link => (
                <a className={s.footLink} key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className={s.footBottom}>
        <span>© {new Date().getFullYear()} Field · joinfield.ai</span>
        <nav aria-label="Legal">
          {LEGAL_LINKS.map(link => (
            <a className={s.footLink} key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  </footer>
);
