'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check } from 'lucide-react';

export function QrCodeGenerator() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const handleDownload = () => {
        if (!text) return;

        const svg = document.getElementById('qr-code-svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            if (ctx) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.download = 'qrcode.png';
                downloadLink.href = pngFile;
                downloadLink.click();
            }
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    const copyToClipboard = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="content" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                Content
                            </label>
                            <textarea
                                id="content"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter text or URL to generate QR code..."
                                className="w-full h-40 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleDownload}
                                disabled={!text}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download PNG
                            </button>
                            <button
                                onClick={copyToClipboard}
                                disabled={!text}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? 'Copied!' : 'Copy Text'}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            {text ? (
                                <QRCodeSVG
                                    id="qr-code-svg"
                                    value={text}
                                    size={256}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            ) : (
                                <div className="w-64 h-64 flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-400 dark:text-slate-600">
                                    <span className="text-sm">Enter text to generate</span>
                                </div>
                            )}
                        </div>
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                            Scan with your phone to test
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
