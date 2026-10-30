import { z } from "zod";

// Contact form fields. The form validates with this schema and /api/contact
// validates the same fields again on the server (with length caps), so both
// sides agree on what a valid message is.
export const contactFormSchema = z.object({
    information: z.string().min(1, 'Please select a subject'),
    topic: z.string().min(1, 'Please select a topic'),
    email: z.string().email('Please enter a valid email'),
    name: z.string().min(2, 'Name is required'),
    phone: z.string().min(6, 'Please enter a valid phone number'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
