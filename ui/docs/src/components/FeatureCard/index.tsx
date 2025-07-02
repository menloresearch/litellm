// frontend/docs/src/components/FeatureCard/index.tsx
import React from 'react';
import Link from '@docusaurus/Link';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  iconBgColor?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  href,
  iconBgColor = 'bg-blue-50 dark:bg-blue-900'
}) => {
  return (
    <Link 
      to={href}
      className="block relative group no-underline hover:no-underline"
    >
      {/* Shadow/3D effect */}
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
      
      {/* Main card */}
      <div className="relative bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-0">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;