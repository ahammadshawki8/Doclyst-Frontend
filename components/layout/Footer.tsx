import React from 'react';

const Footer: React.FC = () => (
  <footer className="text-center py-8 text-slate-300 text-sm mt-auto">
    <p>© {new Date().getFullYear()} Doclyst • Made with ERNIE & PaddlePaddle</p>
  </footer>
);

export default Footer;
