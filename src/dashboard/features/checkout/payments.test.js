import { describe, it, expect, vi } from 'vitest';
import { toPaymentState } from './checkoutApi';
import { readResumeUrl } from './pendingPayment';

vi.mock('axios', () => ({}));

describe('toPaymentState', () => {
  it('calls a paid session paid, whatever its status', () => {
    expect(toPaymentState({ status: 'complete', payment_status: 'paid' })).toBe('paid');
    expect(toPaymentState({ data: { payment_status: 'no_payment_required' } })).toBe('paid');
  });

  it('tells an open, unpaid session (nobody paid) from one still settling', () => {
    expect(toPaymentState({ status: 'open', payment_status: 'unpaid' })).toBe('open');
    expect(toPaymentState({ status: 'complete', payment_status: 'unpaid' })).toBe('pending');
    expect(toPaymentState({})).toBe('pending');
  });

  it('treats an expired or cancelled session as expired', () => {
    expect(toPaymentState({ status: 'expired', payment_status: 'unpaid' })).toBe('expired');
    expect(toPaymentState({ status: 'open', payment_status: 'canceled' })).toBe('expired');
  });
});

describe('readResumeUrl', () => {
  it('returns a stripe.com https URL', () => {
    const url = 'https://checkout.stripe.com/c/pay/cs_test_123#fid';
    expect(readResumeUrl({ checkoutUrl: url })).toBe(url);
  });

  it('refuses anything else that localStorage might hold', () => {
    expect(readResumeUrl({ checkoutUrl: 'http://checkout.stripe.com/c/pay/x' })).toBeNull();
    expect(readResumeUrl({ checkoutUrl: 'https://evilstripe.com/x' })).toBeNull();
    expect(readResumeUrl({ checkoutUrl: 'https://stripe.com.evil.example/x' })).toBeNull();
    expect(readResumeUrl({ checkoutUrl: 'javascript:alert(1)' })).toBeNull();
    expect(readResumeUrl({})).toBeNull();
    expect(readResumeUrl(null)).toBeNull();
  });
});
