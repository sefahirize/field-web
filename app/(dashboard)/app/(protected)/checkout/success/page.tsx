import { PaymentResult } from "@dashboard/pages/checkout/payment-result";

// Where Stripe sends the user back after paying (and where `/?session_id=` is redirected).
export default function CheckoutSuccessPage() {
  return <PaymentResult outcome="success" />;
}
