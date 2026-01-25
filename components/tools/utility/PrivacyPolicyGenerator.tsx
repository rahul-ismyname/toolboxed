'use client';

import { useState } from 'react';
import { Shield, Copy, Check } from 'lucide-react';

export function PrivacyPolicyGenerator() {
    const [companyName, setCompanyName] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [email, setEmail] = useState('');

    // New Feature: Granular Options
    const [collectsCookies, setCollectsCookies] = useState(true);
    const [collectsAnalytics, setCollectsAnalytics] = useState(false);
    const [collectsPayments, setCollectsPayments] = useState(false);
    const [hasAccount, setHasAccount] = useState(false);

    const [generated, setGenerated] = useState(false);
    const [policy, setPolicy] = useState('');
    const [copied, setCopied] = useState(false);

    const generate = () => {
        if (!companyName || !websiteUrl || !email) return;

        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let text = `PRIVACY POLICY\n\n`;
        text += `Last updated: ${date}\n\n`;

        text += `1. INTRODUCTION\n`;
        text += `Welcome to ${companyName} ("we", "our", "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (${websiteUrl}) and tell you about your privacy rights.\n\n`;

        text += `2. THE DATA WE COLLECT\n`;
        text += `We may collect, use, store and transfer different kinds of personal data about you, including:\n`;
        text += `- Identity Data: First name, last name${hasAccount ? ', username, or similar identifier' : ''}.\n`;
        text += `- Contact Data: Email address${collectsPayments ? ', billing address' : ''}.\n`;
        text += `- Technical Data: IP address, browser type and version, time zone setting, operating system and platform.\n`;
        if (collectsPayments) text += `- Transaction Data: Details about payments to and from you and other details of products and services you have purchased from us.\n`;
        text += `\n`;

        text += `3. HOW WE USE YOUR DATA\n`;
        text += `We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:\n`;
        text += `- To provide and maintain our Service.\n`;
        text += `- To notify you about changes to our Service.\n`;
        if (hasAccount) text += `- To manage your account and registration.\n`;
        if (collectsPayments) text += `- To process and deliver your order including managing payments, fees and charges.\n`;
        text += `- Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.\n\n`;

        if (collectsCookies || collectsAnalytics) {
            text += `4. COOKIES AND TRACKING\n`;
            if (collectsCookies) {
                text += `We use Cookies and similar tracking technologies to track the activity on our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.\n`;
            }
            if (collectsAnalytics) {
                text += `We may also use third-party Service Providers to monitor and analyze the use of our Service (e.g., Google Analytics). These providers have their own Privacy Policies addressing how they use such information.\n`;
            }
            text += `\n`;
        }

        text += `5. DATA SECURITY\n`;
        text += `We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.\n\n`;

        text += `6. CONTACT US\n`;
        text += `If you have any questions about this privacy policy, please contact us at: ${email}`;

        setPolicy(text);
        setGenerated(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(policy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                    <Shield className="w-5 h-5 text-slate-900 dark:text-slate-100" />
                    Privacy Policy Generator
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                    Create a customized privacy policy for your projects in seconds.
                </p>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2">1. Company Details</h3>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Company / App Name</label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                placeholder="My Awesome App"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Website URL</label>
                            <input
                                type="url"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                placeholder="https://example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Contact Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                placeholder="support@example.com"
                            />
                        </div>
                    </div>

                    {/* Data Options */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2">2. Data Collection</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={collectsCookies}
                                    onChange={(e) => setCollectsCookies(e.target.checked)}
                                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Use Cookies</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={collectsAnalytics}
                                    onChange={(e) => setCollectsAnalytics(e.target.checked)}
                                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Analytics (e.g. Google Analytics)</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={collectsPayments}
                                    onChange={(e) => setCollectsPayments(e.target.checked)}
                                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Process Payments</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={hasAccount}
                                    onChange={(e) => setHasAccount(e.target.checked)}
                                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">User Accounts / Registration</span>
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={generate}
                        disabled={!companyName || !websiteUrl || !email}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Generate Professional Policy
                    </button>
                </div>

                <div className="relative bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 h-[600px] overflow-hidden flex flex-col">
                    {!generated ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-600">
                            <Shield className="w-16 h-16 mb-4 opacity-20" />
                            <p className="max-w-xs mx-auto">Configure your settings and click generate to create your custom policy.</p>
                        </div>
                    ) : (
                        <>
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg shadow-sm hover:text-slate-900 dark:hover:text-white transition-colors"
                                    title="Copy Text"
                                >
                                    {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            <pre className="flex-1 overflow-y-auto font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed pr-2">
                                {policy}
                            </pre>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
