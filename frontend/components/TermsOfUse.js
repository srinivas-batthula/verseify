'use client'

import React from "react";


const TermsOfUse = () => {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>
            <p>Effective Date: [2025]</p>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mt-4">1. Terms</h2>
                <p>
                    By accessing this website, you agree to comply with our terms of use,
                    all applicable laws, and regulations.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mt-4">2. Use License</h2>
                <p>You may:</p>
                <ul className="list-disc pl-6">
                    <li>Download one copy of materials for personal use.</li>
                    <li>Not modify, copy, or use materials for commercial purposes.</li>
                </ul>
                <p>
                    This license automatically terminates if you violate any restrictions.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mt-4">3. Disclaimer</h2>
                <p>
                    All content is provided "as is" without warranties. We do not
                    guarantee accuracy or reliability.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mt-4">4. Limitations</h2>
                <p>
                    We are not liable for any damages arising from the use of our
                    website.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mt-4">5. Changes to Terms</h2>
                <p>
                    We may update these terms at any time without prior notice. By
                    continuing to use our website, you agree to the latest version.
                </p>
            </section>

            <p className="mt-4">
                If you have any questions, email us at{" "}
                <a href="mailto:srinivasbatthula.mypc@gmail.com" className="text-blue-600 underline">
                    support@[verseify].com
                </a>.
            </p>
        </main>
    )
}

export default TermsOfUse;
