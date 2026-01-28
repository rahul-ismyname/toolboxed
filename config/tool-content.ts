export type ToolData = {
    title: string;
    description: string;
    features: string[];
    howToUse: { title: string; description: string }[];
    faqs: { question: string; answer: string }[];
    localizedMetadata?: Record<string, { title: string; description: string }>;
};

export const toolContentData: Record<string, ToolData> = {
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
        ],
        localizedMetadata: {
            es: { title: 'Formateador SQL Online', description: 'Embellece consultas SQL complejas al instante. Soporta MySQL, PostgreSQL, SQL Server y más.' },
            pt: { title: 'Formatador SQL Online', description: 'Embeleze consultas SQL complexas instantaneamente. Suporta MySQL, PostgreSQL, SQL Server e mais.' },
            hi: { title: 'SQL फॉर्मेटर और वैलिडेटर', description: 'जटिल SQL प्रश्नों को तुरंत व्यवस्थित करें। MySQL, PostgreSQL, SQL Server और अन्य का समर्थन करता है।' }
        }
    },
    'regex-tester': {
        title: 'Regex Tester - Live Regular Expression Editor',
        description: 'Test and debug regular expressions in real-time. Supports multiple flavors and provides detailed explanations.',
        features: [
            '**Live Matching**: See results instantly as you type your regex.',
            '**Flavor Support**: PCRE, JavaScript, and more.',
            '**Detailed Explanations**: Understand what each part of your regex does.',
            '**Cheat Sheet**: Quick access to common regex tokens.',
            '**Replace Mode**: Test string replacement logic easily.'
        ],
        howToUse: [
            { title: 'Enter Pattern', description: 'Type your regular expression in the top field.' },
            { title: 'Enter Test String', description: 'Input the text you want to test against.' },
            { title: 'Analyze Results', description: 'Check the matches and captures in the results panel.' }
        ],
        faqs: [
            { question: 'What is Regex?', answer: 'A sequence of characters that forms a search pattern for text.' }
        ],
        localizedMetadata: {
            es: { title: 'Probador de Regex - Editor de Expresiones Regulares en Vivo', description: 'Prueba y depura expresiones regulares en tiempo real. Soporta múltiples versiones y proporciona explicaciones detalladas.' },
            pt: { title: 'Testador de Regex - Editor de Expressões Regulares em Tempo Real', description: 'Teste e depure expressões regulares em tempo real. Suporta várias versões e fornece explicações detalhadas.' },
            hi: { title: 'रेगेक्स टेस्टर - लाइव रेगुलर एक्सप्रेशन एडिटर', description: 'रीयल-टाइम में रेगुलर एक्सप्रेशन का परीक्षण और डिबग करें। कई स्वादों का समर्थन करता है और विस्तृत स्पष्टीकरण प्रदान करता है।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Generador de Sombras CSS (Box-Shadow)', description: 'Crea sombras CSS hermosas, en capas y suaves visualmente. Copia el código CSS al instante.' },
            pt: { title: 'Gerador de Sombras CSS (Box-Shadow)', description: 'Crie sombras CSS lindas, suaves e em camadas visualmente. Copie o código CSS instantaneamente.' },
            hi: { title: 'CSS बॉक्स शैडो जेनरेटर', description: 'सुंदर, स्तरित और चिकनी CSS बॉक्स-शैडो विस्तृत रूप से बनाएं। तुरंत CSS कोड कॉपी करें।' }
        }
    },
    'image-pdf-compressor': {
        title: 'Image & PDF Compressor',
        description: 'Convert and compress images and PDFs. Set target file sizes (e.g., 100KB) and process unlimited files locally.',
        features: [
            '**Bulk Processing**: Convert hundreds of images at once.',
            '**Target Size**: Compress files to a specific size (KB/MB).',
            '**PDF Support**: Import and compress PDF documents.',
            '**Local Privacy**: Files are processed in your browser, not uploaded.',
            '**Format Support**: Convert between JPG, PNG, WebP, and PDF.'
        ],
        howToUse: [
            { title: 'Select Files', description: 'Drag and drop images or PDFs.' },
            { title: 'Choose Mode', description: 'Select "Target Size" to set a limit (e.g., 200KB).' },
            { title: 'Compress', description: 'Click "Compress & Download" to process.' },
            { title: 'Download', description: 'Save your optimized files.' }
        ],
        faqs: [
            { question: 'Is there a file limit?', answer: 'No hard limit, but performance depends on your computer\'s RAM.' },
            { question: 'Do you save my files?', answer: 'No, everything is processed offline in your browser.' }
        ],
        localizedMetadata: {
            es: { title: 'Compresor de Imágenes y PDF', description: 'Convierte y comprime imágenes y PDF. Establece tamaños de archivo objetivo.' },
            pt: { title: 'Compressor de Imagem e PDF', description: 'Converta e comprima imagens e PDFs. Defina tamanhos de arquivo alvo.' },
            hi: { title: 'इमेज और पीडीएफ कंप्रेसर', description: 'छवियों और पीडीएफ को बदलें और संकुचित करें। लक्ष्य फ़ाइल आकार सेट करें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Temporizador Pomodoro para Concentración', description: 'Aumenta tu productividad con este temporizador Pomodoro personalizable. Realiza un seguimiento de tus intervalos de concentración.' },
            pt: { title: 'Temporizador Pomodoro para Foco', description: 'Aumente sua produtividade com este timer Pomodoro customizável. Controle seus intervalos de foco de forma eficaz.' },
            hi: { title: 'फोकस पोमोडोरो टाइमर', description: 'इस अनुकूलन योग्य पोमोडोरो टाइमर के साथ उत्पादकता बढ़ाएं। ध्यान केंद्रित करने वाले अंतराल और ब्रेक समय को ट्रैक करें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Generador de Clip-Path CSS', description: 'Crea formas y polígonos CSS complejos visualmente. Arrastra puntos para diseñar rutas de recorte personalizadas.' },
            pt: { title: 'Gerador de Clip-Path CSS', description: 'Crie formas e polígonos CSS complexos visualmente. Arraste pontos para projetar caminhos de recorte personalizados.' },
            hi: { title: 'CSS क्लिप-पाथ जेनरेटर', description: 'जटिल CSS आकृतियाँ और बहुभुज विज़ुल तौर पर बनाएं। कस्टम क्लिप-पाथ डिज़ाइन करने के लिए बिंदुओं को ड्रैग करें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Generador de Etiquetas Meta SEO', description: 'Genera etiquetas meta perfectas para SEO y redes sociales. Previsualiza cómo se ve tu sitio en Google, Facebook y Twitter.' },
            pt: { title: 'Gerador de Meta Tags SEO', description: 'Gere meta tags perfeitas para SEO e redes sociais. Prévisualize como seu site aparece no Google, Facebook e Twitter.' },
            hi: { title: 'एसईओ मेटा टैग जेनरेटर', description: 'बेहतरीन एसईओ और सोशल मीडिया मेटा टैग जेनरेट करें। पूर्वावलोकन करें कि आपकी साइट Google, Facebook और Twitter पर कैसी दिखती है।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Generador de UUID / GUID', description: 'Genera UUIDs válidos de las versiones 1, 3, 4 y 5 al instante. Crea IDs por lotes para tu base de datos o aplicación.' },
            pt: { title: 'Gerador de UUID / GUID', description: 'Gere UUIDs válidos das versões 1, 3, 4 e 5 instantaneamente. Crie IDs em lote para seu banco de dados ou aplicativo.' },
            hi: { title: 'UUID / GUID जेनरेटर', description: 'संस्करण 1, 3, 4 और 5 UUID तुरंत जेनरेट करें। अपने डेटाबेस या एप्लिकेशन के लिए बल्क आईडी बनाएं।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Decodificador y Depurador JWT', description: 'Decodifica, verifica e inspecciona JSON Web Tokens al instante. Visualiza encabezados, cargas útiles y firmas claramente.' },
            pt: { title: 'Decodificador e Depurador JWT', description: 'Decodifique, verifique e inspecione JSON Web Tokens instantaneamente. Visualize cabeçalhos, payloads e assinaturas claramente.' },
            hi: { title: 'JWT डिकोडर और डिबगर', description: 'JSON वेब टोकन को तुरंत डिकोड, सत्यापित और निरीक्षण करें। हेडर, पेलोड और हस्ताक्षर स्पष्ट रूप से देखें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Calculadora de Relación de Aspecto', description: 'Calcula dimensiones y proporciones para imágenes, videos y pantallas. Soporta formatos 16:9, 4:3, 21:9 y más.' },
            pt: { title: 'Calculadora de Proporção de Tela', description: 'Calcule dimensões e proporções para imagens, vídeos e telas. Suporta 16:9, 4:3, 21:9 e muito mais.' },
            hi: { title: 'आस्पेक्ट रेशियो कैलकुलेटर', description: 'इमेज, वीडियो और स्क्रीन के लिए आयामों और अनुपात की गणना करें। 16:9, 4:3, 21:9 और अन्य का समर्थन करता है।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Cronómetro y Temporizador Online', description: 'Cronómetro preciso y temporizador de cuenta regresiva con vueltas y alarmas sonoras. Simple y listo para pantalla completa.' },
            pt: { title: 'Cronômetro e Temporizador Online', description: 'Cronômetro preciso e temporizador de contagem regressiva com voltas e alarmes sonoros. Simples e pronto para tela cheia.' },
            hi: { title: 'ऑनलाइन स्टॉपवॉच और टाइमर', description: 'लैप्स और श्रव्य अलार्म के साथ सटीक स्टॉपवॉच और काउंटडाउन टाइमर। सरल और फुल-स्क्रीन के लिए तैयार।' }
        }
    },
    'json-to-csv': {
        title: 'JSON to CSV Converter',
        description: 'Convert JSON data to CSV format instantly. Perfect for data analysis and spreadsheet imports.',
        features: [
            '**Flatten JSON**: Automatically handles nested JSON structures.',
            '**Download CSV**: Export results directly to a .csv file.',
            '**Clean UI**: Paste JSON and get CSV formatted text immediately.',
            '**Privacy First**: All processing happens in your browser.',
            '**Large File Support**: Handles large JSON payloads efficiently.'
        ],
        howToUse: [
            { title: 'Paste JSON', description: 'Input your raw JSON data into the editor.' },
            { title: 'Convert', description: 'Click "Convert to CSV" to process the data.' },
            { title: 'Download', description: 'Save the generated CSV to your device.' }
        ],
        faqs: [
            { question: 'Does it handle nested objects?', answer: 'Yes, it flattens objects using dot notation.' }
        ],
        localizedMetadata: {
            es: { title: 'Conversor de JSON a CSV', description: 'Convierte datos JSON a formato CSV al instante. Perfecto para el análisis de datos e importaciones de hojas de cálculo.' },
            pt: { title: 'Conversor de JSON para CSV', description: 'Converta dados JSON para o formato CSV instantaneamente. Perfeito para análise de dados e importações de planilhas.' },
            hi: { title: 'JSON से CSV कनवर्टर', description: 'JSON डेटा को तुरंत CSV फॉर्मेट में बदलें। डेटा विश्लेषण और स्प्रेडशीट आयात के लिए बिल्कुल सही।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Calculadora de Impuestos sobre las Ventas (IVA/GST)', description: 'Calcula precios finales con impuestos sobre las ventas, IVA o GST incluidos o excluidos. Perfecto para autónomos y compradores.' },
            pt: { title: 'Calculadora de Imposto sobre Vendas (IVA/GST)', description: 'Calcule preços finais com imposto sobre vendas, IVA ou GST incluído ou excluído. Perfeito para freelancers e compradores.' },
            hi: { title: 'बिक्री कर कैलकुलेटर (GST/VAT)', description: 'बिक्री कर, VAT, या GST सहित या बिना अंतिम कीमतों की गणना करें। फ्रीलांसरों और खरीदारों के लिए बिल्कुल सही।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Convertidor de Mayúsculas y Minúsculas', description: 'Convierte texto entre MAYÚSCULAS, minúsculas, Tipo Título, Tipo Oración y más.' },
            pt: { title: 'Conversor de Maiúsculas e Minúsculas', description: 'Converta texto entre MAIÚSCULAS, minúsculas, Tipo Título, Tipo Frase e muito mais.' },
            hi: { title: 'टेक्स्ट केस कनवर्टर', description: 'टेक्स्ट को अपर केस, लोअर केस, टाइटल केस, सेंटेंस केस और बहुत कुछ में बदलें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Codificador y Decodificador de URL', description: 'Codifica y decodifica URLs de forma segura. Convierte caracteres especiales al formato de codificación porcentual requerido por los navegadores.' },
            pt: { title: 'Codificador e Decodificador de URL', description: 'Codifique e decodifique URLs com segurança. Converta caracteres especiais para o formato de codificação de porcentagem exigido pelos navegadores.' },
            hi: { title: 'URL एनकोडर और डिकोडर', description: 'URL को सुरक्षित रूप से एनकोड और डिकोड करें। ब्राउज़र द्वारा आवश्यक प्रतिशत एन्कोडिंग प्रारूप में विशेष वर्णों को बदलें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Generador de Lorem Ipsum', description: 'Genera texto de relleno personalizado para tus diseños. Elige párrafos, oraciones o palabras.' },
            pt: { title: 'Gerador de Lorem Ipsum', description: 'Gere texto de preenchimento personalizado para seus designs. Escolha parágrafos, frases ou palavras.' },
            hi: { title: 'लोरेम इप्सम जेनरेटर', description: 'अपने डिजाइनों के लिए कस्टम प्लेसहोल्डर टेक्स्ट जेनरेट करें। पैराग्राफ, वाक्य या शब्द चुनें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Generador Rápido de Marcadores de Imagen', description: 'Genera URLs de imágenes de marcador de posición para prototipos. Personaliza el tamaño, el color de fondo y el texto.' },
            pt: { title: 'Gerador Rápido de Espaço Reservado para Imagem', description: 'Gere URLs de imagem de espaço reservado para protótipos. Personalize o tamanho, a cor de fundo e o texto.' },
            hi: { title: 'फास्ट इमेज प्लेसहोल्डर जेनरेटर', description: 'प्रोटोटाइप के लिए डमी इमेज यूआरएल जेनरेट करें। आकार, बैकग्राउंड का रंग और टेक्स्ट कस्टमाइज़ करें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Codificador / Decodificador de Entidades HTML', description: 'Convierte caracteres especiales a sus equivalentes de entidad escalar HTML (por ejemplo, < se convierte en &lt;).' },
            pt: { title: 'Codificador / Decodificador de Entidades HTML', description: 'Converta caracteres especiais para seus equivalentes de entidade escalar HTML (ex: < torna-se &lt;).' },
            hi: { title: 'HTML एंटिटी एनकोडर / डिकोडर', description: 'विशेष वर्णों को उनके HTML स्केलर एंटिटी समकक्षों में बदलें (जैसे, < बन जाता है &lt;)।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Calculadora de TMB y GEDC', description: 'Calcula tu Tasa Metabólica Basal y Gasto Energético Diario Total para planificar tu dieta.' },
            pt: { title: 'Calculadora de TMB e GETD', description: 'Calcule sua Taxa Metabólica Basal e Gasto Energético Total Diário para planejar sua dieta.' },
            hi: { title: 'BMR और TDEE कैलकुलेटर', description: 'अपनी डाइट की योजना बनाने के लिए अपनी बेसल मेटाबोलिक दर और कुल दैनिक ऊर्जा व्यय की गणना करें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Calculadora de Préstamos y EMI', description: 'Calcula los pagos mensuales del préstamo (EMI), el interés total y la amortización.' },
            pt: { title: 'Calculadora de Empréstimos e EMI', description: 'Calcule pagamentos mensais de empréstimos (EMI), juros totais e amortização.' },
            hi: { title: 'ऋण और ईएमआई कैलकुलेटर', description: 'मासिक ऋण भुगतान (EMI), कुल ब्याज और परिशोधन की गणना करें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Generador CSS de Glassmorphism', description: 'Crea efectos de vidrio esmerilado de tendencia para tu interfaz de usuario. Personaliza el desenfoque, la transparencia y la saturación.' },
            pt: { title: 'Gerador CSS de Glassmorphism', description: 'Crie efeitos de vidro jateado modernos para sua interface. Personalize desfoque, transparência e saturação.' },
            hi: { title: 'ग्लासमॉर्फिज्म CSS जेनरेटर', description: 'अपने UI के लिए आधुनिक फ्रॉस्टेड-ग्लास प्रभाव बनाएं। ब्लर, पारदर्शिता और संतृप्ति को कस्टमाइज़ करें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Verificador de Diferencias de Texto', description: 'Compara dos archivos de texto en paralelo para encontrar diferencias. Resalta las líneas añadidas y eliminadas.' },
            pt: { title: 'Verificador de Diferenças de Texto', description: 'Compare dois arquivos de texto lado a lado para encontrar diferenças. Destaca linhas adicionadas e removidas.' },
            hi: { title: 'टेक्स्ट डिफ चेकर', description: 'अंतर खोजने के लिए दो टेक्स्ट फाइलों की साथ-साथ तुलना करें। जोड़ी गई और हटाई गई लाइनों को हाइलाइट करता है।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Calculadora de Edad', description: 'Calcula tu edad exacta en años, meses, semanas, días, horas y segundos.' },
            pt: { title: 'Calculadora de Idade', description: 'Calcule sua idade exata em anos, meses, semanas, dias, horas e segundos.' },
            hi: { title: 'आयु कैलकुलेटर', description: 'वर्षों, महीनों, हफ्तों, दिनों, घंटों और सेकंड में अपनी सटीक आयु की गणना करें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Generador de Fondos Animados CSS', description: 'Crea fondos animados hipnóticos y en bucle con CSS puro. Patrones, colores y velocidades personalizables.' },
            pt: { title: 'Gerador de Fundos Animados CSS', description: 'Crie fundos animados hipnotizantes e em loop com CSS puro. Padrões, cores e velocidades personalizáveis.' },
            hi: { title: 'CSS एनिमेटेड बैकग्राउंड जेनरेटर', description: 'प्योर CSS के साथ मंत्रमुग्ध कर देने वाले, लूपिंग एनिमेटेड बैकग्राउंड बनाएं। कस्टमाइज़ेबल पैटर्न, रंग और गति।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Calculadora de Interés Compuesto', description: 'Visualiza cómo crecen tus inversiones con el tiempo gracias al poder del interés compuesto.' },
            pt: { title: 'Calculadora de Juros Compostos', description: 'Visualize como seus investimentos crescem ao longo do tempo com o poder dos juros compostos.' },
            hi: { title: 'चक्रवृद्धि ब्याज कैलकुलेटर', description: 'कल्पना करें कि चक्रवृद्धि की शक्ति के साथ आपका निवेश समय के साथ कैसे बढ़ता है।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Conversor de Divisas', description: 'Tipos de cambio en tiempo real para más de 150 divisas mundiales.' },
            pt: { title: 'Conversor de Moedas', description: 'Taxas de câmbio em tempo real para mais de 150 moedas globais.' },
            hi: { title: 'मुद्रा परिवर्तक', description: '150+ वैश्विक मुद्राओं के लिए रीयल-टाइम विनिमय दरें।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Calculadora de Tarifa por Hora para Freelance', description: 'Calcula cuánto deberías cobrar por hora para alcanzar tus objetivos de ingresos anuales.' },
            pt: { title: 'Calculadora de Tarifa Horária para Freelancer', description: 'Calcule quanto você deve cobrar por hora para atingir suas metas de renda anual.' },
            hi: { title: 'फ्रीलांस प्रति घंटा दर कैलकुलेटर', description: 'गणना करें कि आपको अपने वार्षिक आय लक्ष्यों को पूरा करने के लिए प्रति घंटे कितना शुल्क लेना चाहिए।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Editor y Previsualizador de Markdown', description: 'Escribe, edita y previsualiza Markdown en tiempo real. Vista de pantalla dividida para un formato fácil.' },
            pt: { title: 'Editor e Visualizador de Markdown', description: 'Escreva, edite e visualize Markdown em tempo real. Visualização em tela dividida para formatação fácil.' },
            hi: { title: 'मार्काडाउन एडिटर और प्रीव्यूअर', description: 'वास्तविक समय में मार्कडाउन लिखें, संपादित करें और पूर्वावलोकन करें। आसान स्वरूपण के लिए स्प्लिट-स्क्रीन दृश्य।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Calculadora de Porcentajes', description: 'Resuelve problemas comunes de porcentajes: obtén el X% de Y, aumento/disminución porcentual y qué porcentaje es X de Y.' },
            pt: { title: 'Calculadora de Porcentagem', description: 'Resolva problemas comuns de porcentagem: encontre X% de Y, aumento/diminuição percentual e qual porcentagem X é de Y.' },
            hi: { title: 'प्रतिशत कैलकुलेटर', description: 'सामान्य प्रतिशत समस्याओं को हल करें: Y का X% खोजें, प्रतिशत वृद्धि/कमी, और X, Y का कितना प्रतिशत है।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Generador de Códigos QR', description: 'Crea códigos QR personalizables para URLs, acceso WiFi, texto y correos electrónicos.' },
            pt: { title: 'Gerador de Código QR', description: 'Crie códigos QR personalizáveis para URLs, acesso WiFi, texto e e-mails.' },
            hi: { title: 'क्यूआर कोड जेनरेटर', description: 'यूआरएल, वाईफाई एक्सेस, टेक्स्ट और ईमेल के लिए कस्टमाइज़ेबल क्यूआर कोड बनाएं।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Conversor de Unidades', description: 'Convierte entre unidades de medida comunes: Longitud, Peso, Temperatura y más.' },
            pt: { title: 'Conversor de Unidades', description: 'Converta entre unidades de medida comuns: comprimento, peso, temperatura e muito mais.' },
            hi: { title: 'इकाई कनवर्टर', description: 'सामान्य माप इकाइयों के बीच कनवर्ट करें: लंबाई, वजन, तापमान, और बहुत कुछ।' }
        }
    },
    'unix-timestamp': {
        title: 'Unix Timestamp Converter',
        description: 'Convert between Unix Epoch time and human-readable dates. Supports seconds, milliseconds, and multiple timezones.',
        features: [
            '**Real-time Conversion**: See current Unix time and human-readable equivalent automatically.',
            '**Seconds & Milliseconds**: Support for both 10-digit and 13-digit timestamps.',
            '**Date to Timestamp**: Convert any human-readable date back to Unix Epoch time.',
            '**ISO 8601**: Full support for standard ISO date formats.',
            '**Relative Time**: See how long ago a timestamp was (e.g., "5 minutes ago").'
        ],
        howToUse: [
            { title: 'Enter Timestamp', description: 'Paste a Unix timestamp to see its human-readable date.' },
            { title: 'Toggle Units', description: 'Switch between seconds and milliseconds as needed.' },
            { title: 'Pick a Date', description: 'Use the date picker to generate a timestamp for a specific time.' },
            { title: 'Copy Result', description: 'Easily grab the converted value.' }
        ],
        faqs: [
            { question: 'What is Unix time?', answer: 'It is the number of seconds that have elapsed since January 1, 1970 (UTC).' },
            { question: 'Does it handle timezones?', answer: 'Yes, we show results in both UTC and your local device time.' }
        ],
        localizedMetadata: {
            es: { title: 'Conversor de Tiempo Unix', description: 'Convierte entre tiempo Unix Epoch y fechas legibles por humanos. Soporta segundos, milisegundos y zonas horarias.' },
            pt: { title: 'Conversor de Timestamp Unix', description: 'Converta entre o tempo Unix Epoch e datas legíveis por humanos. Suporta segundos, milissegundos e vários fusos horários.' },
            hi: { title: 'यूनिक्स टाइमस्टैम्प कनवर्टर', description: 'यूनिक्स एपोक समय और मानव-पठनीय तिथियों के बीच कनवर्ट करें। सेकंड, मिलीसेकंड और कई समय क्षेत्रों का समर्थन करता है।' }
        }
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
        ],
        localizedMetadata: {
            es: { title: 'Contador de Palabras y Caracteres', description: 'Cuenta palabras, caracteres (con/sin espacios), oraciones, párrafos y tiempo de lectura.' },
            pt: { title: 'Contador de Palavras e Caracteres', description: 'Conte palavras, caracteres (com/sem espaços), frases, parágrafos e tempo de leitura.' },
            hi: { title: 'वर्ड और कैरेक्टर काउंटर', description: 'शब्द, वर्ण (रिक्त स्थान के साथ/बिना), वाक्य, पैराग्राफ और पढ़ने के समय की गणना करें।' }
        }
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
    'json-formatter': {
        title: 'JSON Formatter & Validator',
        description: 'Format, validate, and minify JSON data instantly. Clean up messy JSON and find syntax errors.',
        features: [
            '**Beautify**: Auto-indent and format messy JSON strings.',
            '**Minify**: Remove whitespace to reduce payload size.',
            '**Live Validation**: Real-time error detection with line numbers.',
            '**One-Click Copy**: Grab the formatted code instantly.',
            '**Dark Mode**: High-contrast editor for better readability.'
        ],
        howToUse: [
            { title: 'Paste JSON', description: 'Paste your raw data into the editor.' },
            { title: 'Format', description: 'Click "Beautify" to apply indentation.' },
            { title: 'Check Errors', description: 'Look for red markers if the JSON is invalid.' },
            { title: 'Copy Results', description: 'Copy the clean JSON to your clipboard.' }
        ],
        faqs: [
            { question: 'Is my data private?', answer: 'Yes, all processing happens locally in your browser.' },
            { question: 'Does it handle large objects?', answer: 'Yes, it is optimized for large JSON payloads.' }
        ],
        localizedMetadata: {
            es: { title: 'Formateador y Validador JSON', description: 'Formatea, valida y minifica datos JSON al instante. Limpia JSON desordenado y encuentra errores de sintaxis.' },
            pt: { title: 'Formatador e Validador JSON', description: 'Formate, valide e minifique dados JSON instantaneamente. Limpe JSON bagunçado e encontre erros de sintaxe.' },
            hi: { title: 'JSON फॉर्मेटर और वैलिडेटर', description: 'JSON डेटा को तुरंत फॉर्मेट, वैलिडेट और मिनिफ़ाई करें। अव्यवस्थित JSON को साफ करें और सिंटैक्स त्रुटियां खोजें।' }
        }
    },
    'base64': {
        title: 'Base64 Encoder & Decoder',
        description: 'Convert text to Base64 and vice versa instantly. Securely encode data for URI and data transfer.',
        features: [
            '**Bidirectional**: Switch between encode and decode modes instantly.',
            '**UTF-8 Support**: Correctly handles special characters and emojis.',
            '**Live Preview**: See the result update as you type.',
            '**Copy / Paste**: Clean interface for rapid processing.',
            '**Secure**: Locally processed without server interaction.'
        ],
        howToUse: [
            { title: 'Input Text', description: 'Paste your string or Base64 code.' },
            { title: 'Toggle Mode', description: 'Choose between "Encode" and "Decode".' },
            { title: 'Result', description: 'The converted value appears instantly.' },
            { title: 'Copy', description: 'Grab the result for your code.' }
        ],
        faqs: [
            { question: 'What is Base64?', answer: 'Base64 is an encoding scheme used to represent binary data in ASCII string format.' },
            { question: 'Is it encrypted?', answer: 'No, Base64 is an encoding, not encryption. It is easily reversible.' }
        ],
        localizedMetadata: {
            es: { title: 'Codificador y Decodificador Base64', description: 'Convierte texto a Base64 y viceversa al instante. Codifica datos de forma segura para URI y transferencia de datos.' },
            pt: { title: 'Codificador e Decodificador Base64', description: 'Converta texto para Base64 e vice-versa instantaneamente. Codifique dados com segurança para URI e transferência de dados.' },
            hi: { title: 'Base64 एनकोडर और डिकोडर', description: 'टेक्स्ट को बेस64 में और इसके विपरीत तुरंत बदलें। यूआरआई और डेटा ट्रांसफर के लिए डेटा को सुरक्षित रूप से एनकोड करें।' }
        }
    },
    'base-converter': {
        title: 'Binary, Hex, Decimal Base Converter',
        description: 'Convert numbers between various bases like Binary (2), Octal (8), Decimal (10), and Hexadecimal (16).',
        features: [
            '**Multi-Base Conversion**: Convert between any base from 2 to 36 instantly.',
            '**Live Processing**: Results update as you type or paste numeric values.',
            '**Large Numbers**: Handles large integer conversions accurately.',
            '**Byte Breakdown**: See binary representation grouped by bytes.',
            '**Clear Syntax**: Validation for each base type (e.g., no "G" in Hex).'
        ],
        howToUse: [
            { title: 'Enter Value', description: 'Input a number into any base field.' },
            { title: 'Select Base', description: 'Choose the input format (e.g., Binary or Decimal).' },
            { title: 'Get Results', description: 'See the equivalent value in all other bases automatically.' },
            { title: 'Copy', description: 'Copy the specific base result you need.' }
        ],
        faqs: [
            { question: 'Why use different bases?', answer: 'Binary is fundamental for computers, Hex for memory/colors, and Decimal for humans.' },
            { question: 'Is there a limit?', answer: 'It supports standard JavaScript integer limits for high precision.' }
        ],
        localizedMetadata: {
            es: { title: 'Conversor de Bases Numéricas', description: 'Convierte números entre varias bases como Binario (2), Octal (8), Decimal (10) y Hexadecimal (16).' },
            pt: { title: 'Conversor de Bases Numéricas', description: 'Converta números entre várias bases como Binário (2), Octal (8), Decimal (10) e Hexadecimal (16).' },
            hi: { title: 'बेस कनवर्टर (बाइनरी, हेक्स, डेसिमल)', description: 'बाइनरी (2), ऑक्टल (8), डेसिमल (10) और हेक्साडेसिमल (16) जैसे विभिन्न आधारों के बीच संख्याओं को बदलें।' }
        }
    },
    'pix-rem': {
        title: 'Pixel to REM Converter',
        description: 'Convert PX to REM units and vice versa for responsive web development. Fully customizable base font size.',
        features: [
            '**Bidirectional Converter**: Move between Pixels and REM units effortlessly.',
            '**Base Font Control**: Adjust the default root font size (usually 16px).',
            '**CSS Snippet**: Automatically generates the CSS unit with the correct syntax.',
            '**Quick Reference Table**: Common values (8px, 16px, 24px) pre-calculated.',
            '**Mobile Responsive**: Use it on the go while developing.'
        ],
        howToUse: [
            { title: 'Set Base', description: 'Enter your project\'s base font size (default is 16).' },
            { title: 'Enter Value', description: 'Input the Pixels you want to convert to REM.' },
            { title: 'Grab REM', description: 'Copy the calculated REM value for your CSS.' },
            { title: 'Reverse', description: 'Enter REM to find the exact Pixel equivalent.' }
        ],
        faqs: [
            { question: 'Why use REM instead of PX?', answer: 'REM is relative to the root font size, enabling better accessibility and scaling on mobile devices.' },
            { question: 'What is the default base?', answer: 'The industry standard is 16px.' }
        ],
        localizedMetadata: {
            es: { title: 'Conversor de Píxeles a REM', description: 'Convierte PX a REM y viceversa para el desarrollo web responsivo. Tamaño de fuente base totalmente personalizable.' },
            pt: { title: 'Conversor de Pixel para REM', description: 'Converta PX para REM e vice-versa para desenvolvimento web responsivo. Tamanho de fonte base totalmente personalizável.' },
            hi: { title: 'पिक्सेल से REM कनवर्टर', description: 'उत्तरदायी वेब विकास के लिए PX को REM और इसके विपरीत बदलें। पूरी तरह से अनुकूलन योग्य बेस फ़ॉन्ट आकार।' }
        }
    },
    'color-converter': {
        title: 'Color Converter - HEX, RGB, HSL',
        description: 'Convert colors between HEX, RGB, HSL, and more. Visual color picker included for rapid design.',
        features: [
            '**Multiple Formats**: HEX, RGB, HSL, CMYK support.',
            '**Visual Picker**: Fine-tune your colors with an interactive UI.',
            '**Live CSS**: One-click copy for CSS-ready color codes.',
            '**Contrast Check**: Simple check for accessibility.',
            '**Palette Preview**: See the color in a mock UI layout.'
        ],
        howToUse: [
            { title: 'Pick Color', description: 'Use the visual wheel or enter a value like #FFFFFF.' },
            { title: 'Select Format', description: 'Choose the output format you need for your code.' },
            { title: 'Copy CSS', description: 'Grab the ready-to-use CSS color value.' }
        ],
        faqs: [
            { question: 'What is HSL?', answer: 'Hue, Saturation, and Lightness - a more intuitive way to think about colors than RGB.' }
        ],
        localizedMetadata: {
            es: { title: 'Conversor de Colores - HEX, RGB, HSL', description: 'Convierte colores entre HEX, RGB, HSL y más. Incluye selector de color visual para un diseño rápido.' },
            pt: { title: 'Conversor de Cores - HEX, RGB, HSL', description: 'Converta cores entre HEX, RGB, HSL e muito mais. Seletor de cores visual incluído para design rápido.' },
            hi: { title: 'कलर कनवर्टर - HEX, RGB, HSL', description: 'HEX, RGB, HSL और अन्य के बीच रंग बदलें। त्वरित डिज़ाइन के लिए विज़ुअल कलर पिकर शामिल है।' }
        }
    },
    'keto-calc': {
        title: 'Keto Calculator - Macros for Weight Loss',
        description: 'Get your precise macronutrient targets for a ketogenic diet based on your body composition and goals.',
        features: [
            '**Personalized Macros**: Calculate Fat, Protein, and Carb targets.',
            '**Goal Settings**: Choose between Weight Loss, Maintenance, or Gain.',
            '**Calorie Deficit**: Adjust your deficit level for faster or slower results.',
            '**Body Fat %**: Integrated body fat estimation if unknown.',
            '**Activity Multiplier**: Adjusts based on exercise habits.'
        ],
        howToUse: [
            { title: 'Enter Stats', description: 'Input age, gender, weight, and height.' },
            { title: 'Set Goals', description: 'Choose your desired weight target and activity level.' },
            { title: 'Get Plan', description: 'View your daily macros and calorie limit.' }
        ],
        faqs: [
            { question: 'What are net carbs?', answer: 'Total carbs minus fiber and sugar alcohols.' },
            { question: 'Why high fat?', answer: 'To provide energy while keeping insulin low in ketosis.' }
        ],
        localizedMetadata: {
            es: { title: 'Calculadora Keto - Macros para Perder Peso', description: 'Obtén tus objetivos precisos de macronutrientes para una dieta cetogénica basada en tu composición corporal y metas.' },
            pt: { title: 'Calculadora Keto - Macros para Emagrecer', description: 'Obtenha suas metas precisas de macronutrientes para uma dieta cetogênica com base em sua composição corporal e objetivos.' },
            hi: { title: 'कीटो कैलकुलेटर - वजन घटाने के लिए मैक्रोज़', description: 'अपने शरीर की संरचना और लक्ष्यों के आधार पर कीटोजेनिक आहार के लिए अपने सटीक मैक्रोन्यूट्रिएंट लक्ष्य प्राप्त करें।' }
        }
    },
    'roi-calculator': {
        title: 'ROI Calculator - Return on Investment',
        description: 'Calculate the profitability of your investments and business projects with ease.',
        features: [
            '**Profit Ratio**: See your ROI as a percentage and multiplier.',
            '**Annualized ROI**: Adjust for the duration of the investment.',
            '**Breakdown**: Clearly see Total Gain and Cost side by side.',
            '**Simple UI**: No finance degree required to understand results.',
            '**Comparison**: Compare multiple ROI scenarios.'
        ],
        howToUse: [
            { title: 'Cost', description: 'Enter the amount you invested.' },
            { title: 'Revenue', description: 'Enter the amount you received/gained.' },
            { title: 'Duration', description: 'Enter how long the investment lasted.' },
            { title: 'Analyze', description: 'See your total and annualized ROI.' }
        ],
        faqs: [
            { question: 'What is a good ROI?', answer: 'It depends on the industry, but generally, anything positive is a start; 10% is often a baseline.' }
        ],
        localizedMetadata: {
            es: { title: 'Calculadora de ROI - Retorno de la Inversión', description: 'Calcula la rentabilidad de tus inversiones y proyectos empresariales con facilidad.' },
            pt: { title: 'Calculadora de ROI - Retorno sobre Investimento', description: 'Calcule a rentabilidade de seus investimentos e projetos de negócios com facilidade.' },
            hi: { title: 'ROI कैलकुलेटर - निवेश पर प्रतिफल', description: 'अपने निवेश और व्यावसायिक परियोजनाओं की लाभप्रदता की आसानी से गणना करें।' }
        }
    },
    'morse-code': {
        title: 'Morse Code Translator',
        description: 'Encode text into Morse code or decode Morse back to plain text. Includes audio playback and light flash options.',
        features: [
            '**Live Translate**: Words appear as code instantly as you type.',
            '**Audio Generator**: Listen to your code with adjustable speed.',
            '**International Support**: Handles accented characters and numbers.',
            '**Copy/Paste**: Swift workflow for communication.',
            '**Light Flash**: Visual signaling preview.'
        ],
        howToUse: [
            { title: 'Type Message', description: 'Input text to see the dots and dashes.' },
            { title: 'Decode', description: 'Paste dots and dashes to read the message.' },
            { title: 'Listen', description: 'Click play to hear the audio transmission.' }
        ],
        faqs: [
            { question: 'What is SOS?', answer: 'The international Morse code distress signal: ... --- ...' }
        ],
        localizedMetadata: {
            es: { title: 'Traductor de Código Morse', description: 'Codifica texto en código Morse o decodifica Morse a texto plano. Incluye reproducción de audio.' },
            pt: { title: 'Tradutor de Código Morse', description: 'Codifique texto em código Morse ou decodifique Morse para texto simples. Inclui reprodução de áudio.' },
            hi: { title: 'मोर्स कोड अनुवादक', description: 'टेक्स्ट को मोर्स कोड में एनकोड करें या मोर्स को वापस प्लेन टेक्स्ट में डिकोड करें। ऑडियो प्लेबैक शामिल है।' }
        }
    },
    'random-choice': {
        title: 'Random Choice Generator',
        description: 'Make decisions faster. Enter your options and let the random algorithms pick for you.',
        features: [
            '**Bulk Import**: Paste lists of names or items easily.',
            '**Visual Animations**: Exciting "choosing" state to build anticipation.',
            '**Weighted Choices**: Coming soon (Assign higher probability to some items).',
            '**History Log**: Keep track of previous picks.',
            '**Mobile Friendly**: Perfect for picking dinner or winners on the go.'
        ],
        howToUse: [
            { title: 'Input Options', description: 'Comma-separate your choices or use new lines.' },
            { title: 'Pick', description: 'Hit the button for a random selection.' },
            { title: 'Reset', description: 'Clear the board for a new round.' }
        ],
        faqs: [
            { question: 'Is it truly random?', answer: 'It uses standard PRNG (Pseudo-Random Number Generation) which is perfect for general decisions.' }
        ],
        localizedMetadata: {
            es: { title: 'Generador de Decisiones Aleatorias', description: 'Toma decisiones más rápido. Introduce tus opciones y deja que los algoritmos aleatorios elijan por ti.' },
            pt: { title: 'Gerador de Escolha Aleatória', description: 'Tome decisões más rápidamente. Insira suas opciones y deja que los algoritmos aleatorios elijan por usted.' },
            hi: { title: 'रैंडम विकल्प जेनरेटर', description: 'तेजी से निर्णय लें। अपने विकल्प दर्ज करें और रैंडम एल्गोरिदम को आपके लिए चुनने दें।' }
        }
    },
    'password-generator': {
        title: 'Random Password Generator - Secure & Custom',
        description: 'Create strong, secure passwords instantly. Completely customizable length and character sets.',
        features: [
            '**High Entropy**: Generates truly random, cryptographically secure passwords.',
            '**Custom Length**: From 4 to 128 characters.',
            '**Options**: Include symbols, numbers, uppercase, and lowercase.',
            '**Exclude Similar**: Remove ambiguous characters like I, l, 1, O, 0.',
            '**One-Click Copy**: Grab your new password instantly.'
        ],
        howToUse: [
            { title: 'Choose Length', description: 'Adjust the slider to your desired password length.' },
            { title: 'Select Rules', description: 'Toggle checkboxes for symbols, numbers, and casing.' },
            { title: 'Generate', description: 'Hit the button and copy your secure password.' }
        ],
        faqs: [
            { question: 'Is it safe?', answer: 'Yes, because the password is generated locally in your browser and never sent to a server.' },
            { question: 'What makes a strong password?', answer: 'Length (at least 12-16 characters) and a mix of character types.' }
        ],
        localizedMetadata: {
            es: { title: 'Generador de Contraseñas Aleatorias', description: 'Crea contraseñas fuertes y seguras al instante. Longitud y conjuntos de caracteres completamente personalizables.' },
            pt: { title: 'Gerador de Senhas Aleatórias', description: 'Crie senhas fortes e seguras instantaneamente. Comprimento e conjuntos de caracteres totalmente customizáveis.' },
            hi: { title: 'रैंडम पासवर्ड जेनरेटर', description: 'तुरंत मजबूत, सुरक्षित पासवर्ड बनाएं। पूरी तरह से अनुकूलन योग्य लंबाई और वर्ण सेट।' }
        }
    },
    'privacy-policy-gen': {
        title: 'Privacy Policy Generator - Free for Apps & Websites',
        description: 'Generate a professional privacy policy for your website or app in minutes. Compliance made simple.',
        features: [
            '**Quick Setup**: Answer a few questions about your site/app.',
            '**GDPR/CCPA Ready**: Includes standard clauses for global compliance.',
            '**HTML/Text Export**: Get your policy in multiple formats.',
            '**Free to Use**: No hidden costs or subscriptions.',
            '**Mobile App Support**: Policies tailored for iOS and Android apps.'
        ],
        howToUse: [
            { title: 'Enter Info', description: 'Provide your website name, URL, and contact email.' },
            { title: 'Select Cookies', description: 'Choose if you use Google Analytics, Ads, etc.' },
            { title: 'Generate & Copy', description: 'Review the generated text and copy it to your site.' }
        ],
        faqs: [
            { question: 'Is this legally binding?', answer: 'While professional, you should always consult with a lawyer for specific legal advice.' }
        ],
        localizedMetadata: {
            es: { title: 'Generador de Políticas de Privacidad', description: 'Genera una política de privacidad profesional para tu sitio web o aplicación en minutos.' },
            pt: { title: 'Gerador de Política de Privacidade', description: 'Gere uma política de privacidade profissional para o seu site ou aplicativo em minutos.' },
            hi: { title: 'गोपनीयता नीति जेनरेटर', description: 'मिनटों में अपनी वेबसाइट या ऐप के लिए एक पेशेवर गोपनीयता नीति तैयार करें।' }
        }
    },
    'bmi-calculator': {
        title: 'BMI Calculator - Body Mass Index Checker',
        description: 'Calculate your Body Mass Index (BMI) instantly. Understand your health status with our easy-to-use tool.',
        features: [
            '**Metric & Imperial**: Support for both kilograms/meters and pounds/inches.',
            '**Instant Category**: See if you are underweight, normal, overweight, or obese.',
            '**Visual Guide**: Easy-to-read chart for reference.',
            '**Privacy First**: Your data is not stored or shared.',
            '**Ideal Weight**: Get an estimate of your healthy weight range.'
        ],
        howToUse: [
            { title: 'Enter Stats', description: 'Input your height and weight.' },
            { title: 'Calculate', description: 'Hit the button to see your BMI score.' },
            { title: 'Check Category', description: 'Review where you fall on the standard BMI scale.' }
        ],
        faqs: [
            { question: 'What is BMI?', answer: 'Body Mass Index is a simple index of weight-for-height that is commonly used to classify underweight, overweight and obesity in adults.' }
        ],
        localizedMetadata: {
            es: { title: 'Calculadora de IMC - Índice de Masa Corporal', description: 'Calcula tu Índice de Masa Corporal (IMC) al instante. Comprende tu estado de salud con nuestra herramienta fácil de usar.' },
            pt: { title: 'Calculadora de IMC - Índice de Massa Corporal', description: 'Calcule seu Índice de Massa Corporal (IMC) instantaneamente. Entenda seu estado de saúde com nossa ferramenta fácil de usar.' },
            hi: { title: 'BMI कैलकुलेटर - बॉडी मास इंडेक्स', description: 'तुरंत अपने बॉडी मास इंडेक्स (BMI) की गणना करें। हमारे उपयोग में आसान टूल से अपनी स्वास्थ्य स्थिति को समझें।' }
        }
    }
};
