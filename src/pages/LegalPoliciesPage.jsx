import React from "react";
import LegalPoliciesTabs from "../component/LegalPoliciesTabs"; 
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";

const LegalPoliciesPage = () => {
    return (
        <>
            <Navbar />
            <LegalPoliciesTabs />
            <Footer />
        </>
    );
};

export default LegalPoliciesPage;
