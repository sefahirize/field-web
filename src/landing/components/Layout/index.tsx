export { default as Header } from "./Header";
export { default as Footer } from "./Footer";
export { default as Testimonials } from "./Testimonials";
export { default as CallToAction } from "./CallToAction";
export { default as Faq } from "./Faq";
export { default as Blog } from "./Blog";
export { default as GetStarted } from "./GetStarted";
export { default as Security } from "./Security";
export { default as AiSolutions } from "./AiSolutions";
export { default as Feature } from "./Feature";
export { default as Hero } from "./Hero";
export { default as Integration } from "./Integration";
export { default as Join } from "./Join";
export { default as TestimonialsShort } from "./TestimonialsShort";
export { default as Brands } from "./Brands";
import Testimonials from "./Testimonials";
import CallToAction from "./CallToAction";
import Faq from "./Faq";
import Blog from "./Blog";
import GetStarted from "./GetStarted";
import Security from "./Security";
import AiSolutions from "./AiSolutions";
import Feature from "./Feature";

const Layout = () => {
    return (
        <div>
            <Feature />
            <AiSolutions />
            <Testimonials />
            <Security />
            <GetStarted />
            <Blog />
            <Faq />
            <CallToAction />
        </div>
    );
};

export default Layout;
