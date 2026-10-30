"use client"

import { useState, FormEvent } from "react";
import { API_URL_PROD } from "@landing/constants/Global";

const EmailForm: React.FC<{ className: string }> = ({ className = "" }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        if (!email) {
            setError("Email is required");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL_PROD}/api/contact/email-collect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit email');
            }

            const submittedEmail = email;
            setEmail("");
            setSuccess(`Subscribed as ${submittedEmail}!`);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to submit email. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={className}>
                <div className="bg-black rounded-xl px-3 py-2 flex items-center justify-center">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        disabled={isLoading}
                        className="bg-transparent text-[#BFBFBF] text-sm font-normal outline-none flex-1 px-3"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-3 py-2.5 bg-white text-black text-sm font-normal rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Submitting..." : "Get notified"}
                    </button>
                </div>

                {error && (
                    <p className="text-red-500 text-xs mt-2">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-green-500 text-xs mt-2">
                        {success}
                    </p>
                )}
            </form>
        </>
    )
}

export default EmailForm;