import "server-only";
import sanitizeHtml from "sanitize-html";

// Blog posts come from WordPress as HTML and are rendered with
// dangerouslySetInnerHTML. Clean them on the server so a compromised or
// careless WordPress cannot run scripts on this site.
//
// The allow-list covers what the posts use today (headings, lists, code,
// figures, images, links) and keeps `class`, which the post HTML relies on
// for its look. Anything else (script, style, iframe, on* handlers,
// javascript: URLs) is dropped.

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
  allowedAttributes: {
    "*": ["class", "id", "title", "lang", "dir"],
    a: ["href", "name", "target", "rel", "data-type", "data-id"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding", "fetchpriority"],
    ol: ["start", "reversed", "type"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan", "scope"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  transformTags: {
    // A link that opens a new tab must not get a handle on this window.
    a: (tagName, attribs) =>
      attribs.target === "_blank"
        ? { tagName, attribs: { ...attribs, rel: "noopener noreferrer" } }
        : { tagName, attribs },
  },
};

export const sanitizeBlogHtml = (html: string) => sanitizeHtml(html, OPTIONS);
