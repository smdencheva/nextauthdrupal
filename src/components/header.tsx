'use client'

import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Drupal Next</h1>
        <nav>
          <ul className="list-none p-0 m-0 flex gap-6">
            <li>
              <Link href="/" className="text-white hover:bg-gray-600 p-2 rounded">Home</Link>
            </li>
            <li>
              <Link href="/blog" className="text-white hover:bg-gray-600 p-2 rounded">Blog</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
