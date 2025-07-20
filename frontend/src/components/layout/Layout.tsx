'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-br from-azure-50 via-white to-azure-100/30 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg/80 ${className}`}>
      <Header />
      <main className="flex-grow relative">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
