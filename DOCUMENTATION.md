# Toolboxed Documentation

Toolboxed is a comprehensive collection of developer, productivity, and utility tools built with Next.js. This application runs entirely in the browser, ensuring user privacy and speed.

## Overview

The application is structured as a "monorepo" of tools, where each tool resides in its own directory under `app/(tools)`. Configuration and metadata for all tools are centrally managed in `config/tool-content.ts`.

## Available Tools

Here is a list of the 50+ tools currently available in the application:

### Developer Tools
- **JWT Decoder & Debugger**: Decode, verify, and inspect JSON Web Tokens instantly.
- **UUID / GUID Generator**: Generate valid Version 1, 3, 4, and 5 UUIDs instantly.
- **SQL Formatter & Validator**: Beautify complex SQL queries.
- **Regex Tester**: Test and debug regular expressions in real-time.
- **JSON Formatter & Validator**: Format, validate, and minify JSON data.
- **JSON to CSV Converter**: Convert JSON data to CSV format.
- **Base64 Encoder & Decoder**: Convert text to Base64 and vice versa.
- **Markdown Editor & Previewer**: Write and preview Markdown in real-time.
- **HTML Entities Encoder**: Convert special characters to HTML entities.
- **URL Encoder & Decoder**: Safely encode and decode URLs.

### Design & CSS Tools
- **CSS Box Shadow Generator**: Create layered box-shadows visually.
- **Glassmorphism Generator**: Create trendy frosted-glass effects.
- **CSS Animated Backgrounds**: Create mesmerizing, looping animated backgrounds.
- **CSS Clip-Path Generator**: Create complex CSS shapes visually.
- **Color Converter**: Convert between HEX, RGB, HSL, and CMYK.
- **Pixel to REM Converter**: Convert PX to REM units.
- **Aspect Ratio Calculator**: Calculate dimensions for images and screens.
- **Fast Image Placeholder Generator**: Generate dummy image URLs.

### Productivity Tools
- **Kanban Board**: Manage tasks with a drag-and-drop board (saved locally).
- **Mind Map Builder**: Brainstorm on an infinite canvas.
- **Resume Builder**: Build ATS-friendly resumes and export as PDF.
- **Invoice Generator**: Create and download professional invoices.
- **Pomodoro Timer**: Boost productivity with focused work intervals.
- **Time-Block Planner**: Paint your day schedule in 30-minute blocks.
- **Privacy Policy Generator**: Generate privacy policies for apps/sites.
- **QR Code Generator**: Create custom QR codes for links and text.
- **PDF Master**: Merge, split, and sign PDFs.
- **Digital Signature Pad**: Draw and save digital signatures.

### Calculators
- **Family Spending Analyzer**: Track household expenses visually.
- **Freelance Rate Calculator**: Calculate hourly rates based on income goals.
- **Compound Interest Calculator**: Visualize investment growth.
- **ROI Calculator**: Calculate Return on Investment.
- **Loan & EMI Calculator**: Calculate monthly loan payments.
- **Sales Tax Calculator**: Calculate prices with GST/VAT.
- **Currency Converter**: Real-time exchange rates (150+ currencies).
- **Percentage Calculator**: Solve common percentage problems.
- **Unit Converter**: Convert common units (Length, Weight, etc.).
- **Age Calculator**: Calculate exact age in years/months/days.
- **BMR & TDEE Calculator**: Calculate metabolic rates for diet planning.
- **Keto Calculator**: Calculate macros for ketogenic diets.
- **BMI Calculator**: Check Body Mass Index.

### Text & String Utilities
- **Word & Character Counter**: Count words, chars, sentences, reading time.
- **Text Case Converter**: Convert between Title Case, uppercase, etc.
- **Text Diff Checker**: Compare two text files side-by-side.
- **Lorem Ipsum Generator**: Generate placeholder text.
- **Morse Code Translator**: Translate text to Morse code with audio.

### Miscellaneous
- **Stickman Animator**: Create stick figure animations.
- **Paint Tool**: Browser-based digital canvas.
- **Random Choice Generator**: Make decisions randomly.
- **Password Generator**: detailed configurable secure password generator.
- **Unix Timestamp Converter**: Convert Unix Epoch time to readable dates.

## How to Add a New Tool

1.  Create a new directory in `app/(tools)/`.
2.  Add your page component and logic.
3.  Register the tool in `config/tool-content.ts` with:
    *   Title and Description
    *   Features list
    *   How-to-use steps
    *   FAQs

## Privacy

All tools are designed to run client-side. No user data (images, code, PDFs, etc.) is sent to any server unless explicitly stated (e.g. for fetching currency rates).
