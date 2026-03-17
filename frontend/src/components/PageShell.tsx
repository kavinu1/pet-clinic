import type { ReactNode } from 'react';

import BackToTop from './BackToTop';
import Footer from './Footer';
import Navbar from './Navbar';

type Props = {
  children: ReactNode;
  mainClassName?: string;
};

export default function PageShell({ children, mainClassName = 'container page-main' }: Props) {
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <Navbar />
      <main id="main" className={mainClassName} tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

