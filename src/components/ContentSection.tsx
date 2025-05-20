
import React from 'react';

interface ContentSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  id,
  title,
  subtitle,
  className = '',
  children,
}) => {
  return (
    <section id={id} className={`py-16 md:py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
};

export default ContentSection;
