"use client";

import { useEffect } from "react";
import useThemeStore from "@/stores/useThemeStore";


export default function PrivacyPolicy() {
    const {theme} = useThemeStore()

    useEffect(() => {
        document.title = "Privacy Policy | Verseify";
    }, []);

    return (
        <div className="min-h-screen p-6">
            <div style={{color: theme, background:(theme==='white')?'black':'white'}} className="max-w-4xl mx-auto p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
                <p className="text-gray-600 text-sm text-center mb-4">
                    Last Updated: Feb 20, 2025
                </p>

                <p className="mb-6">
                    This Privacy Policy is designed to help you understand how <b>Verseify Inc.</b> ("Verseify," "we," or "us") collects, uses, and discloses your personal information.
                </p>

                <h2 className="text-2xl font-semibold mt-6">1. WHAT DOES THIS PRIVACY POLICY APPLY TO?</h2>
                <p className="mt-2">
                    This Privacy Policy applies to personal information processed by us, including on our websites, mobile applications, and other online or offline offerings — basically anything we do.
                </p>

                <h2 className="text-2xl font-semibold mt-6">2. PERSONAL INFORMATION WE COLLECT</h2>
                <p className="mt-2">
                    The categories of personal information we collect depend on how you interact with us, our Services, and the requirements of applicable law.
                </p>

                <h3 className="text-xl font-medium mt-4">A. Information You Provide Directly</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Account creation details (Name, Email, etc.).</li>
                    <li>Content you post on forums.</li>
                    <li>Payment and purchase-related information.</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">B. Information Collected Automatically</h3>
                <p className="mt-2">
                    We may collect details like IP address, browser type, and location when you visit our website.
                </p>

                <h2 className="text-2xl font-semibold mt-6">3. HOW WE USE YOUR INFORMATION</h2>
                <p className="mt-2">
                    We use your data to provide services, improve our platform, ensure security, and send relevant communications.
                </p>

                <h2 className="text-2xl font-semibold mt-6">4. HOW WE DISCLOSE YOUR INFORMATION</h2>
                <p className="mt-2">
                    Your data may be shared with third-party service providers, compliance authorities, and other business partners where necessary.
                </p>

                <h2 className="text-2xl font-semibold mt-6">5. YOUR PRIVACY CHOICES AND RIGHTS</h2>
                <p className="mt-2">
                    You have the right to access, update, or delete your personal data. If you have any questions, contact us at <a href="mailto:srinivasbatthula.mypc@gmail.com" className="text-blue-500">support@verseify.to</a>.
                </p>

                <h2 className="text-2xl font-semibold mt-6">6. INTERNATIONAL DATA TRANSFERS</h2>
                <p className="mt-2">
                    We may transfer your data internationally where necessary, always ensuring compliance with applicable laws.
                </p>

                <h2 className="text-2xl font-semibold mt-6">7. CHILDREN'S INFORMATION</h2>
                <p className="mt-2">
                    Our services are not intended for children under 13 years of age. We do not knowingly collect information from minors.
                </p>

                <h2 className="text-2xl font-semibold mt-6">8. CONTACT US</h2>
                <p className="mt-2">
                    If you have any questions about our privacy practices, please contact us at <a href="mailto:srinivasbatthula.mypc@gmail.com" className="text-blue-500">support@verseify.to</a>.
                </p>

                <div className="text-center mt-8">
                    <a href="/" className="text-blue-600 font-semibold underline hover:text-blue-800">Back to Home</a>
                </div>
            </div>
        </div>
    );
}
