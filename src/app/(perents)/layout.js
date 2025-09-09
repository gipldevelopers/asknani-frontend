"use client";
import Footer from '@/components/Helper/Footer';
import Navbar from '@/components/Helper/Navbar';

export default function Layout({ children }) {


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
