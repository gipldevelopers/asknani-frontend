"use client";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const ProviderFooter = () => {
  return (
    <footer className="bg-gray-50 text-white border-t border-gray-200 mt-auto">
      {/* Top Section */}
      {/* <div className="container mx-auto px-6 py-10 grid gap-8 md:grid-cols-2">
                
                <div>
                    <h3 className="text-xl font-bold">askNani</h3>
                    <p className="text-slate-400 mt-2 text-sm max-w-sm">
                        India’s trusted daycare marketplace for providers.
                        Simplifying childcare management with modern solutions.
                    </p>

                    <div className="flex space-x-4 mt-5">
                        {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <Icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>

       
                <div className="space-y-3 text-slate-300 text-sm">
                    <h4 className="text-lg font-semibold mb-2">Contact</h4>
                    <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-slate-400" /> +91 98765 43210
                    </div>
                    <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-slate-400" /> support@asknani.com
                    </div>
                    <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-slate-400" /> Ahmedabad, India
                    </div>
                </div>
            </div> */}

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs">
          {/* Left side - Copyright + Version */}
          <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-4">
            <p>© {new Date().getFullYear()} askNani. All rights reserved.</p>
            <span className="text-slate-500">|</span>
            <p className="text-slate-500">v1.0.0</p>
          </div>

          {/* Right side - Links */}
          <div className="flex space-x-6 mt-2 md:mt-0">
            <Link href="#" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">
              Support
            </Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">
              Documentation
            </Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ProviderFooter;
