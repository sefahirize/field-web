import { PAGE_SETTINGS } from './Global';

export const DATA_FOOTER_MENU_LIST_RESOURCES = [
  {
    href: PAGE_SETTINGS.api_documentation.href,
    label: PAGE_SETTINGS.api_documentation.name,
  },
  {
    href: PAGE_SETTINGS.integration.href,
    label: PAGE_SETTINGS.integration.name,
  },
  {
    href: PAGE_SETTINGS.blog.href,
    label: PAGE_SETTINGS.blog.name,
  },
  // {
  //   href: PAGE_SETTINGS.TermsOfServiceAgreement.href,
  //   label: PAGE_SETTINGS.TermsOfServiceAgreement.name,
  // },
];

export const DATA_FOOTER_MENU_LIST_COMPANY = [
  {
    href: PAGE_SETTINGS.about.href,
    label: "About Us",
  },
  // {
  //   href: PAGE_SETTINGS.join_us.href,
  //   label: PAGE_SETTINGS.join_us.name,
  // },
  {
    href: PAGE_SETTINGS.contact.href,
    label: PAGE_SETTINGS.contact.name,
  },
  ,
  {
    href: PAGE_SETTINGS.pricing.href,
    label: PAGE_SETTINGS.pricing.name,
  },
  ,
  {
    href: PAGE_SETTINGS.contact.href + `?information=sales`,
    label: 'Contact Sales',
  },
  ,
  {
    href: PAGE_SETTINGS.contact.href + `?information=support`,
    label: 'Contact Support',
  },
];

export const DATA_FOOTER_MENU_LIST_EXTRAS = [
  {
    id: 1,
    label: PAGE_SETTINGS.PrivacyNotice.name,
    href: PAGE_SETTINGS.PrivacyNotice.href,
  },
  {
    id: 2,
    label: PAGE_SETTINGS.TermOfUse.name,
    href: PAGE_SETTINGS.TermOfUse.href,
  },
  {
    id: 3,
    label: PAGE_SETTINGS.CookiePolicy.name,
    href: PAGE_SETTINGS.CookiePolicy.href,
  },

  {
    id: 4,
    label: PAGE_SETTINGS.Security.name,
    href: PAGE_SETTINGS.Security.href,
  },
];
