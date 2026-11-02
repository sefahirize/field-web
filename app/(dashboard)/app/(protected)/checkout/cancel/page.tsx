import { PaymentResult } from "@dashboard/pages/checkout/payment-result";

// Where Stripe sends the user back after leaving the payment page.
export default function CheckoutCancelPage() {
  return <PaymentResult outcome="cancel" />;
}
