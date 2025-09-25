"use client";
import useAuthStore from "@/stores/AuthStore";
import AdBanner from "../Ads/AdBanner";
import AdImageBanner from "../Ads/AdImageBaner";
import AdPopUp from "../Ads/AdPopUp";
import BrandSections from "./BrandSections";
import CategorySlider from "./CategorySlider";
import CitiesSection from "./CitiesSection";
import DaycareListings from "./DaycareListings";
import FeaturedDaycares from "./FeaturedDaycares";
import HeroBanner from "./HeroBanner";
import WhyChooseUsSection from "./WhyChooseUsSection";

export default function Home_section() {
  return (
    <>
      {<AdBanner />}
      <AdImageBanner />
      {/* <AdPopUp /> */}
      <HeroBanner />
      <CategorySlider />
      <FeaturedDaycares />
      <DaycareListings />
      <CitiesSection />
      <BrandSections />
      <WhyChooseUsSection />
    </>
  );
}
