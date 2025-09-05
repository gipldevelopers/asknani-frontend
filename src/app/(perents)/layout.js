"use client";
import Footer from '@/components/Helper/Footer';
import Navbar from '@/components/Helper/Navbar';
// components/Layout.js
import { useState } from 'react';


export default function Layout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}