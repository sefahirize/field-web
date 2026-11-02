import { ROUTE_PATHS } from '@dashboard/data/paths';
import { HELP_PATH, helpPath } from '@dashboard/data/help';
import { PROFILE_EDIT_PATH } from '@dashboard/data/profile';
import { FAQ } from './faq';

/**
 * What the header search can find. Pages are listed by hand because their
 * descriptions and the words people use for them ("receipt", "token") are not
 * in the navigation; the questions come from the FAQ.
 */
export const PAGES = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Your credits, usage and products at a glance',
    to: ROUTE_PATHS.DASHBOARD,
    keywords: ['home', 'overview', 'balance', 'summary', 'ana sayfa'],
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Upload files and see what was processed',
    to: ROUTE_PATHS.DOCUMENTS,
    keywords: ['upload', 'files', 'pdf', 'resume', 'cv', 'invoice', 'status', 'belgeler', 'dosya'],
  },
  {
    id: 'products',
    title: 'Buy credits',
    description: 'Top up credits for a product',
    to: ROUTE_PATHS.PRODUCTS,
    keywords: ['purchase', 'pay', 'payment', 'checkout', 'stripe', 'price', 'products', 'satın al', 'kredi'],
  },
  {
    id: 'credit-history',
    title: 'Credit history',
    description: 'Every credit added to or taken from your account',
    to: ROUTE_PATHS.CREDIT_HISTORY,
    keywords: ['balance', 'transactions', 'usage', 'receipt', 'kredi geçmişi'],
  },
  {
    id: 'api-credentials',
    title: 'API keys',
    description: 'Create and manage the keys your code uses',
    to: ROUTE_PATHS.API_CREDENTIALS,
    keywords: ['token', 'secret', 'x-api-key', 'integration', 'create key', 'regenerate', 'delete key', 'anahtar'],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Usage and spend over time, by product',
    to: ROUTE_PATHS.ANALYTICS,
    keywords: ['charts', 'spend', 'cost', 'statistics', 'report', 'analiz', 'rapor'],
  },
  {
    id: 'profile',
    title: 'Profile',
    description: 'Your details, photo and password',
    to: ROUTE_PATHS.PROFILE,
    keywords: ['account', 'name', 'email', 'password', 'avatar', 'photo', 'company', 'hesap', 'şifre'],
  },
  {
    id: 'profile-edit',
    iconFrom: 'profile',
    title: 'Edit profile',
    description: 'Change your name, email or photo',
    to: PROFILE_EDIT_PATH,
    keywords: ['name', 'email', 'photo', 'avatar', 'picture', 'edit', 'update', 'düzenle', 'fotoğraf'],
  },
  {
    id: 'help',
    title: 'Help and FAQ',
    description: 'Answers to common questions',
    to: HELP_PATH,
    keywords: ['faq', 'support', 'questions', 'how to', 'sss', 'sıkça sorulan sorular', 'yardım'],
  },
];

/** A FAQ question as a search entry: it opens on the Help page. */
export const HELP_ENTRIES = FAQ.map(item => ({
  id: item.id,
  title: item.question,
  description: item.answer.join(' '),
  to: helpPath({ open: item.id }),
  keywords: item.keywords ?? [],
  popular: Boolean(item.popular),
}));
