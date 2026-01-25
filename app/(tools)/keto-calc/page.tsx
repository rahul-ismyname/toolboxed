import { KetoCalculator } from '@/components/tools/keto/KetoCalculator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Keto Calculator | Scientific Ketogenic Macro & Calorie Counter',
    description: 'Calculate your exact macros for the ketogenic diet. Accurate Keto Calculator for weight loss, maintenance, or muscle gain. Free and easy to use.',
    keywords: ['keto calculator', 'ketogenic diet macros', 'carb calculator', 'keto weight loss', 'low carb calculator'],
};

const faqItems = [
    {
        question: "What is the Ketogenic Diet?",
        answer: "The Ketogenic (Keto) diet is a high-fat, adequate-protein, low-carbohydrate diet that forces the body to burn fats rather than carbohydrates."
    },
    {
        question: "How much protein should I eat on Keto?",
        answer: "Standard ketogenic diets recommend between 1.2g to 1.7g of protein per kg of body weight. This calculator uses a moderate approach (~25% of calories)."
    },
    {
        question: "What is 'Net Carbs'?",
        answer: "Net carbs are the total carbohydrates minus fiber and sugar alcohols. On Keto, you typically want to stay under 20-25g of Net Carbs per day to maintain a state of ketosis."
    }
];

const howToSteps: Step[] = [
    {
        title: "Enter Your Stats",
        description: "Input your age, gender, weight, and height to determine your Basal Metabolic Rate (BMR)."
    },
    {
        title: "Select Activity & Goal",
        description: "Choose how active you are and whether you want to lose weight, maintain, or gain muscle."
    },
    {
        title: "Get Your Macros",
        description: "Instantly see how many grams of Fat, Protein, and Carbs you should eat daily."
    }
];

export default function KetoCalcPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <BackButton />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                        Keto Macro Calculator
                    </h1>
                    <p className="text-xl text-slate-500">
                        Master your metabolism with our scientific ketogenic calculator.
                    </p>
                </div>

                <KetoCalculator />
            </div>

            <HowToSection title="How to use this Calculator" steps={howToSteps} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center prose">
                <h3>Why precision matters</h3>
                <p>
                    Guessing your intake often leads to plateaus. This tool uses the Mifflin-St Jeor equation,
                    considered one of the most accurate for estimating calorie needs, adjusted specifically for
                    ketogenic macro ratios.
                </p>
            </div>

            <FaqSection items={faqItems} />
        </div>
    );
}
