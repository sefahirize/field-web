"use client"
import { useState, useMemo } from "react";
import { Button, Select } from "@landing/components/Ui";
import { type CountryCode as Country, getCountries, getCountryCallingCode } from 'libphonenumber-js';
import * as Flags from 'country-flag-icons/react/1x1';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
// import type { Country } from 'react-phone-number-input';
// import PhoneInput from 'react-phone-number-input'

export const LIST_INFORMATION = [
    {
        value: 'sales',
        label: 'Sales',
    },
    {
        value: 'support',
        label: 'Support',
    },
];

export const DATA_CONTACT_LIST_TOPIC = [
    {
        value: 'get-a-quote',
        label: 'Get a Quote',
    },
    {
        value: 'startup-discount',
        label: 'Startup discount',
    },
    {
        value: 'adding-or-removing-data',
        label: 'Adding or removing data',
    },
    {
        value: 'info',
        label: 'Info',
    },
    {
        value: 'press-pr',
        label: 'Press & PR ',
    },
    {
        value: 'other',
        label: 'Other',
    },
];

const regionDisplayNames =
    typeof Intl !== 'undefined'
        ? new Intl.DisplayNames(['en'], { type: 'region' })
        : null;

const Flag = ({ countryCode, title }: { countryCode: string, title: string }) => {
    const FlagComponent = Flags[countryCode.toUpperCase() as keyof typeof Flags];
    return FlagComponent ? (
        <div className="w-5 h-5 flex items-center rounded-full overflow-hidden font-medium">
            <FlagComponent title={title} />
        </div>
    ) : null;
};

// Form validation schema
const contactFormSchema = z.object({
    information: z.string().min(1, 'Please select a subject'),
    topic: z.string().min(1, 'Please select a topic'),
    email: z.string().email('Please enter a valid email'),
    name: z.string().min(2, 'Name is required'),
    phone: z.string().min(6, 'Please enter a valid phone number'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const CustomPhoneInput = ({ inputClass, value, onPhonePrefixChange, onChange, error }: {
    inputClass: string;
    value: string;
    onPhonePrefixChange: (value: string) => void;
    onChange: (value: string) => void;
    error?: string;
}) => {
    const [selectedCountry, setSelectedCountry] = useState("US");

    const countryOptions = useMemo(
        () =>
            getCountries().map((country) => ({
                value: country,
                label: `+${getCountryCallingCode(country)}`,
                countryName: regionDisplayNames?.of(country) ?? '',
                icon: <Flag countryCode={country} title={country} />,
                className: 'flex items-center gap-x-2 h-full',
            })),
        [],
    );

    const handleCountryChange = (value: string | { value: string }) => {
        const countryCode = typeof value === 'string' ? value : value.value;
        setSelectedCountry(countryCode);
        onPhonePrefixChange(`+${getCountryCallingCode(countryCode as Country)}`);
        // onChange(`+${getCountryCallingCode(countryCode as Country)}${typeof value === 'string' ? value : ''}`);
    };

    return (
        <div className="flex flex-col w-full">
            <div className="flex">
                <div className="w-[106px] mr-2">
                    <Select
                        addLine
                        searchable
                        searchPlaceholder="Country or dialing code"
                        searchKeys={['label', 'value', 'countryName']}
                        options={countryOptions}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        returnObject={false}
                        className="!min-w-[106px]"
                        dropdownPanelClassName="min-w-[min(100vw-2rem,280px)] left-0"
                        placeholder="+1"
                        textClassNames={{
                            notSelected: 'text-natural-gray-default font-medium',
                            selected: 'text-natural-gray-default font-medium'
                        }}
                        selectedClassName="px-4 py-3 rounded-xl text-sm font-medium"
                    />
                </div>
                <input
                    type="phone"
                    value={value}
                    onChange={(e) => {
                        // Only allow numbers
                        const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                        onChange(numbersOnly);
                    }}
                    onKeyPress={(e) => {
                        // Prevent non-numeric key presses
                        if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    placeholder="Phone number"
                    className={`${inputClass} ${error ? 'border-red-500' : ''}`}
                    maxLength={15} // Reasonable max length for phone numbers
                    inputMode="numeric" // Shows numeric keyboard on mobile devices
                    pattern="[0-9]*"
                />
                {/* <PhoneInput
                    type="phone"
                    value={value}
                    onChange={(value: any) => onChange(value)}
                    placeholder="Phone number"
                    className={`${inputClass} ${error ? 'border-red-500' : ''}`}
                    disableDropdown={true}
                    countrySelectProps={{ disabled: true }}
                    // @ts-ignore
                    countrySelectComponent={"null"}

                /> */}
            </div>
            {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </div>
    );
};

interface FormStatus {
    type: 'success' | 'error' | null;
    message: string;
}

const ContactForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState<FormStatus>({ type: null, message: '' });
    const inputClass = "w-full rounded-xl border border-natural-gray-border leading-[normal] py-3 px-4 text-sm placeholder:text-sm placeholder:text-natural-gray-default placeholder:font-medium";

    const [phonePrefix, setPhonePrefix] = useState('+1');
    const { executeRecaptcha } = useGoogleReCaptcha();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        control,
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            topic: 'get-a-quote',
            information: 'sales',
        }
    });

    // useWatch instead of watch(): same values, and safe for the React Compiler.
    const [topic, subject, phone] = useWatch({ control, name: ['topic', 'information', 'phone'] });

    const onSubmit = async (data: ContactFormData) => {
        try {
            setIsSubmitting(true);
            setFormStatus({ type: null, message: '' });

            // Get reCAPTCHA token
            if (!executeRecaptcha) {
                throw new Error('reCAPTCHA is not loaded. Please refresh the page and try again.');
            }

            const recaptchaToken = await executeRecaptcha('contact_form');

            const bodyData = {
                ...data,
                phone: `${phonePrefix}${data.phone}`,
                recaptchaToken,
            }
            
            // Next api route: /api/contact. mailchip çalışmadığı için contact formu direk backend ile iletişime geçiyoruz.
            const response = await fetch(`/api/contact/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to send message. Please try again.');
            }

            setFormStatus({
                type: 'success',
                message: 'Message sent successfully! We will get back to you soon.'
            });
            reset();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to send message. Please try again.';
            
            setFormStatus({
                type: 'error',
                message: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {formStatus.type && (
                <div className={`p-4 rounded-lg ${formStatus.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {formStatus.message}
                </div>
            )}
            <div>
                <span className="text-lg font-semibold text-natural-navy">Select a topic:</span>
                <div className="mt-4 flex flex-wrap">
                    {DATA_CONTACT_LIST_TOPIC.map((item, index) => (
                        <div
                            key={index}
                            className="mr-2 mb-3 h-8 rounded-2xl overflow-hidden cursor-pointer"
                            onClick={() => setValue('topic', item.value)}
                        >
                            <div className={`h-full px-3 pl-1.5 bg-[#f5f5f6] ${item.value === topic ? 'bg-[#cfe1fe]' : 'hover:bg-[#cfe1fe]'} transition-all duration-300 ease-out text-[0.8125rem] inline-flex items-center justify-center text-[rgba(0,0,0,0.87)]`}>
                                <svg className={`${item.value === topic ? 'scale-100 opacity-100 visible w-4' : 'scale-0 opacity-0 invisible w-0'} h-4 transition-all duration-300 ease-out`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 16 16">
                                    <path fill="#0A53CA" fillRule="evenodd" d="M13.972 4.029c.26.26.26.682 0 .942l-7 7a.667.667 0 0 1-.943 0l-3.5-3.5a.667.667 0 1 1 .943-.942L6.5 10.557 13.03 4.03c.26-.26.682-.26.943 0" clipRule="evenodd">
                                    </path>
                                </svg>
                                <span className="font-medium text-sm leading-5 text-natural-navy pl-1">{item.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
                {errors.topic && (
                    <span className="text-red-500 text-sm">{errors.topic.message}</span>
                )}
            </div>

            <div>
                <span className="text-lg font-semibold text-natural-navy">Subject</span>
                <div className="mt-4 flex gap-x-4">
                    {LIST_INFORMATION.map((item) => (
                        <button
                            type="button"
                            key={item.value}
                            onClick={() => setValue('information', item.value)}
                            className={`h-10 px-3 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-x-2 ${subject === item.value
                                ? 'bg-[#EEF4FF] text-[#2563EB]'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${subject === item.value
                                ? 'border-[#2563EB]'
                                : 'border-gray-300'
                                }`}>
                                {subject === item.value && (
                                    <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                                )}
                            </div>
                            {item.label}
                        </button>
                    ))}
                </div>
                {errors.information && (
                    <span className="text-red-500 text-sm">{errors.information.message}</span>
                )}
            </div>

            <div className="space-y-3">
                <div>
                    <input
                        type="text"
                        placeholder="Full Name*"
                        className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
                        {...register('name')}
                    />
                    {errors.name && (
                        <span className="text-red-500 text-sm">{errors.name.message}</span>
                    )}
                </div>

                <div>
                    <input
                        type="email"
                        placeholder="E-mail address*"
                        className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`}
                        {...register('email')}
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm">{errors.email.message}</span>
                    )}
                </div>

                <CustomPhoneInput
                    inputClass={inputClass}
                    value={phone}
                    onPhonePrefixChange={(value) => setPhonePrefix(value)}
                    onChange={(value) => setValue('phone', value)}
                    error={errors.phone?.message}
                />

                <div>
                    <textarea
                        rows={7}
                        placeholder="How can we help you?*"
                        className={`${inputClass} ${errors.message ? 'border-red-500' : ''}`}
                        {...register('message')}
                    />
                    {errors.message && (
                        <span className="text-red-500 text-sm">{errors.message.message}</span>
                    )}
                </div>

                <div>
                    <Button
                        type="submit"
                        className='max-w-[117px]'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send'}
                    </Button>
                    <p className="mt-3 text-xs text-natural-gray-default">
                        This site is protected by reCAPTCHA and the Google{' '}
                        <a 
                            href="https://policies.google.com/privacy" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            Privacy Policy
                        </a>
                        {' '}and{' '}
                        <a 
                            href="https://policies.google.com/terms" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            Terms of Service
                        </a>
                        {' '}apply.
                    </p>
                </div>
            </div>
        </form>
    );
};

export default ContactForm;