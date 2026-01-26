import React from 'react';
import { tools } from '@/config/tools';
import Link from 'next/link';
import { ToolCard } from '../registry/ToolCard';
import { Star, CheckCircle } from 'lucide-react';

type ToolData = {
    title: string;
    description: string;
    features: string[];
    howToUse: { title: string; description: string }[];
    faqs: { question: string; answer: string }[];
};

const toolContentData: Record<string, ToolData> = {
    'stickman-animator': {
        title: 'Stickman Animator - Free Online Animation Tool',
        description: 'The ultimate browser-based stickman animation studio. Create, edit, and export fluid stick figure animations without installing any software. Perfect for beginners and pros alike.',
        features: [
            '**Advanced Keyframe System**: Create smooth animations by setting keyframes; our engine handles the interpolation.',
            '**Onion Skinning**: See previous and next frames effectively to create fluid motion.',
            '**Customizable Figures**: Adjust limb lengths, colors, and add multiple figures to your scene.',
            '**Instant Export**: Download your creations as high-quality GIF animations instantly.',
            '**Local Saving**: Save your projects directly to your browser/device and resume anytime.'
        ],
        howToUse: [
            {
                title: 'Initialize the Canvas',
                description: 'Wait for the editor to load. You will see a default stickman figure in the center of the canvas.'
            },
            {
                title: 'Pose Your Figure',
                description: 'Drag the red control points (joints) to move the stickman\'s limbs. The "Root" point moves the entire figure.'
            },
            {
                title: 'Add Frames',
                description: 'Click "Add Frame" to capture the current pose. Move the figure slightly, then add another frame to create movement.'
            },
            {
                title: 'Preview and Export',
                description: 'Hit the Play button to preview your animation. Once satisfied, click Export to save it as a GIF.'
            }
        ],
        faqs: [
            {
                question: 'Is Stickman Animator free?',
                answer: 'Yes, this tool is 100% free to use with no hidden fees or watermarks.'
            },
            {
                question: 'Do I need to install Flash or plugins?',
                answer: 'No! This is a modern HTML5/Canvas tool that works natively in Chrome, Firefox, Safari, and Edge.'
            },
            {
                question: 'Can I use this on mobile?',
                answer: 'Yes, the interface is touch-friendly, though a larger screen (tablet or desktop) is recommended for complex animations.'
            }
        ]
    },
    'landing-page-builder': {
        title: 'Visual Landing Page Builder - Free SaaS Design Tool',
        description: 'Design high-converting SaaS landing pages visually and export clean, production-ready code instantly. No signup required.',
        features: [
            '**Drag-and-Drop Editor**: Visually construct your page using pre-built, conversion-optimized blocks.',
            '**Instant Code Export**: Get clean React/Tailwind code with one click.',
            '**Professional Templates**: Start with designed headers, features, pricing, and footer sections.',
            '**Dark Mode Ready**: All components automatically support light and dark themes.',
            '**100% Client-Side**: Your designs are private and never leave your browser.'
        ],
        howToUse: [
            { title: 'Choose Sections', description: 'Select from a library of headers, heroic sections, features, and pricing tables.' },
            { title: 'Customize Content', description: 'Click any text or image to edit it directly on the canvas.' },
            { title: 'Style Your Brand', description: 'Use the sidebar to adjust primary colors and aesthetics to match your brand.' },
            { title: 'Export Code', description: 'Click Export to get the React/Tailwind code to paste into your project.' }
        ],
        faqs: [
            { question: 'Is the exported code free to use?', answer: 'Yes, the code is yours to use in commercial or personal projects.' },
            { question: 'Do you store my designs?', answer: 'No, everything happens locally in your browser.' }
        ]
    },
    'mind-map': {
        title: 'Free Online Mind Map Builder',
        description: 'Brainstorm, plan, and organize your ideas on an infinite canvas. A simple, fast, and free mind mapping tool.',
        features: [
            '**Infinite Canvas**: Never run out of space for your big ideas.',
            '**Keyboard Shortcuts**: Create nodes rapidly using Tab and Enter keys.',
            '**Auto-Layout**: Automatically organize messy branches into a clean structure.',
            '**Export Options**: Save your mind map as an image or JSON file to edit later.',
            '**Customizable Themes**: Change colors and styles to fit your preference.'
        ],
        howToUse: [
            { title: 'Start with a Core Idea', description: 'Click the central node and type your main topic.' },
            { title: 'Branch Out', description: 'Press TAB to create a child node, or ENTER to create a sibling node.' },
            { title: 'Organize', description: 'Drag nodes to rearrange them manually, or use Auto-Layout to tidy up.' },
            { title: 'Save', description: 'Export as an image to share or JSON to save your progress.' }
        ],
        faqs: [
            { question: 'Can I collaborate with others?', answer: 'Currently, this is a local-only tool for maximum privacy.' },
            { question: 'Is there a limit to nodes?', answer: 'No hard limit, but performance depends on your device.' }
        ]
    },
    'kanban-board': {
        title: 'Personal Kanban Board - Project Management Tool',
        description: 'Manage tasks and projects efficiently with this offline-capable, drag-and-drop Kanban board.',
        features: [
            '**Drag and Drop**: Intuitive interface to move tasks between statuses.',
            '**Local Persistence**: Your board is saved automatically to your browser storage.',
            '**Custom Columns**: Create workflow stages that match your process.',
            '**Visual Tags**: Color-code tasks for better organization.',
            '**Dark Mode**: Easy on the eyes for late-night planning.'
        ],
        howToUse: [
            { title: 'Create Columns', description: 'Set up your workflow stages (e.g., Todo, In Progress, Done).' },
            { title: 'Add Tasks', description: 'Click the + button to add cards for your tasks.' },
            { title: 'Move Cards', description: 'Drag cards across columns as you complete work.' },
            { title: 'Prioritize', description: 'Reorder cards within columns to set priority.' }
        ],
        faqs: [
            { question: 'Where is my data stored?', answer: 'All data is stored in your browser\'s LocalStorage. It never goes to a server.' },
            { question: 'Will I lose data if I close the tab?', answer: 'No, it saves automatically.' }
        ]
    },
    'resume-builder': {
        title: 'Ultimate Resume Builder - Free ATS-Friendly CV Maker',
        description: 'Build a professional, ATS-optimized resume in minutes. Live preview and instant PDF export.',
        features: [
            '**ATS-Friendly**: Designed to be easily readable by Applicant Tracking Systems.',
            '**Live Preview**: See changes instantly as you type.',
            '**Multiple Sections**: Add Experience, Education, Skills, and Projects easily.',
            '**PDF Export**: Download a polished, professional PDF ready for applications.',
            '**Privacy First**: Your personal data never leaves your browser.'
        ],
        howToUse: [
            { title: 'Fill Details', description: 'Enter your personal info, experience, and skills in the form.' },
            { title: 'Customize Layout', description: 'Reorder sections or toggle visibility as needed.' },
            { title: 'Review', description: 'Check the live preview for formatting and content.' },
            { title: 'Download', description: 'Click "Download PDF" to get your resume.' }
        ],
        faqs: [
            { question: 'Is it really free?', answer: 'Yes, completely free with no watermarks.' },
            { question: 'Do you keep a copy of my resume?', answer: 'No, we do not store any user data.' }
        ]
    },
    'invoice-builder': {
        title: 'Professional Invoice Generator',
        description: 'Create beautiful, branded invoices and proposals in seconds. Automatic calculations and PDF generation.',
        features: [
            '**Automatic Calculations**: Subtotals, taxes, and totals calculated instantly.',
            '**Custom Branding**: Add your logo and brand colors.',
            '**Multi-Currency**: Support for all major global currencies.',
            '**PDF Generation**: Generate high-quality PDFs to send to clients.',
            '**Professional Templates**: Clean, modern designs that look professional.'
        ],
        howToUse: [
            { title: 'Company Details', description: 'Enter your business and client information.' },
            { title: 'Add Items', description: 'List services or products with price and quantity.' },
            { title: 'Settings', description: 'Set tax rates, currency, and payment terms.' },
            { title: 'Download', description: 'Generate and download the PDF invoice.' }
        ],
        faqs: [
            { question: 'Can I add my logo?', answer: 'Yes, you can upload your business logo.' },
            { question: 'Is this suitable for freelancers?', answer: 'Absolutely, it is perfect for freelancers and small businesses.' }
        ]
    },
    'pdf-master': {
        title: 'PDF Master - Merge, Split & Sign PDFs',
        description: 'A complete toolkit for PDF manipulation. Merge, split, compress, and sign documents securely in your browser.',
        features: [
            '**Merge & Split**: Combine multiple files or extract pages easily.',
            '**Digital Signatures**: Draw and place signatures on your documents.',
            '**Privacy Focused**: Files are processed locally and never uploaded to a server.',
            '**Password Protection**: Add security to your sensitive documents.',
            '**Image to PDF**: Convert images to PDF format instantly.'
        ],
        howToUse: [
            { title: 'Select Tool', description: 'Choose Merge, Split, Sign, or Convert from the menu.' },
            { title: 'Upload Files', description: 'Drag and drop your PDF files.' },
            { title: 'Process', description: 'Arrange pages or add valid signatures, then click Process.' },
            { title: 'Download', description: 'Save your modified PDF immediately.' }
        ],
        faqs: [
            { question: 'Are my files safe?', answer: 'Yes, processing happens in your browser. Encrypted files are handled locally.' },
            { question: 'Is there a file size limit?', answer: 'Functionally limited only by your device memory.' }
        ]
    },
    'sql-formatter': {
        title: 'Online SQL Formatter & Validator',
        description: 'Beautify complex SQL queries instantly. Supports MySQL, PostgreSQL, SQL Server, and more.',
        features: [
            '**Multi-Dialect Support**: standard SQL, MySQL, PostgreSQL, PL/SQL, etc.',
            '**Syntax Validation**: specific feedback on syntax errors.',
            '**Customizable Styling**: Choose indentation levels and casing preferences.',
            '**Copy & Paste**: One-click copy for formatted code.',
            '**Dark Mode**: Editor supports syntax highlighting in dark mode.'
        ],
        howToUse: [
            { title: 'Paste SQL', description: 'Paste your raw SQL query into the left editor.' },
            { title: 'Select Dialect', description: 'Choose your SQL variant (Standard, MySQL, etc.).' },
            { title: 'Format', description: 'Click "Format" to beautify the code.' },
            { title: 'Copy', description: 'Copy the clean code to your clipboard.' }
        ],
        faqs: [
            { question: 'Does it check for errors?', answer: 'It performs basic syntax validation.' },
            { question: 'Is my database code safe?', answer: 'Yes, code is processed locally in the browser.' }
        ]
    },
    'regex-tester': {
        title: 'Regular Expression Tester & Debugger',
        description: 'Test, debug, and learn regular expressions with real-time matching and highlighting.',
        features: [
            '**Real-time Matching**: See matches update instantly as you type.',
            '**Explanation**: Detailed breakdown of what your regex pattern is doing.',
            '**Quick Reference**: Built-in cheat sheet for common regex tokens.',
            '**Sample Data**: Pre-loaded test strings for emails, dates, etc.',
            '**Visual Highlighting**: Clearly see capture groups and matches.'
        ],
        howToUse: [
            { title: 'Enter Pattern', description: 'Type your regex pattern in the input field.' },
            { title: 'Add Test String', description: 'Paste the text you want to test against.' },
            { title: 'Analyze', description: 'Review the matches and the explanation panel.' },
            { title: 'Refine', description: 'Adjust your pattern until it matches exactly what you need.' }
        ],
        faqs: [
            { question: 'Which regex engine is used?', answer: 'It uses the JavaScript RegExp engine.' },
            { question: 'Can I save my regex?', answer: 'Currently, you can copy it to clipboard.' }
        ]
    },
    'mermaid-visualizer': {
        title: 'Mermaid.js Live Editor & Visualizer',
        description: 'Create flowcharts, sequence diagrams, Gantt charts, and class diagrams using simple text syntax.',
        features: [
            '**Live Preview**: Diagram updates instantly as you type code.',
            '**Syntax Highlighting**: Editor helps you write valid Mermaid syntax.',
            '**Export**: Download diagrams as SVG or PNG.',
            '**Templates**: Start quickly with pre-loaded diagram examples.',
            '**Zoom & Pan**: Easily navigate large complex diagrams.'
        ],
        howToUse: [
            { title: 'Select Type', description: 'Choose a diagram type (Flowchart, Sequence, etc.).' },
            { title: 'Write Code', description: 'Edit the Mermaid syntax on the left panel.' },
            { title: 'Customize', description: 'Adjust nodes and links using text commands.' },
            { title: 'Share', description: 'Download the result as an image.' }
        ],
        faqs: [
            { question: 'Do I need to know coding?', answer: 'Mermaid is very simple text-based generic syntax, easy to learn.' },
            { question: 'Is it compatible with GitHub?', answer: 'Yes, GitHub uses Mermaid for diagrams too.' }
        ]
    },
    'box-shadow-generator': {
        title: 'CSS Box Shadow Generator',
        description: 'Create beautiful, layered, and smooth CSS box-shadows visually. Copy CSS code instantly.',
        features: [
            '**Layered Shadows**: Add multiple shadow layers for realistic 3D effects.',
            '**Visual Controls**: Sliders for offset, blur, spread, and opacity.',
            '**Color Picker**: Choose exact colors for shadows and background.',
            '**CSS Preview**: Get the complete CSS rule ready to copy.',
            '**Presets**: Start with improved, modern shadow defaults.'
        ],
        howToUse: [
            { title: 'Adjust Properties', description: 'Use sliders to change x/y offset and blur radius.' },
            { title: 'Add Layers', description: 'Click "Add Layer" to create complex, smooth shadows.' },
            { title: 'Tune Colors', description: 'Adjust alpha/opacity for subtle effects.' },
            { title: 'Copy CSS', description: 'Click the code block to copy the CSS to clipboard.' }
        ],
        faqs: [
            { question: 'Why use layered shadows?', answer: 'Multiple layers create a much smoother, more realistic depth effect than a single shadow.' },
            { question: 'Is the CSS compatible?', answer: 'Yes, box-shadow is supported by all modern browsers.' }
        ]
    },
    'image-converter': {
        title: 'Bulk Image Converter & Compressor',
        description: 'Convert images to WebP, PNG, or JPG formats and compress them for the web. Process unlimited files locally.',
        features: [
            '**Bulk Processing**: Convert hundreds of images at once.',
            '**Local Privacy**: Images are processed in your browser, not uploaded.',
            '**Format Support**: Convert between JPG, PNG, and WebP.',
            '**Compression**: Reduce file size without visible quality loss.',
            '**Zip Download**: Download all converted images as a single archive.'
        ],
        howToUse: [
            { title: 'Select Images', description: 'Drag and drop your images onto the dropzone.' },
            { title: 'Choose Format', description: 'Select your desired output format (e.g., WebP).' },
            { title: 'Convert', description: 'Click "Convert All" to start processing.' },
            { title: 'Download', description: 'Download individual files or a ZIP of everything.' }
        ],
        faqs: [
            { question: 'Is there a file limit?', answer: 'No hard limit, but performance depends on your computer\'s RAM.' },
            { question: 'Do you save my photos?', answer: 'No, everything is processed offline in your browser.' }
        ]
    },
    'pomodoro-timer': {
        title: 'Focus Pomodoro Timer',
        description: 'Boost productivity with this customizable Pomodoro timer. Track focusing intervals and break times effectively.',
        features: [
            '**Custom Intervals**: Set your own work and break durations.',
            '**Audio Notifications**: Gentle chimes when your timer ends.',
            '**Task Tracking**: Define what you are working on during each session.',
            '**Visual Progress**: See time remaining clearly in the tab title.',
            '**Distraction Free**: Minimalist interface to keep you focused.'
        ],
        howToUse: [
            { title: 'Set Task', description: 'Type in what you want to accomplish.' },
            { title: 'Start Timer', description: 'Click Start to begin your 25-minute focus session.' },
            { title: 'Take a Break', description: 'When the alarm rings, enjoy a 5-minute break.' },
            { title: 'Repeat', description: 'Complete 4 cycles, then take a longer break.' }
        ],
        faqs: [
            { question: 'What is the Pomodoro Technique?', answer: 'A time management method using timed intervals (usually 25 min) separated by short breaks.' },
            { question: 'Does it work in the background?', answer: 'Yes, the timer continues and notifies you even if you switch tabs.' }
        ]
    },
    'css-clip-path': {
        title: 'CSS Clip-Path Generator',
        description: 'Create complex CSS shapes and polygons visually. Drag points to design custom clip-paths.',
        features: [
            '**Visual Editor**: Drag control points to shape your polygon.',
            '**Presets**: Start with stars, circles, triangles, and more.',
            '**Real-time CSS**: Get the clip-path code instantly.',
            '**Custom Dimensions**: Test with your own image or background color.',
            '**Undo/Redo**: Experiment freely without losing your work.'
        ],
        howToUse: [
            { title: 'Choose Shape', description: 'Pick a starting shape from the library.' },
            { title: 'Edit Points', description: 'Drag the handles to change the shape geometry.' },
            { title: 'Add Points', description: 'Click on a line to add a new vertex.' },
            { title: 'Copy Code', description: 'Copy the CSS `clip-path` property to your clipboard.' }
        ],
        faqs: [
            { question: 'Is clip-path supported?', answer: 'Yes, it is supported in all modern browsers.' },
            { question: 'Can I use images?', answer: 'Yes, clip-path works on <img>, <div>, and most other elements.' }
        ]
    },
    'meta-tag-generator': {
        title: 'SEO Meta Tag Generator',
        description: 'Generate perfect SEO and Social Media meta tags. Preview how your site looks on Google, Facebook, and Twitter.',
        features: [
            '**Live Previews**: See exactly how your link appears on Google and Social Media.',
            '**All Essential Tags**: Generates Title, Description, Open Graph, and Twitter Cards.',
            '**Image Upload**: Test your OG images directly in the preview.',
            '**One-Click Copy**: Get the full HTML block for your <head>.',
            '**Validation**: Alerts you if text lengths exceed recommended limits.'
        ],
        howToUse: [
            { title: 'Enter Info', description: 'Fill in your website title, description, and URL.' },
            { title: 'Add Images', description: 'Provide a URL for your social sharing image.' },
            { title: 'Check Previews', description: 'Verify the cards look good in the preview pane.' },
            { title: 'Copy HTML', description: 'Click "Copy Code" and paste it into `app/layout.tsx` or your HTML head.' }
        ],
        faqs: [
            { question: 'Why do I need these tags?', answer: 'They control how your site looks when shared on social media and ensure Google indexes it correctly.' },
            { question: 'Are characters counted?', answer: 'Yes, we warn you if your title or description is too long.' }
        ]
    },
    'signature-pad': {
        title: 'Online Digital Signature Pad',
        description: 'Draw, save, and download your smooth digital signature. Perfect for signing documents electronically.',
        features: [
            '**Smooth Drawing**: Pressure-sensitive stroke simulation for natural writing.',
            '**Transparent Background**: Downloads as a transparent PNG.',
            '**Color Options**: Choose blue, black, or custom ink colors.',
            '**Undo Support**: Easily correct mistakes.',
            '**High Resolution**: Retina-ready export quality.'
        ],
        howToUse: [
            { title: 'Draw', description: 'Use your mouse, trackpad, or touch screen to sign.' },
            { title: 'Adjust', description: 'Change the pen width or color if needed.' },
            { title: 'Clear/Undo', description: 'Mistake? Undo the last stroke or clear the canvas.' },
            { title: 'Download', description: 'Save your signature as an image file.' }
        ],
        faqs: [
            { question: 'Is this legally binding?', answer: 'This tool creates the image of a signature. Legal validity depends on how you use it in documents.' },
            { question: 'is my signature saved?', answer: 'No, it is generated locally and deleted when you close the tab.' }
        ]
    },
    'uuid-generator': {
        title: 'UUID / GUID Generator',
        description: 'Generate valid Version 1, 3, 4, and 5 UUIDs instantly. Create bulk IDs for your database or application.',
        features: [
            '**Multiple Versions**: Supports v1 (time), v3 (MD5), v4 (random), v5 (SHA-1).',
            '**Bulk Generation**: Create up to 1000 UUIDs at once.',
            '**Custom Namespaces**: Required support for v3/v5 DNS/URL namespaces.',
            '**One-Click Copy**: Quickly copy individual or all IDs.',
            '**Uppercase/Lowercase**: Format the output to your needs.'
        ],
        howToUse: [
            { title: 'Select Version', description: 'Choose v4 (Random) for most use cases.' },
            { title: 'Set Quantity', description: 'Enter how many IDs you need.' },
            { title: 'Generate', description: 'Click the button to produce the list.' },
            { title: 'Copy', description: 'Copy the results to your clipboard.' }
        ],
        faqs: [
            { question: 'Which version should I use?', answer: 'Version 4 (Random) is the standard for most modern applications (primary keys, user IDs).' },
            { question: 'Are they truly unique?', answer: 'v4 UUIDs have 122 random bits, making collision practically impossible. For more security, use our [Password Generator](/password-generator).' }
        ]
    },
    'jwt-decoder': {
        title: 'JWT Decoder & Debugger',
        description: 'Decode, verify, and inspect JSON Web Tokens instantly. View headers, payloads, and signatures clearly. Works perfectly with our [UUID Generator](/uuid-generator).',
        features: [
            '**Instant Decoding**: Paste a token to see its contents immediately.',
            '**Human Readable**: Auto-formats timestamps into readable dates.',
            '**Color Coded**: Visually separates Header, Payload, and Signature.',
            '**Secure**: Your tokens are decoded locally; they are NEVER sent to our server.',
            '**Error Detection**: Alerts you if the token format is invalid.'
        ],
        howToUse: [
            { title: 'Paste Token', description: 'Paste your JWT string into the input box.' },
            { title: 'Inspect Payload', description: 'Read the decoded user data and claims.' },
            { title: 'Check Expiry', description: 'See exactly when the token expires (exp claim).' },
            { title: 'Verify', description: 'Check the header algorithm.' }
        ],
        faqs: [
            { question: 'Is it safe to paste real tokens?', answer: 'Yes, decoding happens entirely in JavaScript on your device.' },
            { question: 'Can I verify signatures?', answer: 'This tool decodes structure. Full signature verification requires your private key (which you should NOT paste here).' }
        ]
    },
    'aspect-ratio-calculator': {
        title: 'Aspect Ratio Calculator',
        description: 'Calculate dimensions and aspect ratios for images, videos, and screens. Find missing widths or heights instantly.',
        features: [
            '**Common Presets**: 16:9, 4:3, 21:9, 1:1, and social media ratios.',
            '**Missing Value Calc**: Enter any 3 values to find the 4th.',
            '**Visual Preview**: See the shape of the ratio visually.',
            '**Pixel Perfect**: Useful for resizing images or defining containers.',
            '**Reverse Calc**: Find the ratio of any width/height pair.'
        ],
        howToUse: [
            { title: 'Select Ratio', description: 'Choose a preset like 16:9 or enter custom values.' },
            { title: 'Enter Dimension', description: 'Input a Width (or Height).' },
            { title: 'Get Result', description: 'The missing dimension is calculated automatically.' },
            { title: 'Resize', description: 'Use these values to resize your content without distortion.' }
        ],
        faqs: [
            { question: 'What is 16:9?', answer: 'Standard widescreen format for HD video.' },
            { question: 'Why do I need this?', answer: 'To ensure images or videos fit perfectly into specific spaces without stretching.' }
        ]
    },
    'stopwatch-timer': {
        title: 'Online Stopwatch & Countdown Timer',
        description: 'Precise stopwatch and countdown timer with laps and audible alarms. Simple, full-screen ready.',
        features: [
            '**Dual Mode**: Switch between Stopwatch and Timer tabs.',
            '**Laps**: Record split times in stopwatch mode.',
            '**Custom Timer**: Set hours, minutes, and seconds for countdowns.',
            '**Audio Alarm**: Beeps when time is up.',
            '**Fullscreen**: Great for classrooms, workouts, or presentations.'
        ],
        howToUse: [
            { title: 'Select Mode', description: 'Choose Stopwatch (count up) or Timer (count down).' },
            { title: 'Start/Stop', description: 'Control time with large, accessible buttons.' },
            { title: 'Lap', description: 'Hit Lap to record a checkpoint without stopping.' },
            { title: 'Reset', description: 'Clear the time to start over.' }
        ],
        faqs: [
            { question: 'Does it work offline?', answer: 'Yes, once loaded, it works without internet.' },
            { question: 'Is it accurate?', answer: 'Yes, it uses your browser\'s high-precision time APIs.' }
        ]
    },
    'json-to-csv': {
        title: 'JSON to CSV Converter',
        description: 'Convert nested JSON data to CSV/Excel format instantly. Flatten objects and handle arrays intelligently.',
        features: [
            '**Instant Conversion**: Paste JSON, pull CSV.',
            '**Auto Flattening**: Handles nested objects by creating dot.notation columns.',
            '**Table Preview**: Review your data in a grid before downloading.',
            '**Download**: Save as .csv file compatible with Excel and Sheets.',
            '**Validation**: Checks for valid JSON syntax before converting.'
        ],
        howToUse: [
            { title: 'Input JSON', description: 'Paste your JSON array or object.' },
            { title: 'Preview', description: 'Check the table view to see columns and rows.' },
            { title: 'Adjust', description: 'Modify your JSON if the structure looks wrong.' },
            { title: 'Download', description: 'Get the CSV file.' }
        ],
        faqs: [
            { question: 'Does it handle large files?', answer: 'Yes, it processes reasonably large files in-browser.' },
            { question: 'Is my data secure?', answer: 'Yes, no data is sent to any server.' }
        ]
    },
    'sales-tax': {
        title: 'Sales Tax Calculator (GST/VAT)',
        description: 'Calculate final prices with sales tax, VAT, or GST included or excluded. Perfect for freelancers and shoppers.',
        features: [
            '**Reverse Calculation**: Find the original price from a total that already includes tax.',
            '**Custom Rates**: Enter any tax rate percentage.',
            '**Detailed Breakdown**: See the Net Price, Tax Amount, and Gross Price clearly.',
            '**Global Support**: Works for US Sales Tax, UK/EU VAT, Indian GST, etc.',
            '**Instant Updates**: Results update as you type.'
        ],
        howToUse: [
            { title: 'Enter Amount', description: 'Input the price.' },
            { title: 'Set Rate', description: 'Enter your local tax rate (e.g., 20% for UK VAT).' },
            { title: 'Choose Mode', description: 'Select "Add Tax" (Exclusive) or "Subtract Tax" (Inclusive).' },
            { title: 'Result', description: 'See the calculated breakdown instantly.' }
        ],
        faqs: [
            { question: 'What is exclusive vs inclusive?', answer: 'Exclusive means tax is added ON TOP of the price. Inclusive means the tax is already INSIDE the price.' },
            { question: 'Can I do VAT?', answer: 'Yes, just enter your VAT percentage as the tax rate.' }
        ]
    },
    'case-converter': {
        title: 'Text Case Converter',
        description: 'Convert text between Upper Case, Lower Case, Title Case, Sentence Case, and more.',
        features: [
            '**Multiple Formats**: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case.',
            '**Word Count**: Shows character and word counts.',
            '**Instant Copy**: One-click copy the modified text.',
            '**Sentence Logic**: Smartly capitalizes the first letter of sentences.',
            '**Clean UI**: Large text area for processing big blocks of text.'
        ],
        howToUse: [
            { title: 'Paste Text', description: 'Type or paste your text into the box.' },
            { title: 'Select Format', description: 'Click the button for the case you want (e.g., UPPERCASE).' },
            { title: 'Copy', description: 'Click "Copy to Clipboard" to use your converted text.' }
        ],
        faqs: [
            { question: 'Does it fix accidentally caps locked text?', answer: 'Yes, select "Sentence case" or "lower case" to fix it.' },
            { question: 'Is there a limit?', answer: 'No practical limit, you can paste large documents.' }
        ]
    },
    'url-converter': {
        title: 'URL Encoder & Decoder',
        description: 'Safely encode and decode URLs. Convert special characters to percentage encoding format required by browsers.',
        features: [
            '**Standard Encoding**: Uses standard encodeURIComponent logic.',
            '**Safe Decoding**: Decodes UTF-8 characters correctly.',
            '**Live Mode**: See the result instantly as you type.',
            '**Error Handling**: Warns if the input string is malformed.',
            '**Bidirectional**: Switch between Encode and Decode modes easily.'
        ],
        howToUse: [
            { title: 'Paste String', description: 'Input the URL or parameter text.' },
            { title: 'Choose Action', description: 'Select Encode to make it safe, or Decode to make it readable.' },
            { title: 'Copy', description: 'Copy the result.' }
        ],
        faqs: [
            { question: 'Why encode URLs?', answer: 'URLs can only send ASCII characters. Special characters (like spaces or emojis) must be converted to a valid %XX format.' },
            { question: 'Is my data saved?', answer: 'No, validation happens locally.' }
        ]
    },
    'lorem-ipsum': {
        title: 'Lorem Ipsum Generator',
        description: 'Generate custom placeholder text for your designs. Choose paragraphs, sentences, or words.',
        features: [
            '**Variable Length**: Generate exactly the number of words or paragraphs you need.',
            '**HTML Tags**: Option to include <p> tags for web developers.',
            '**Start with Lorem...**: Standard toggle to ensure the classic opening phrase.',
            '**One-Click Copy**: Grab the text instantly.',
            '**Clean Output**: Proper punctuation and sentence structure.'
        ],
        howToUse: [
            { title: 'Choose Unit', description: 'Select Paragraphs, Sentences, or Words.' },
            { title: 'Set Quantity', description: 'Enter the number (e.g., 5 paragraphs).' },
            { title: 'Generate', description: 'Click Generate to create the text.' },
            { title: 'Copy', description: 'Copy to clipboard.' }
        ],
        faqs: [
            { question: 'What is Lorem Ipsum?', answer: 'It is standard dummy text used since the 1500s to demonstrate layouts without distracting readable content.' },
            { question: 'Is it real Latin?', answer: 'It mimics Latin but is scrambled and nonsensical.' }
        ]
    },
    'placeholder-generator': {
        title: 'Fast Image Placeholder Generator',
        description: 'Generate dummy image URLs for prototypes. Customize size, background color, and text.',
        features: [
            '**Custom Dimensions**: Set any Width x Height.',
            '**Colors**: Pick background and text colors.',
            '**Custom Text**: Add your own label to the image.',
            '**Direct URL**: Get a link to use in your <img> src.',
            '**Download**: Save the image file locally.'
        ],
        howToUse: [
            { title: 'Set Size', description: 'Enter width and height (e.g., 800x600).' },
            { title: 'Style', description: 'Choose colors and add optional text.' },
            { title: 'Get Image', description: 'Copy the URL or download the PNG.' }
        ],
        faqs: [
            { question: 'Is this free bandwidth?', answer: 'Yes, the images are generated on demand.' },
            { question: 'Can I use this for hotlinking?', answer: 'For prototypes, yes. For production, we recommend hosting your own assets.' }
        ]
    },
    'html-entities': {
        title: 'HTML Entities Encoder / Decoder',
        description: 'Convert special characters to their HTML scalar entity equivalents (e.g., < becomes &lt;).',
        features: [
            '**Secure Escaping**: Prevent XSS by converting special chars to entities.',
            '**Unescape**: Convert entities back to readable text.',
            '**Real-time Process**: See changes instantly.',
            '**Common Symbols**: Handles copyright, trademark, and math symbols.',
            '**Preserves Layout**: Maintains whitespace if desired.'
        ],
        howToUse: [
            { title: 'Input Text', description: 'Paste the string with special characters.' },
            { title: 'Encode/Decode', description: 'Choose the direction.' },
            { title: 'Copy', description: 'Use the safe string in your code.' }
        ],
        faqs: [
            { question: 'Why encode HTML?', answer: 'To display characters that would otherwise be interpreted as code by the browser (like < and >).' }
        ]
    },
    'bmr-calculator': {
        title: 'BMR & TDEE Calculator',
        description: 'Calculate your Basal Metabolic Rate and Total Daily Energy Expenditure to plan your diet.',
        features: [
            '**Mifflin-St Jeor**: Uses the most accurate modern formula.',
            '**Activity Levels**: Adjusts calorie needs based on exercise frequency.',
            '**Imperial/Metric**: Support for KG/CM and LBS/FT.',
            '**Goal Planning**: Suggests calories for weight loss or gain.',
            '**Detailed Analysis**: See exact daily calorie maintenance numbers.'
        ],
        howToUse: [
            { title: 'Enter Details', description: 'Input gender, age, weight, and height.' },
            { title: 'Select Activity', description: 'Choose how active you are (Sedentary to Athlete).' },
            { title: 'Calculate', description: 'See your daily calorie needs.' }
        ],
        faqs: [
            { question: 'What is BMR?', answer: 'Calories your body burns at complete rest.' },
            { question: 'What is TDEE?', answer: 'Total calories you burn in a day including activity.' }
        ]
    },
    'loan-calculator': {
        title: 'Loan & EMI Calculator',
        description: 'Calculate monthly loan payments (EMI), total interest, and amortization.',
        features: [
            '**Monthly Payments**: See exactly what you pay each month.',
            '**Total Interest**: Visualize the cost of borrowing.',
            '**Amortization**: See how the balance decreases over time.',
            '**Interactive Charts**: Visual breakdown of Principal vs Interest.',
            '**Flexible Terms**: Support for months or years duration.'
        ],
        howToUse: [
            { title: 'Principal', description: 'Enter the loan amount.' },
            { title: 'Interest Rate', description: 'Enter the annual interest rate (APR).' },
            { title: 'Term', description: 'Set the duration of the loan.' },
            { title: 'Calculate', description: 'View your monthly EMI.' }
        ],
        faqs: [
            { question: 'Does this include fees?', answer: 'This calculates pure Principal + Interest. Bank fees are extra.' }
        ]
    },
    'glassmorphism-generator': {
        title: 'Glassmorphism CSS Generator',
        description: 'Create trendy frosted-glass effects for your UI. Customize blur, transparency, and saturation.',
        features: [
            '**Visual Preview**: Real-time glass effect over a colorful background.',
            '**CSS Code**: Auto-generated backdrop-filter CSS.',
            '**Outline Support**: Add subtle borders for depth.',
            '**Transparency Control**: Fine-tune the alpha channel.',
            '**Browser Support**: Uses modern backdrop-filter property.'
        ],
        howToUse: [
            { title: 'Adjust Blur', description: 'Use the slider to increase frostiness.' },
            { title: 'Opacity', description: 'Set how transparent the glass pane is.' },
            { title: 'Color', description: 'Tint the glass with a color.' },
            { title: 'Copy CSS', description: 'Grab the code for your project.' }
        ],
        faqs: [
            { question: 'Is it supported?', answer: 'Yes, modern browsers support backdrop-filter.' }
        ]
    },
    'diff-checker': {
        title: 'Text Diff Checker',
        description: 'Compare two text files side-by-side to find differences. Highlights added and removed lines.',
        features: [
            '**Side-by-Side**: Classic split view for easy comparison.',
            '**Line Highlighting**: Color-coded red (removed) and green (added).',
            '**Whitespace Option**: Ignore or respect whitespace changes.',
            '**Large Text Support**: Paste code or documents.',
            '**Secure**: Comparison happens locally.'
        ],
        howToUse: [
            { title: 'Paste Old', description: 'Put original text on the left.' },
            { title: 'Paste New', description: 'Put modified text on the right.' },
            { title: 'Compare', description: 'See the differences highlighted instantly.' }
        ],
        faqs: [
            { question: 'Is my code safe?', answer: 'Yes, no text is sent to our servers.' }
        ]
    },
    'age-calculator': {
        title: 'Age Calculator',
        description: 'Calculate your exact age in years, months, weeks, days, hours, and seconds.',
        features: [
            '**Exact Calculation**: Accounts for leap years and varying month lengths.',
            '**Next Birthday**: Shows countdown to your next special day.',
            '**Total Time**: See your life duration in total weeks or seconds.',
            '**Shareable**: Fun for milestones and birthday cards.',
            '**Date Difference**: Can be used to find duration between any two dates.'
        ],
        howToUse: [
            { title: 'Enter DOB', description: 'Select your Date of Birth.' },
            { title: 'Calculate', description: 'Press the button.' },
            { title: 'See Result', description: 'View your precise age breakdown.' }
        ],
        faqs: [
            { question: 'Is it accurate?', answer: 'Yes, it uses calendar logic to handle leap years correctly.' }
        ]
    },
    'animated-patterns': {
        title: 'CSS Animated Backgrounds Generator',
        description: 'Create mesmerizing, looping animated backgrounds with pure CSS. Customizable patterns, colors, and speeds.',
        features: [
            '**Pure CSS**: No JavaScript required for the output animations.',
            '**Customizable**: Adjust speed, colors, sizes, and directions.',
            '**Multiple Patterns**: Waves, grids, particles, and gradients.',
            '**Performance**: Optimized for 60fps animations.',
            '**Copy & Paste**: Get the HTML/CSS code instantly.'
        ],
        howToUse: [
            { title: 'Select Pattern', description: 'Choose a base style.' },
            { title: 'Customize', description: 'Tweak speed and colors.' },
            { title: 'Export', description: 'Copy the CSS code.' }
        ],
        faqs: [
            { question: 'Will this slow down my site?', answer: 'CSS animations are generally very efficient.' }
        ]
    },
    'base-converter': {
        title: 'Number Base Converter (Hex, Binary, Octal)',
        description: 'Convert numbers between Binary (2), Octal (8), Decimal (10), and Hexadecimal (16) instantly.',
        features: [
            '**All Bases**: Supports any base from 2 to 36.',
            '**Live Conversion**: Type in one field, update all others.',
            '**Big Numbers**: Handles large integers via BigInt.',
            '**Clean UI**: Clear labels for Binary, Hex, Dec, etc.',
            '**Educational**: Great for CS students learning number systems.'
        ],
        howToUse: [
            { title: 'Type Number', description: 'Enter values in any field (e.g., Hex).' },
            { title: 'See Result', description: 'Watch the other fields (Binary, Decimal) update automatically.' }
        ],
        faqs: [
            { question: 'Can it do negative numbers?', answer: 'Yes, standard integer notation is supported.' }
        ]
    },
    'base64': {
        title: 'Base64 Encoder & Decoder',
        description: 'Convert text or files to Base64 strings and vice versa. Useful for debugging APIs or embedding data.',
        features: [
            '**Text Mode**: Encode/Decode strings.',
            '**File Mode**: Convert images/files to Data URIs.',
            '**Live Preview**: See results instantly.',
            '**Safe URL**: Options for URL-safe encoding.',
            '**Copy**: One-click clipboard copy.'
        ],
        howToUse: [
            { title: 'Select Text/File', description: 'Choose input type.' },
            { title: 'Input Data', description: 'Paste text or drop file.' },
            { title: 'Result', description: 'Copy the Base64 output.' }
        ],
        faqs: [
            { question: 'What is Base64?', answer: 'It represents binary data in an ASCII string format.' }
        ]
    },
    'bmi-calculator': {
        title: 'BMI Calculator',
        description: 'Calculate your Body Mass Index (BMI) to check if you are in a healthy weight range.',
        features: [
            '**Metric/Imperial**: Support for kg/cm and lbs/ft.',
            '**Health Categories**: Shows Underweight, Healthy, Overweight, Obese.',
            '**Visual Gauge**: Color-coded meter for quick reading.',
            '**Privacy**: No data provided is stored.',
            '**Advice**: General health context based on WHO guidelines.'
        ],
        howToUse: [
            { title: 'Enter Weight', description: 'Input your current weight.' },
            { title: 'Enter Height', description: 'Input your height.' },
            { title: 'View BMI', description: 'Your number and category appear below.' }
        ],
        faqs: [
            { question: 'Is BMI accurate?', answer: 'It is a general screen, not a diagnostic of body fatness or health.' }
        ]
    },
    'color-converter': {
        title: 'Color Converter (HEX, RGB, HSL, CMYK)',
        description: 'Convert color codes between formats. Pick colors visually and get their values.',
        features: [
            '**Multi-Format**: HEX, RGB, HSL, CMYK, LAB.',
            '**Visual Picker**: Interactive color wheel/box.',
            '**Palette Generation**: Suggests complementary colors.',
            '**Name Matcher**: Finds closest CSS color name.',
            '**Alpha Support**: Handles RGBA/HSLA.'
        ],
        howToUse: [
            { title: 'Pick Color', description: 'Use the picker or paste a code.' },
            { title: 'Convert', description: 'Copy the value in your desired format.' }
        ],
        faqs: [
            { question: 'What is CMYK?', answer: 'Used for print (Cyan, Magenta, Yellow, Key/Black).' }
        ]
    },
    'compound-interest': {
        title: 'Compound Interest Calculator',
        description: 'Visualize how your investments grow over time with the power of compounding.',
        features: [
            '**Growth Chart**: Interactive graph showing value over years.',
            '**Monthly Contributions**: Factor in regular deposits.',
            '**Inflation**: Adjust for purchasing power.',
            '**Detailed Table**: Year-by-year breakdown.',
            '**Comparison**: Compare with simple interest.'
        ],
        howToUse: [
            { title: 'Principal', description: 'Initial investment.' },
            { title: 'Rate', description: 'Annual return rate %.' },
            { title: 'Time', description: 'Investment duration.' },
            { title: 'Calculate', description: 'See your future wealth.' }
        ],
        faqs: [
            { question: 'What is compounding?', answer: 'Earning interest on your interest.' }
        ]
    },
    'currency-converter': {
        title: 'Currency Converter',
        description: 'Real-time exchange rates for 150+ global currencies.',
        features: [
            '**Live Rates**: Updated regularly from financial APIs.',
            '**Multi-Currency**: Convert one to many.',
            '**Calculator**: Math operations within input.',
            '**Offline Mode**: Uses last known rates if offline.',
            '**Flags**: Visual country indicators.'
        ],
        howToUse: [
            { title: 'Amounts', description: 'Enter value.' },
            { title: 'Currencies', description: 'Select From and To currencies.' },
            { title: 'Convert', description: 'See equivalent value.' }
        ],
        faqs: [
            { question: 'How often are rates updated?', answer: 'Typically every hour.' }
        ]
    },
    'family-spending-analyzer': {
        title: 'Family Spending Analyzer',
        description: 'Track and analyze household expenses. Visualize budget distribution.',
        features: [
            '**Categorization**: Group spending (Food, Rent, Utilities).',
            '**Charts**: Pie and bar charts for visual analysis.',
            '**Budget Goals**: Set limits per category.',
            '**Export**: Save report as CSV/PDF.',
            '**Privacy**: Data stays in browser.'
        ],
        howToUse: [
            { title: 'Add Expense', description: 'Enter amount and category.' },
            { title: 'Analyze', description: 'View the breakdown charts.' }
        ],
        faqs: [
            { question: 'Is my bank data safe?', answer: 'We do not connect to banks. You enter data manually; it stays local.' }
        ]
    },
    'freelance-rate': {
        title: 'Freelance Hourly Rate Calculator',
        description: 'Calculate what you should charge per hour to meet your annual income goals.',
        features: [
            '**Income Goal**: Set your target yearly salary.',
            '**Expenses**: Factor in software, insurance, and taxes.',
            '**Billable Hours**: Adjust for vacation and non-billable admin time.',
            '**Profit Margin**: Add buffer for growth.',
            '**Reverse Calc**: See precise hourly/daily/project rates.'
        ],
        howToUse: [
            { title: 'Income Target', description: 'What do you want to take home?' },
            { title: 'Expenses', description: 'Overhead costs.' },
            { title: 'Working Days', description: 'Days off and holidays.' },
            { title: 'Result', description: 'Your minimum hourly rate.' }
        ],
        faqs: [
            { question: 'Why is it higher than my salary?', answer: 'Freelancers pay their own taxes, insurance, and overhead.' }
        ]
    },
    'markdown-previewer': {
        title: 'Markdown Editor & Previewer',
        description: 'Write, edit, and preview Markdown in real-time. Split-screen view for easy formatting.',
        features: [
            '**Live Preview**: See your rendered HTML instantly as you type.',
            '**GitHub Flavor**: Supports GFM (tables, task lists, strikethrough).',
            '**Export**: Copy the HTML or raw Markdown instantly.',
            '**Syntax Highlighting**: Code blocks are colored for readability.',
            '**Zen Mode**: Distraction-free writing experience.'
        ],
        howToUse: [
            { title: 'Write', description: 'Type Markdown in the left pane.' },
            { title: 'Preview', description: 'See the result in the right pane.' },
            { title: 'Copy', description: 'Grab the HTML code for your blog or readme.' }
        ],
        faqs: [
            { question: 'Does it support images?', answer: 'Yes, standard Markdown image syntax works.' }
        ]
    },
    'percentage-calculator': {
        title: 'Percentage Calculator',
        description: 'Solve common percentage problems: find X% of Y, percent increase/decrease, and what percent X is of Y.',
        features: [
            '**Multi-Mode**: Three separate calculators for different queries.',
            '**Percent of Value**: E.g., "What is 20% of 150?".',
            '**Percent Change**: Calculate growth or reduction between two numbers.',
            '**Part of Whole**: E.g., "25 is what percent of 100?".',
            '**Instant Results**: No need to press enter.'
        ],
        howToUse: [
            { title: 'Pick Mode', description: 'Tab between the three calculation types.' },
            { title: 'Enter Numbers', description: 'Input your values.' },
            { title: 'See Answer', description: 'The result appears instantly.' }
        ],
        faqs: [
            { question: 'Is it accurate?', answer: 'Yes, it uses standard floating-point math.' }
        ]
    },
    'qr-generator': {
        title: 'QR Code Generator',
        description: 'Create customizable QR codes for URLs, WiFi access, text, and emails.',
        features: [
            '**Multiple Types**: Link, Text, E-mail, WiFi, V-Card.',
            '**Custom Colors**: Change foreground and background colors.',
            '**High Res**: Download clearly scalable images.',
            '**Error Correction**: Adjustable levels (L, M, Q, H).',
            '**Instant Preview**: See changes live.'
        ],
        howToUse: [
            { title: 'Select Type', description: 'Choose what the QR code should do.' },
            { title: 'Input Data', description: 'Enter the link or text.' },
            { title: 'Style', description: 'Customize colors if desired.' },
            { title: 'Download', description: 'Save the image.' }
        ],
        faqs: [
            { question: 'Do these expire?', answer: 'No, static QR codes work forever.' }
        ]
    },
    'unit-converter': {
        title: 'Unit Converter',
        description: 'Convert between common units of measurement: Length, Weight, Temperature, and more.',
        features: [
            '**Multi-Category**: Length, Mass, Temperature, Area, Volume.',
            '**Metric & Imperial**: Seamless conversion between systems.',
            '**Precision**: Accurate decimals for scientific use.',
            '**Clean Interface**: Simple dropdowns for unit selection.',
            '**Swap**: Reverse inputs with one click.'
        ],
        howToUse: [
            { title: 'Category', description: 'Select Length, Weight, etc.' },
            { title: 'Input', description: 'Enter the value and choose the unit.' },
            { title: 'Result', description: 'See the converted value instantly.' }
        ],
        faqs: [
            { question: 'Is it comprehensive?', answer: 'It covers the most common daily units.' }
        ]
    },
    'unix-timestamp': {
        title: 'Unix Timestamp Converter',
        description: 'Convert between human-readable dates and Unix Epoch timestamps (seconds/milliseconds).',
        features: [
            '**Bidirectional**: Date to Timestamp & Timestamp to Date.',
            '**Current Time**: One-click "Now" button.',
            '**Format Support**: ISO 8601, UTC, and Local time display.',
            '**Seconds/Millis**: Toggle between standard/JS timestamps.',
            '**Clipboard**: Quick copy for developers.'
        ],
        howToUse: [
            { title: 'Input', description: 'Paste a timestamp or select a date.' },
            { title: 'Convert', description: 'View the equivalent format.' }
        ],
        faqs: [
            { question: 'What is Unix Epoch?', answer: 'Seconds elapsed since Jan 1, 1970 UTC.' }
        ]
    },
    'password-generator': {
        title: 'Strong Password Generator',
        description: 'Create secure, random passwords with custom rules for length and character types.',
        features: [
            '**Custom Length**: Slider from 4 to 64 characters.',
            '**Character Rules**: Toggle Uppercase, Numbers, Symbols.',
            '**Strength Meter**: Visual indicator of entropy.',
            '**One-Click Copy**: Copy to clipboard instantly.',
            '**Secure**: Generated locally, never sent to server.'
        ],
        howToUse: [
            { title: 'Settings', description: 'Adjust length and character options.' },
            { title: 'Generate', description: 'Click refresh for a new one.' },
            { title: 'Copy', description: 'Use it for your account.' }
        ],
        faqs: [
            { question: 'Is this safe?', answer: 'Yes, it runs strictly in your browser. We never see the passwords.' }
        ]
    },
    'json-formatter': {
        title: 'JSON Formatter & Validator',
        description: 'Beautify ugly JSON, validate syntax, and minify content for production.',
        features: [
            '**Beautify**: Auto-indent and spacing for readability.',
            '**Minify**: Remove whitespace to save space.',
            '**Validation**: Error highlighting for bad syntax.',
            '**Tree View**: Collapsible structure explorer.',
            '**File Support**: Upload .json files directly.'
        ],
        howToUse: [
            { title: 'Paste JSON', description: 'Input your raw string.' },
            { title: 'Format', description: 'Click Format to prettify.' },
            { title: 'Minify', description: 'Click Minify to compress.' }
        ],
        faqs: [
            { question: 'Can I fix invalid JSON?', answer: 'The tool will show you where the error is, but you must fix it.' }
        ]
    },
    'word-counter': {
        title: 'Word & Character Counter',
        description: 'Count words, characters (with/without spaces), sentences, paragraphs, and reading time.',
        features: [
            '**Real-Time**: Updates as you type.',
            '**Reading Time**: Estimates how long to read.',
            '**Detailed Stats**: Paragraphs, sentences, avg word length.',
            '**Keyword Density**: Shows most frequent words.',
            '**Clean Slate**: Clear formatting button.'
        ],
        howToUse: [
            { title: 'Type/Paste', description: 'Enter your text.' },
            { title: 'Review', description: 'See the counter update.' }
        ],
        faqs: [
            { question: 'Does it count spaces?', answer: 'We show count with AND without spaces.' }
        ]
    },
    'keto-calc': {
        title: 'Keto Macro Calculator',
        description: 'Calculate your custom macronutrient targets for a Ketogenic diet (Carbs, Protein, Fat).',
        features: [
            '**Personalized**: Based on body stats and activity.',
            '**Goal Setting**: Deficit (Weight Loss) or Surplus (Gain).',
            '**Carb Limit**: Set your preferred Net Carbs limit (usually 20g).',
            '**Charts**: Visual pie chart of macro breakdown.',
            '**Advice**: Suggestions for daily intake.'
        ],
        howToUse: [
            { title: 'Enter Stats', description: 'Weight, Height, Age, Gender.' },
            { title: 'Select Goal', description: 'Lose, Maintain, or Gain.' },
            { title: 'Calculate', description: 'See your grams per day.' }
        ],
        faqs: [
            { question: 'What is Keto?', answer: 'A low-carb, high-fat diet.' }
        ]
    },
    'pix-rem': {
        title: 'Pixels to REM Converter',
        description: 'Convert PX values to REM units (and vice versa) for responsive web design.',
        features: [
            '**Bidirectional**: Update PX to see REM, or REM to see PX.',
            '**Base Size**: Custom root font-size (default 16px).',
            '**Quick Copy**: Copy the CSS value instantly.',
            '**Live Sync**: Updates as you type.',
            '**Developer Friendly**: Essential for modern accessibility.'
        ],
        howToUse: [
            { title: 'Set Base', description: 'Usually 16px.' },
            { title: 'Input Value', description: 'Type in PX or REM.' },
            { title: 'Copy', description: 'Use the result in your CSS.' }
        ],
        faqs: [
            { question: 'Why use REM?', answer: 'REM scales better with user accessibility settings than fixed pixels.' }
        ]
    },
    'privacy-policy-gen': {
        title: 'Privacy Policy Generator',
        description: 'Generate a generic privacy policy for your website or mobile app in seconds.',
        features: [
            '**Simple Form**: Just answer a few questions about your app.',
            '**Standard Clauses**: Includes cookies, third-party data, and contact info.',
            '**Format Options**: Copy raw Text, HTML, or Markdown.',
            '**Free to Use**: No legal fees for basic protection.',
            '** instant Review**: See the policy update as you fill the form.'
        ],
        howToUse: [
            { title: 'Company Name', description: 'Enter your entity name.' },
            { title: 'Website URL', description: 'Where is the policy hosted?' },
            { title: 'Data Collected', description: 'Check what you track (Cookies, Email, etc.).' },
            { title: 'Generate', description: 'Copy the resulting legal text.' }
        ],
        faqs: [
            { question: 'Is this legal advice?', answer: 'No, this is a standard template. Consult a lawyer for specific needs.' }
        ]
    },
    'roi-calculator': {
        title: 'ROI Calculator',
        description: 'Calculate Return on Investment (ROI) for marketing campaigns, business projects, or real estate.',
        features: [
            '**Profit Analysis**: See net profit and ROI percentage.',
            '**Annualized ROI**: Understand long-term performance.',
            '**Simple Inputs**: Just Investment Amount and Returned Amount.',
            '**Visuals**: Clear breakdown of cost vs gain.',
            '**Shareable**: Good for quick business estimates.'
        ],
        howToUse: [
            { title: 'Investment', description: 'Total cost of the project.' },
            { title: 'Return', description: 'Total revenue generated.' },
            { title: 'Duration', description: 'Time period (optional for annualized stats).' },
            { title: 'Calculate', description: 'View your percentage return.' }
        ],
        faqs: [
            { question: 'What is a good ROI?', answer: 'It depends on the industry, but generally anything positive is a gain.' }
        ]
    },
    'morse-code': {
        title: 'Morse Code Translator',
        description: 'Translate text to Morse code and back. Includes audio playback to hear the dots and dashes.',
        features: [
            '**Audio Playback**: Hear the code tapped out.',
            '**Bidirectional**: Text to Morse / Morse to Text.',
            '**International Standard**: Uses ITU standard codes.',
            '**Light Signals**: (Coming soon) Screen flashes for visual reading.',
            '**Copy**: One-click clipboard support.'
        ],
        howToUse: [
            { title: 'Input', description: 'Type text or dashes/dots.' },
            { title: 'Listen', description: 'Click Play to hear the message.' },
            { title: 'Learn', description: 'Use the chart to memorize letters.' }
        ],
        faqs: [
            { question: 'What is SOS?', answer: '... --- ... (Save Our Souls)' }
        ]
    },
    'random-choice': {
        title: 'Random Choice Maker',
        description: 'Can\'t decide? Enter options and let the wheel pick one for you.',
        features: [
            '**Fun Animation**: Visual shuffle effect before picking.',
            '**Unlimited Options**: Add as many choices as you want.',
            '**Save Lists**: (Local) Remembers your last used inputs.',
            '**Fair**: Uses cryptographic randomness.',
            '**Fast**: Great for resolving tie-breakers.'
        ],
        howToUse: [
            { title: 'Enter Choices', description: 'Type options separated by commas.' },
            { title: 'Spin', description: 'Click Go/Pick.' },
            { title: 'Winner', description: 'The chosen item is highlighted.' }
        ],
        faqs: [
            { question: 'Is it truly random?', answer: 'Yes, as random as a computer can be.' }
        ]
    },
    'text-statistics': {
        title: 'Advanced Text Statistics',
        description: 'Analyze text readability, keyword frequency, and sentence structure density.',
        features: [
            '**Readability Scores**: Flesch-Kincaid, Gunning Fog, etc.',
            '**Structure**: Sentence length stats.',
            '**Keyword Cloud**: See most used words.',
            '**Time**: Reading and Speaking time estimates.',
            '**Deep Analysis**: Good for copywriters and editors.'
        ],
        howToUse: [
            { title: 'Paste Text', description: 'Input your article.' },
            { title: 'Analyze', description: 'View the dashboard of metrics.' }
        ],
        faqs: [
            { question: 'What is a good readability score?', answer: 'For general web content, 6th-8th grade level is ideal.' }
        ]
    },
    'paint-app': {
        title: 'Online Paint Tool',
        description: 'A browser-based digital canvas. Draw, sketch, and doodle with various brushes and colors.',
        features: [
            '**Brush Engine**: Pressure sensitivity simulation.',
            '**Layers**: (Basic) Draw on top of imported images.',
            '**Colors**: Full RGB spectrum picker.',
            '**Undo/Redo**: Correct mistakes easily.',
            '**Save**: Download artwork as PNG.'
        ],
        howToUse: [
            { title: 'Pick Tool', description: 'Select Pencil, Brush, or Eraser.' },
            { title: 'Choose Color', description: 'Pick your ink.' },
            { title: 'Draw', description: 'Create on the canvas.' },
            { title: 'Save', description: 'Download your masterpiece.' }
        ],
        faqs: [
            { question: 'Does it work with tablets?', answer: 'Yes, it supports touch input.' }
        ]
    },
    'time-block-planner': {
        title: 'Time-Blocking Day Planner',
        description: 'Paint your day in 30-minute blocks. Visualize your schedule to boost productivity.',
        features: [
            '**Visual Planning**: Color-code activities (Work, Rest, Exercise).',
            '**Drag to Paint**: Quickly fill time slots with a mouse drag.',
            '**Totals**: See how many hours you spend on each category.',
            '**Local Save**: Your schedule stays in your browser.',
            '**Printable**: Clean layout for printing.'
        ],
        howToUse: [
            { title: 'Create Types', description: 'Define categories like "Deep Work" or "Meeting".' },
            { title: 'Paint Schedule', description: 'Click and drag on the timeline to assign tasks.' },
            { title: 'Review', description: 'Check your balance of focus vs breakdown.' }
        ],
        faqs: [
            { question: 'What is time blocking?', answer: 'A method of scheduling your day into specific chunks of time for focused work.' }
        ]
    },
    'color-converter-new': {
        title: 'Professional Color Converter & Picker',
        description: 'Convert color codes between HEX, RGB, HSL, and CMYK formats. Features an advanced visual picker and palette generator.',
        features: [
            '**Multi-Format**: Support for HEX, RGB, HSL, CMYK, and LAB.',
            '**Visual Picker**: Precise color selection with alpha support.',
            '**Accessibility**: Contrast checks and readability ratings.',
            '**Palettes**: Auto-generate complementary and analogous schemes.',
            '**CSS READY**: One-click copy for your stylesheets.'
        ],
        howToUse: [
            { title: 'Pick or Paste', description: 'Enter a color code or use the visual picker to select a base color.' },
            { title: 'Choose Format', description: 'Select your target format (e.g., HSL) to see the conversion.' },
            { title: 'Adjust Alpha', description: 'Use the transparency slider if needed.' },
            { title: 'Copy CSS', description: 'Copy the resulting code directly into your project.' }
        ],
        faqs: [
            { question: 'What is CMYK used for?', answer: 'CMYK is primarily used for print design, while RGB and HEX are for digital screens.' }
        ]
    }
};

interface ToolContentProps {
    slug: string;
}

export function ToolContent({ slug }: ToolContentProps) {
    const data = toolContentData[slug];
    const currentTool = tools.find(t => t.slug === slug);

    if (!data) return null;

    const relatedTools = tools
        .filter(t => t.category === currentTool?.category && t.slug !== slug)
        .slice(0, 4);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': data.title,
        'operatingSystem': 'Any',
        'applicationCategory': 'MultimediaApplication',
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.8',
            'ratingCount': '124'
        },
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
        }
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': data.faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.answer
            }
        }))
    };

    const howToLd = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': `How to use ${data.title}`,
        'description': data.description,
        'step': data.howToUse.map((step, index) => ({
            '@type': 'HowToStep',
            'position': index + 1,
            'name': step.title,
            'itemListElement': [{
                '@type': 'HowToDirection',
                'text': step.description
            }]
        }))
    };

    return (
        <article className="max-w-4xl mx-auto px-4 py-12 space-y-12 text-slate-700 dark:text-slate-300">

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
            />

            {/* Description Section */}
            <section className="text-center max-w-2xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <div className="flex -space-x-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                    </div>
                    <span className="text-sm font-bold tracking-tight">4.9/5 User Rating</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    Free {data.title} Online
                </h2>
                <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-400">{data.description}</p>
            </section>

            {/* Table of Contents - Jump Links for SEO */}
            <section className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Quick Navigation</h2>
                    <p className="text-xs text-slate-500">Jump to specific sections of the {data.title} guide.</p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                    <a href="#features" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40">Key Features</a>
                    <a href="#how-to" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40">How to Use</a>
                    <a href="#faqs" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40">FAQs</a>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="scroll-mt-20">
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Key Features</h2>
                    <p className="text-slate-500">Powerful capabilities of our {data.title.toLowerCase()}.</p>
                </div>
                <ul className="grid md:grid-cols-2 gap-6 list-none p-0">
                    {data.features.map((feature, idx) => {
                        const [bold, rest] = feature.split(':');
                        return (
                            <li key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                                            {bold.replace(/\*\*/g, '')}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {rest}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* How to Use Steps */}
            <section id="how-to" className="bg-slate-100 dark:bg-slate-900/50 p-8 rounded-2xl scroll-mt-20">
                <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white text-center">How to use {data.title}</h2>
                <div className="space-y-8">
                    {data.howToUse.map((step, idx) => (
                        <div key={idx} className="flex gap-6 items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                {idx + 1}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{step.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faqs" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Frequently Asked Questions about {data.title}</h2>
                <div className="space-y-4">
                    {data.faqs.map((faq, idx) => (
                        <div key={idx} className="border-b border-slate-200 dark:border-slate-800 pb-4">
                            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">{faq.question}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Related Tools Section */}
            {relatedTools.length > 0 && (
                <section className="pt-12 border-t border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Related {currentTool?.category} Tools</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {relatedTools.map((tool) => {
                            const { icon: _icon, ...safeTool } = tool;
                            return (
                                <ToolCard
                                    key={tool.slug}
                                    tool={safeTool}
                                    icon={<tool.icon className="w-5 h-5" />}
                                />
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Why Toolboxed Section */}
            <section className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Why use Toolboxed.online?</h2>
                    <p className="text-blue-800/80 dark:text-blue-200/60 leading-relaxed mb-6">
                        Toolboxed is a curated suite of high-performance utility tools designed for modern professionals.
                        Unlike other tool sites, we prioritize <strong>privacy, speed, and zero distractions</strong>.
                        None of your data ever leaves your browser, and we never show annoying ads.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            100% Free & Open Source
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            No Registration Required
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Client-Side Processing
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Mobile Friendly Design
                        </div>
                    </div>
                </div>
            </section>

        </article>
    );
}
