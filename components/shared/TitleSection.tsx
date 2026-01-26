export interface TitleSectionProps {
    title: string;
    description: string;
}

export function TitleSection({ title, description }: TitleSectionProps) {
    return (
        <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                {title}
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400">
                {description}
            </p>
        </div>
    );
}
