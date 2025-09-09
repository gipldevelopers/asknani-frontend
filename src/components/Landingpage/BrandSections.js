import Link from "next/link";
import Testimonials from "./Testimonials";
import Image from "next/image";

// components/BrandSections.js
export default function BrandSections() {
  return (
    <>
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How askNani Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Finding the perfect daycare for your child has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Search & Discover</h3>
              <p className="text-gray-600">
                Use our filters to find daycares that match your location, budget, and specific needs
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Compare & Connect</h3>
              <p className="text-gray-600">
                Read reviews, check availability, and message providers directly through our platform
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Book & Pay Securely</h3>
              <p className="text-gray-600">
                Reserve your spot with confidence using our secure booking and payment system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Verification Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Safety & Verification Standards
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We rigorously verify every daycare provider on our platform to ensure your child&apos;s safety and your peace of mind.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Background Checks</h3>
                    <p className="text-gray-600">All staff undergo comprehensive background screening</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold">License Verification</h3>
                    <p className="text-gray-600">We confirm all required state and local licenses</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Facility Inspections</h3>
                    <p className="text-gray-600">Regular safety and cleanliness inspections</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Image
                fill
                src="https://placehold.co/400x400/EEE/31343C?font=montserrat&text=Owner%20Photo"
                alt="Child safety in daycare"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Perfect Daycare?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of parents who have found quality childcare through askNani
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/signup">
              <button className="px-8 py-3 bg-white text-primary rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Sign Up Now
              </button>
            </Link>
            <Link href="/daycares">
              <button className="px-8 py-3 border border-white text-white rounded-lg font-bold hover:bg-primary transition-colors">
                Browse Daycares
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}