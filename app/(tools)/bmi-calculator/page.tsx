import { BmiCalculator } from '@/components/tools/health/BmiCalculator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'BMI Calculator | Body Mass Index Check',
    description: 'Calculate your Body Mass Index (BMI) online instantly. Check if you are in a healthy weight range based on your height and weight.',
    keywords: ['bmi calculator', 'body mass index', 'healthy weight', 'obesity calculator', 'health tools'],
    alternates: {
        canonical: '/bmi-calculator',
    },
};

const faqItems = [
    {
        question: "What is BMI?",
        answer: "BMI stands for Body Mass Index. It is a value derived from the mass (weight) and height of a person, defined as the body mass divided by the square of the body height."
    },
    {
        question: "Is BMI accurate for everyone?",
        answer: "BMI is a simple screening tool but it has limitations. It does not differentiate between muscle mass and fat mass, so athletes might be classified as overweight despite having low body fat."
    }
];

const howToSteps: Step[] = [
    {
        title: "Choose System",
        description: "Select between Metric (kg/cm) or Imperial (lbs/ft) measurement systems."
    },
    {
        title: "Enter Details",
        description: "Input your current weight and height using the sliders or text fields."
    },
    {
        title: "Check Result",
        description: "Your BMI score and category (Underweight, Normal, Overweight, Obese) are displayed instantly."
    }
];

export default function BmiPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        BMI Calculator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Check your health status in seconds.
                    </p>
                </div>

                <BmiCalculator />
            </div>

            <HowToSection title="Using the Calculator" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
