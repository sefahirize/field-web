import { CONTROLS, CREDIT_POINTS, FAQ, INDUSTRIES, LINKS, PRODUCTS } from "../content";
import { CheckIcon, FilledIcon, LineIcon } from "../icons";
import s from "../site.module.css";
import { HeroArt } from "./HeroArt";
import h from "./home.module.css";
import { Pipeline } from "./Pipeline";

/** Sets a CSS custom property (--i, --d) for the stagger and delay rules. */
const vars = (values: Record<string, string | number>) => values as React.CSSProperties;

const Arrow = ({ size = 16 }: { size?: number }) => (
  <span className={s.arrow}>
    <LineIcon name="arrow" size={size} />
  </span>
);

/** The Blueprint home page ("Home with the new menu" on the canvas). */
export const HomePage = () => (
  <>
    <Hero />
    <ProductStrip />
    <Pipeline />
    <div className={h.hatch} aria-hidden="true" />
    <Products />
    <Industries />
    <Control />
    <Pricing />
    <Faq />
    <ClosingCta />
  </>
);

const Hero = () => (
  <section className={h.hero}>
    <div className={`${s.rail} ${s.pad} ${h.heroInner}`}>
      <div className={h.heroCopy}>
        <a className={`${h.pill} ${h.enter}`} href={LINKS.products} style={vars({ "--d": "60ms" })}>
          <span className={h.pillTag}>FIELD</span>
          <span>
            Ten document and AI products, one API key · <span className={h.pillLink}>See them all</span>
          </span>
        </a>
        <h1 className={h.h1}>
          <span className={h.line}>
            <span style={vars({ "--i": 0 })}>Documents in.</span>
          </span>
          <span className={h.line}>
            <span style={vars({ "--i": 1 })}>Structured data out.</span>
          </span>
        </h1>
        <p className={`${h.lede} ${h.enter}`} style={vars({ "--d": "420ms" })}>
          Field reads CVs, invoices, scans and other files and hands back clean JSON. Upload in the dashboard, or send one API
          call from your own code.
        </p>
        <div className={`${h.ctas} ${h.enter}`} style={vars({ "--d": "540ms" })}>
          <a className={`${s.btn} ${s.btnDark} ${h.shine}`} href={LINKS.signUp}>
            Get started
          </a>
          <a className={`${s.btn} ${s.btnLine}`} href={LINKS.how}>
            See how it works
          </a>
        </div>
        <div className={`${h.meta} ${h.enter}`} style={vars({ "--d": "660ms" })}>
          <span>PDF · JPG · PNG · DOC · DOCX</span>
          <span className={h.metaRule} aria-hidden="true" />
          <span>UP TO 6 MB A FILE</span>
          <span className={h.metaRule} aria-hidden="true" />
          <span>PRICED IN USD</span>
        </div>
      </div>
      <div className={h.artCol}>
        <HeroArt />
      </div>
    </div>
  </section>
);

const ProductStrip = () => (
  <section className={h.strip}>
    <div className={`${s.rail} ${s.pad} ${h.stripInner}`}>
      <p className={h.stripText}>
        <strong>Ten products</strong> behind the same key, the same credits and the same dashboard.
      </p>
      <div className={h.stripIcons}>
        {PRODUCTS.map((product, i) => (
          <span key={product.name} className={h.stripIcon} data-name={product.name} style={vars({ "--i": i })}>
            <img src={product.icon} alt={product.name} width={40} height={40} />
          </span>
        ))}
        <a className={h.stripAll} href={LINKS.products}>
          All products <Arrow size={14} />
        </a>
      </div>
    </div>
  </section>
);

const Products = () => (
  <section id="products" className={h.band}>
    <div className={s.rail}>
      <div className={`${s.pad} ${h.secHead}`}>
        <div className={h.secHeadCopy}>
          <div className={s.eyebrow} data-reveal>
            Products
          </div>
          <h2 className={s.h2} data-reveal style={vars({ "--i": 1 })}>
            Ten products,
            <br />
            one API key
          </h2>
        </div>
        <p className={`${s.muted} ${h.secHeadSide}`} data-reveal style={vars({ "--i": 2 })}>
          Each product has its own credits. Use them from the dashboard or from your code with the same key, and buy only what
          you need.
        </p>
      </div>
      <div className={h.cellsFrame}>
        <div className={`${h.cells} ${h.products}`}>
          {PRODUCTS.map((product, i) => (
            <a key={product.name} className={h.prod} href={LINKS.pricing} data-reveal style={vars({ "--i": i % 3 })}>
              <img src={product.icon} alt="" width={44} height={44} loading="lazy" />
              <span className={h.prodText}>
                <span className={h.prodName}>{product.name}</span>
                <span className={h.prodDesc}>{product.desc}</span>
              </span>
              <span className={h.prodArrow} aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Industries = () => (
  <section id="industries" className={h.band}>
    <div className={`${s.rail} ${s.pad} ${h.sec}`}>
      <div className={h.indHead}>
        <div className={h.indHeadCopy}>
          <span className={s.eyeAccent} data-reveal>
            Use cases
          </span>
          <h2 className={s.h2Small} data-reveal style={vars({ "--i": 1 })}>
            Built for the documents your industry runs on
          </h2>
          <p className={h.lede600} data-reveal style={vars({ "--i": 2 })}>
            Pick your industry to see which products fit, what comes back and how teams wire it in.
          </p>
        </div>
        <a className={h.textLink} href={LINKS.contact} data-reveal style={vars({ "--i": 3 })}>
          Book a demo <Arrow />
        </a>
      </div>
      <div className={h.indGrid}>
        {INDUSTRIES.map((industry, i) => (
          <a key={industry.name} className={h.ind} href={industry.href} data-reveal style={vars({ "--i": i % 4 })}>
            <div className={h.indTop}>
              <img src={industry.icon} alt="" width={44} height={44} loading="lazy" />
              <Arrow size={18} />
            </div>
            <span className={h.indName}>{industry.name}</span>
            <span className={h.indDesc}>{industry.desc}</span>
            <span className={h.chips}>
              {industry.docs.map(doc => (
                <span key={doc} className={h.chip}>
                  {doc}
                </span>
              ))}
            </span>
          </a>
        ))}
        <a className={`${h.ind} ${h.indElse}`} href={LINKS.pricing} data-reveal style={vars({ "--i": 3 })}>
          <span className={h.indElseIcon}>
            <LineIcon name="stack" size={20} />
          </span>
          <span className={h.indName}>Something else?</span>
          <span className={h.indDesc}>Every product reads PDF, JPG, PNG, DOC and DOCX files up to 6 MB, whatever the industry.</span>
          <span className={h.indElseLink}>
            See pricing <Arrow />
          </span>
        </a>
      </div>
    </div>
  </section>
);

const Control = () => (
  <section className={h.bandAlt}>
    <div className={s.rail}>
      <div className={`${s.pad} ${h.secHead}`}>
        <div className={h.secHeadCopy}>
          <div className={s.eyebrow} data-reveal>
            Control
          </div>
          <h2 className={s.h2} data-reveal style={vars({ "--i": 1 })}>
            You hold the keys
          </h2>
        </div>
        <p className={`${s.muted} ${h.secHeadSide}`} data-reveal style={vars({ "--i": 2 })}>
          Access, spend and every document stay visible in the dashboard, so nothing runs where you cannot see it.
        </p>
      </div>
      <div className={h.cellsFrame}>
        <div className={`${h.cells} ${h.controls}`}>
          {CONTROLS.map((item, i) => (
            <div key={item.title} className={h.control} data-reveal style={vars({ "--i": i })}>
              <FilledIcon name={item.icon} />
              <h3 className={h.controlTitle}>{item.title}</h3>
              <p className={h.controlText}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Pricing = () => (
  <section id="pricing" className={h.band}>
    <div className={s.rail}>
      <div className={`${s.pad} ${h.priceHead}`}>
        <div className={s.eyebrow} data-reveal>
          Pricing
        </div>
        <h2 className={s.h2} data-reveal style={vars({ "--i": 1 })}>
          Pay for what you process
        </h2>
      </div>
      <div className={h.cellsFrame}>
        <div className={`${h.cells} ${h.plans}`}>
          <div className={h.plan}>
            <div className={h.planKind} data-reveal>
              SELF-SERVE
            </div>
            <div className={h.planName} data-reveal style={vars({ "--i": 1 })}>
              Credits
            </div>
            <p className={s.muted} data-reveal style={vars({ "--i": 2 })}>
              Buy credits for the products you use, in US dollars. No subscription.
            </p>
            <ul className={h.points}>
              {CREDIT_POINTS.map((point, i) => (
                <li key={point} data-reveal style={vars({ "--i": 3 + i })}>
                  <CheckIcon />
                  {point}
                </li>
              ))}
            </ul>
            <a className={`${s.btn} ${s.btnDark} ${h.shine}`} href={LINKS.pricing} data-reveal style={vars({ "--i": 6 })}>
              Estimate your cost
            </a>
          </div>
          <div className={h.plan}>
            <div className={h.planKind} data-reveal style={vars({ "--i": 1 })}>
              VOLUME
            </div>
            <div className={h.planName} data-reveal style={vars({ "--i": 2 })}>
              Let&apos;s talk
            </div>
            <p className={s.muted} data-reveal style={vars({ "--i": 3 })}>
              Processing large batches, or need a setup that the dashboard does not offer? Tell us what you process and we will get
              back to you.
            </p>
            <a className={`${s.btn} ${s.btnLine}`} href={LINKS.contact} data-reveal style={vars({ "--i": 4 })}>
              Contact us
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Faq = () => (
  <section className={h.band}>
    <div className={`${s.rail} ${h.faq}`}>
      <div className={h.faqIntro}>
        <div className={s.eyebrow} data-reveal>
          FAQ
        </div>
        <h2 className={s.h2} data-reveal style={vars({ "--i": 1 })}>
          Questions, answered
        </h2>
        <p className={s.muted} data-reveal style={vars({ "--i": 2 })}>
          Something missing? Write to us and a person will answer.
        </p>
        <a className={`${s.btn} ${s.btnLine}`} href={LINKS.contact} data-reveal style={vars({ "--i": 3 })}>
          Get in touch
        </a>
      </div>
      <div className={h.faqList}>
        {FAQ.map((item, i) => (
          <details key={item.q} className={h.faqItem} open={i === 0} data-reveal style={vars({ "--i": i })}>
            <summary>
              {item.q}
              <span className={h.plus} aria-hidden="true" />
            </summary>
            <p className={h.faqAnswer}>{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const ClosingCta = () => (
  <section className={`${h.cta} ${s.accentTop}`} data-reveal="line">
    <div className={`${s.rail} ${s.pad} ${h.ctaInner}`}>
      <h2 className={h.ctaTitle} data-reveal>
        Turn your first document into data
      </h2>
      <p className={h.ctaText} data-reveal style={vars({ "--i": 1 })}>
        Create an account, add credits for the product you need and drop in a file.
      </p>
      <div className={h.ctaButtons} data-reveal style={vars({ "--i": 2 })}>
        <a className={`${s.btn} ${s.btnLight} ${h.shine}`} href={LINKS.signUp}>
          Get started
        </a>
        <a className={`${s.btn} ${s.btnGhost}`} href={LINKS.contact}>
          Talk to us
        </a>
      </div>
    </div>
  </section>
);
