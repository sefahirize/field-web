import { IconV2Dashboard as IconDashboard } from '@dashboard/components/icons';
import { IconDocuments } from '@dashboard/components/icons';
import { IconV2Chart as IconChart } from '@dashboard/components/icons';
import { IconCreditCard } from '@dashboard/components/icons';
import { IconReceipt } from '@dashboard/components/icons';
import { IconV2Api as IconApi } from '@dashboard/components/icons';
import { IconUser } from '@dashboard/components/icons';
import { ROUTE_PATHS } from '@dashboard/data/paths';

export const FORM_TEXT = {
  required: 'This is required!',
  form_successful_message: 'The form was submitted successfully.',
  form_error_message: 'An error occurred. Please try again later.',
};

/** Sidebar navigation. Add an entry per top-level section as it is built. */
export const NAVIGATION = [
  {
    id: 'dashboard',
    href: ROUTE_PATHS.DASHBOARD,
    label: 'Dashboard',
    icon: <IconDashboard />,
  },
  {
    id: 'documents',
    href: ROUTE_PATHS.DOCUMENTS,
    label: 'Documents',
    icon: <IconDocuments />,
  },
  {
    id: 'products',
    href: ROUTE_PATHS.PRODUCTS,
    label: 'Buy credits',
    icon: <IconCreditCard />,
  },
  {
    id: 'credit-history',
    href: ROUTE_PATHS.CREDIT_HISTORY,
    label: 'Credit history',
    icon: <IconReceipt />,
  },
  {
    id: 'api-credentials',
    href: ROUTE_PATHS.API_CREDENTIALS,
    label: 'API keys',
    icon: <IconApi />,
  },
  {
    id: 'analytics',
    href: ROUTE_PATHS.ANALYTICS,
    label: 'Analytics',
    icon: <IconChart />,
  },
  {
    id: 'profile',
    href: ROUTE_PATHS.PROFILE,
    label: 'Profile',
    icon: <IconUser />,
  },
];

export const ACCEPT_FILE_FORMATS = {
  'application/pdf': [],
  'image/jpeg': [],
  'image/png': [],
  'image/webp': [],
  'application/msword': [],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
};

export const MAX_FILE_SIZE = 6291456;

/**
 * The shortest password the forms ask for. The server's own minimum is unpublished
 * (it only says "failed on min"), so this is a client-side floor that catches the
 * obvious; the server stays the judge.
 */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Sections that exist only to exercise an endpoint from the Postman
 * collections, not for customers: the parser's status write-back on a
 * document, POST /credits/use, and the POST /process key check. The
 * dashboard's first job is testing the API, so they are on by default;
 * NEXT_PUBLIC_TEST_TOOLS=false hides them all.
 */
export const TEST_TOOLS_ENABLED = process.env.NEXT_PUBLIC_TEST_TOOLS !== 'false';
