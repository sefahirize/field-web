import type { IconName } from "./content";

// Line icons of the Blueprint design: 24px grid, 1.6 stroke, currentColor.

const LINE_PATHS: Record<IconName | "chevron" | "arrow" | "external" | "burger" | "close" | "stack", React.ReactNode> = {
  chevron: <path d="M6 9l6 6 6-6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  external: <path d="M7 17L17 7M9 7h8v8" />,
  burger: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  stack: (
    <>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  code: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />,
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  pulse: <path d="M3 12h4l2.5-6 5 12 2.5-6h4" />,
  pen: <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />,
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.8a3.5 3.5 0 010 6.4M18 14.8c1.9.7 3.1 2.4 3.5 5.2" />
    </>
  ),
  book: (
    <>
      <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z" />
      <path d="M4 19a2 2 0 012-2h13" />
    </>
  ),
  flag: <path d="M5 21V4M5 4h11l-2 4 2 4H5" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />
    </>
  ),
  chat: <path d="M4 5h16v11H8l-4 4V5z" />,
  megaphone: <path d="M3 10v4h4l7 4V6l-7 4H3zM17 9a4 4 0 010 6" />,
};

export type LineIconName = keyof typeof LINE_PATHS;

export const LineIcon = ({
  name,
  size = 18,
  className,
}: {
  name: LineIconName;
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    {LINE_PATHS[name]}
  </svg>
);

/** The Field mark: three bars of the F and the accent square. */
export const FieldMark = ({ color = "#0F1623", size = 22 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="175 129 318 318" aria-hidden="true" focusable="false">
    <rect x="175" y="130.64" width="70.1231" height="316.361" fill={color} />
    <rect x="178.262" y="199.484" width="70.4845" height="314.738" transform="rotate(-90 178.262 199.484)" fill={color} />
    <rect x="259.801" y="317.505" width="62.2886" height="159.815" transform="rotate(-90 259.801 317.505)" fill={color} />
    {/* A presentation attribute cannot read a CSS variable; a style can. */}
    <rect x="422.877" y="447" width="67.2062" height="66.8615" transform="rotate(-90 422.877 447)" style={{ fill: "var(--ac)" }} />
  </svg>
);

// Filled icons of the "You hold the keys" cards and the pipeline's result tiles.
const FILLED: Record<string, { viewBox: string; d: string }> = {
  lock: {
    viewBox: "0 0 24 24",
    d: "M10.5706 4.69562C11.016 4.25022 11.6201 4 12.25 4C12.8799 4 13.484 4.25022 13.9294 4.69562C14.3748 5.14102 14.625 5.74511 14.625 6.375V8.75H9.875V6.375C9.875 5.74511 10.1252 5.14102 10.5706 4.69562ZM7.875 8.75V6.375C7.875 5.21468 8.33594 4.10188 9.15641 3.28141C9.97688 2.46094 11.0897 2 12.25 2C13.4103 2 14.5231 2.46094 15.3436 3.28141C16.1641 4.10188 16.625 5.21468 16.625 6.375V8.75H19.75C20.7165 8.75 21.5 9.5335 21.5 10.5V21C21.5 21.9665 20.7165 22.75 19.75 22.75H4.75C3.7835 22.75 3 21.9665 3 21V10.5C3 9.5335 3.7835 8.75 4.75 8.75H7.875ZM15.625 10.75H8.875H5V20.75H19.5V10.75H15.625Z",
  },
  shieldCheck: {
    viewBox: "0 0 24 24",
    d: "M4.75 10.7531V5.5H19.25V10.7531C19.25 17.7748 13.4309 20.2081 12 20.6987C10.5691 20.2081 4.75 17.7748 4.75 10.7531ZM4.5 3.5C4.03587 3.5 3.59075 3.68438 3.26256 4.01256C2.93438 4.34075 2.75 4.78587 2.75 5.25V10.7531C2.75 19.3149 10.0201 22.148 11.438 22.6199C11.8015 22.7494 12.1985 22.7494 12.562 22.6199C13.9799 22.148 21.25 19.3149 21.25 10.7531V5.25C21.25 4.78587 21.0656 4.34075 20.7374 4.01256C20.4092 3.68437 19.9641 3.5 19.5 3.5H4.5ZM16.8153 10.4736C17.2149 10.0923 17.2298 9.45934 16.8486 9.05973C16.4673 8.66012 15.8343 8.64522 15.4347 9.02645L10.6225 13.6174L8.56589 11.652C8.16661 11.2705 7.5336 11.2848 7.15204 11.6841C6.77047 12.0834 6.78483 12.7164 7.18412 13.098L9.93099 15.723C10.3173 16.0921 10.9255 16.0924 11.3121 15.7236L16.8153 10.4736Z",
  },
  document: {
    viewBox: "0 0 24 24",
    d: "M5.5 20V4H13V9.25C13 9.80228 13.4477 10.25 14 10.25H18.5V20H5.5ZM18.0858 8.25L15 5.16421V8.25H18.0858ZM5.25 2C4.78587 2 4.34075 2.18438 4.01256 2.51256C3.68438 2.84075 3.5 3.28587 3.5 3.75V20.25C3.5 20.7141 3.68437 21.1592 4.01256 21.4874C4.34075 21.8156 4.78587 22 5.25 22H18.75C19.2141 22 19.6592 21.8156 19.9874 21.4874C20.3156 21.1592 20.5 20.7141 20.5 20.25V8.25C20.5 7.98478 20.3946 7.73043 20.2071 7.54289L14.9571 2.29289C14.7696 2.10536 14.5152 2 14.25 2H5.25Z",
  },
  chart: {
    viewBox: "0 0 20 20",
    d: "M0 0H20V16H14.3257L15.2362 19.1868L13.3132 19.7362L12.2457 16H7.7543L6.6868 19.7362L4.76375 19.1868L5.67427 16H0V0ZM2 2V14H18V2H2ZM11 4V12H9V4H11ZM15 7V12H13V7H15ZM7 9V12H5V9H7Z",
  },
};

export const FilledIcon = ({ name, size = 24, color = "var(--ac)" }: { name: keyof typeof FILLED; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox={FILLED[name].viewBox} aria-hidden="true" focusable="false">
    <path fillRule="evenodd" clipRule="evenodd" d={FILLED[name].d} style={{ fill: color }} />
  </svg>
);

export const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M3 8.5l3 3 7-7" strokeWidth="1.6" fill="none" style={{ stroke: "var(--ac)" }} />
  </svg>
);

export const CardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M1 10H23M3 4H21C22.1046 4 23 4.89543 23 6V18C23 19.1046 22.1046 20 21 20H3C1.89543 20 1 19.1046 1 18V6C1 4.89543 1.89543 4 3 4Z"
      stroke="#8FB0FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);
