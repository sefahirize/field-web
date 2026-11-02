import { ROUTE_PATHS } from '@dashboard/data/paths';

/**
 * The Help page's questions. Every answer is something the dashboard itself
 * says or does — nothing here promises a policy, a price or a time the product
 * does not state. `keywords` are the other words people use for the same thing
 * (and a few Turkish ones), so a search finds a question without its exact
 * wording; `popular` marks the ones suggested before anything is typed.
 *
 * `answer` is an array of paragraphs; `link` points at where the answer lives.
 */
export const FAQ_CATEGORIES = [
  { id: 'start', label: 'Getting started' },
  { id: 'credits', label: 'Credits and payments' },
  { id: 'documents', label: 'Documents' },
  { id: 'keys', label: 'API keys' },
  { id: 'account', label: 'Account' },
];

export const FAQ = [
  {
    id: 'what-is-joinfield',
    category: 'start',
    question: 'What is Field?',
    answer: [
      'Field gives you ten document and AI products — such as CV Parser, Invoice Parser, OCR and Translation — behind one API key.',
      'You buy credits for the products you need, then send files from this dashboard or from your own code.',
    ],
    keywords: ['about', 'products', 'overview', 'nedir', 'ürünler'],
    link: { label: 'Open the dashboard', to: ROUTE_PATHS.DASHBOARD },
    popular: true,
  },
  {
    id: 'how-credits-work',
    category: 'credits',
    question: 'How do credits work?',
    answer: [
      'Each product has its own credit balance. Every file you send spends credits from the product you chose.',
      'If that product has none left, credits from another product are converted so the file can still be processed.',
      'You can see every balance on the Dashboard and every change in Credit history.',
    ],
    keywords: ['balance', 'spend', 'usage', 'kredi', 'bakiye', 'convert'],
    link: { label: 'Credit history', to: ROUTE_PATHS.CREDIT_HISTORY },
    popular: true,
  },
  {
    id: 'buy-credits',
    category: 'credits',
    question: 'How do I buy credits?',
    answer: [
      'Open Buy credits, pick a product and enter how many credits you want. Add a row for each extra product.',
      'The price comes from the server and is recalculated whenever you change a quantity. The unit price falls as the quantity rises.',
      'Check out takes you to Stripe to pay. Your credits are added once the payment is confirmed.',
    ],
    keywords: ['purchase', 'pay', 'checkout', 'stripe', 'price', 'top up', 'satın al', 'ödeme'],
    link: { label: 'Buy credits', to: ROUTE_PATHS.PRODUCTS },
    popular: true,
  },
  {
    id: 'payment-not-completed',
    category: 'credits',
    question: 'My payment says it was not completed. Was I charged?',
    answer: [
      'No. “This payment was not completed” means you started a payment on Stripe but did not finish it, so nothing was charged.',
      'If the payment was started from this browser, you can continue it from the same page, or discard it and start again from your basket.',
    ],
    keywords: ['unpaid', 'charged', 'pending', 'stripe', 'continue payment', 'discard', 'ücret'],
    link: { label: 'Back to Buy credits', to: ROUTE_PATHS.PRODUCTS },
  },
  {
    id: 'payment-processing',
    category: 'credits',
    question: 'I paid, but my credits have not appeared yet',
    answer: [
      'Stripe can send you back before Field has recorded the payment. The result page keeps checking for about half a minute.',
      'If it says the payment is still processing, wait a moment and choose Check again — checking again never charges you twice. Your credits show on the Dashboard and in Credit history once the payment is recorded.',
    ],
    keywords: ['missing credits', 'processing', 'confirm', 'delay', 'kredi gelmedi'],
    link: { label: 'Credit history', to: ROUTE_PATHS.CREDIT_HISTORY },
  },
  {
    id: 'upload-formats',
    category: 'documents',
    question: 'Which files can I upload, and how large can they be?',
    answer: [
      'PDF, JPG, PNG, DOC and DOCX files, up to 6.0 MB each.',
      'You can drag files onto the upload area or browse for them, and send several at once. A file that is the wrong type or too large is turned away on its own; the rest are still uploaded.',
    ],
    keywords: ['upload', 'file', 'format', 'size', 'limit', 'pdf', 'png', 'jpg', 'docx', 'dosya', 'yükle'],
    link: { label: 'Upload documents', to: ROUTE_PATHS.DOCUMENTS },
    popular: true,
  },
  {
    id: 'document-statuses',
    category: 'documents',
    question: 'What do the document statuses mean?',
    answer: [
      'Pending: the document is waiting to be processed. Processing: it is being processed now. Completed: the result is ready. Failed: processing did not succeed.',
      'Open a document to see its result and its activity log. You can filter the list by status and by product.',
    ],
    keywords: ['status', 'pending', 'processing', 'completed', 'failed', 'durum', 'result'],
    link: { label: 'Documents', to: ROUTE_PATHS.DOCUMENTS },
  },
  {
    id: 'cached-documents',
    category: 'documents',
    question: 'What does “answered from cache” mean?',
    answer: [
      'When an identical file has been processed before, the earlier result is reused and the upload says it was answered from cache. The document page shows whether a document came from cache.',
    ],
    keywords: ['cache', 'duplicate', 'same file', 'identical', 'önbellek'],
    link: { label: 'Documents', to: ROUTE_PATHS.DOCUMENTS },
  },
  {
    id: 'create-api-key',
    category: 'keys',
    question: 'How do I create an API key?',
    answer: [
      'Open API keys and choose Create key. Give it a name, choose Test or Production, and choose when it expires — or never.',
      'The full secret is shown once, right after you create it. Copy it and store it somewhere safe.',
    ],
    keywords: ['api key', 'token', 'secret', 'create', 'new key', 'anahtar', 'oluştur', 'integration'],
    link: { label: 'API keys', to: ROUTE_PATHS.API_CREDENTIALS },
    popular: true,
  },
  {
    id: 'lost-api-key',
    category: 'keys',
    question: 'I lost an API key’s secret. Can I see it again?',
    answer: [
      'No. A key’s secret is shown only when it is created or regenerated, and Field cannot show it again.',
      'Choose Regenerate secret from the key’s menu to get a new one. Anything still using the old secret stops working, so update your application afterwards.',
    ],
    keywords: ['regenerate', 'forgot', 'reveal', 'show again', 'lost', 'secret', 'kayıp'],
    link: { label: 'API keys', to: ROUTE_PATHS.API_CREDENTIALS },
  },
  {
    id: 'use-api-key',
    category: 'keys',
    question: 'How do I use an API key?',
    answer: [
      'Your code sends the key in an X-API-Key header, instead of your dashboard sign-in. Sending a file this way spends credits just like an upload here, and the document appears under Documents.',
      'To try a key without writing code, use Test a key on the API keys page.',
    ],
    keywords: ['x-api-key', 'header', 'process', 'request', 'curl', 'code', 'developer', 'entegrasyon'],
    link: { label: 'Test a key', to: ROUTE_PATHS.API_CREDENTIALS },
  },
  {
    id: 'test-vs-production',
    category: 'keys',
    question: 'What is the difference between Test and Production keys?',
    answer: [
      'You choose it when you create a key. Test is meant for building and trying things out, Production for applications that are live.',
      'Give each key a clear name as well, so you can tell them apart later — for example when you need to regenerate or delete one.',
    ],
    keywords: ['environment', 'test', 'production', 'live', 'ortam'],
    link: { label: 'API keys', to: ROUTE_PATHS.API_CREDENTIALS },
  },
  {
    id: 'see-usage',
    category: 'account',
    question: 'Where can I see how much I have used?',
    answer: [
      'Analytics shows usage and spend over time — weekly, monthly or yearly — with a breakdown by product, and the Dashboard summarises the last 7 days, 30 days or 12 months. Credit history lists every credit added to or taken from your account.',
    ],
    keywords: ['analytics', 'usage', 'spend', 'cost', 'chart', 'statistics', 'kullanım', 'harcama'],
    link: { label: 'Analytics', to: ROUTE_PATHS.ANALYTICS },
  },
  {
    id: 'change-password',
    category: 'account',
    question: 'How do I change my password or my details?',
    answer: [
      'Open Profile. You can change your name and photo there, and set a new password in the Password section.',
      'If you cannot sign in at all, use “Forgot password?” on the sign-in page to get a reset link by email.',
    ],
    keywords: ['password', 'profile', 'avatar', 'photo', 'name', 'email', 'reset', 'şifre', 'profil'],
    link: { label: 'Profile', to: ROUTE_PATHS.PROFILE },
  },
];
