import { BmrCalculator } from '@/components/tools/health/BmrCalculator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'BMR Calculator | Basal Metabolic Rate & Daily Calorie Needs',
    description: 'Calculate your Basal Metabolic Rate (BMR) and estimate your daily calorie requirements based on your activity level using our free online health tool.',
    keywords: ['bmr calculator', 'basal metabolic rate', 'how many calories do i burn', 'calorie needs calculator', 'tdee calculator'],
    alternates: {
        canonical: '/bmr-calculator',
    },
};

const faqItems = [
    {
        question: "What is BMR?",
        answer: "Basal Metabolic Rate (BMR) is the number of calories your body needs to accomplish its most basic (basal) life-sustaining functions, such as breathing, circulation, and cell production, while at rest."
    },
    {
        question: "How accurate is this calculator?",
        answer: "We use the Mifflin-St Jeor equation, which is widely considered the most accurate formula for predicting BMR in healthy adults. However, factors like muscle mass can influence your actual metabolic rate."
    },
    {
        question: "How do I use my BMR result?",
        answer: "Knowing your BMR helps you determine your TDEE (Total Daily Energy Expenditure). If you want to lose weight, you should eat fewer calories than your TDEE. If you want to gain weight, you eat more."
    }
];

const howToSteps: Step[] = [
    {
        title: "Input Bio Stats",
        description: "Enter your age, sex, weight, and height accurately."
    },
    {
        title: "Find Your BMR",
        description: "The main card shows your baseline calories burned just by existing."
    },
    {
        title: "Check Activity Tiers",
        description: "Look at the activity table below to see how many calories you actually need based on your lifestyle."
    }
];

export default function BmrPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        BMR Calculator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Map your metabolism for better health planning.
                    </p>
                </div>

                <BmrCalculator />
            </div>

            <HowToSection title="Metabolism & Energy" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
