"use client";

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ReactNode } from 'react';

interface ReCaptchaProviderProps {
  children: ReactNode;
}

const ReCaptchaProvider = ({ children }: ReCaptchaProviderProps) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  if (!siteKey) {
    console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. reCAPTCHA will not work.');
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      language="en"
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default ReCaptchaProvider;

