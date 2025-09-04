import Layout from "../Helper/Layout";
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
            <HeroBanner />
            <CitiesSection />
            <DaycareListings />
            <FeaturedDaycares />
            <CategorySlider />
            <BrandSections />
            <WhyChooseUsSection/>
       </>
    );
}