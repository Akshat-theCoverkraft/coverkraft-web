import React from 'react'
import logo from '../../Images/Coverkraft-logo.png'
import './CSS/footer.css'
import twitter from '../../Images/twitter.png';
import facebook from '../../Images/facebook.png';
import pinterest from '../../Images/pinterest.png';
import instagram from '../../Images/instagram.png';
import location from '../../Images/location_on.png';
import call from '../../Images/call.png';
import email from '../../Images/email.png';
const Footer = () => {
    return (
        <div>

            <footer class="text-center text-lg-start bg-body-tertiary text-muted " style={{background: '#F8F9FA'}}>


                <section class="py-5">
                    <div class="col-md-12 mx-5 text-center text-md-start mt-5">

                        <div class="row mt-3">

                            <div class="col-md-2 col-lg-2 col-xl-3 col-sm-12 mx-auto mb-4">

                                <h6 class="text-uppercase fw-bold mb-4">
                                    <img src={logo} alt='' height={25} />
                                </h6>
                                <p className='text-color fs-4 '>
                                    Coverkraft, we offer<br/> incredible tools for  filling out<br/> forms, scanning documents, <br/>and uploading them.
                                </p>
                            </div>

                            <div class="col-md-2 col-lg-2 col-xl-2  mx-auto mb-4">

                                <h6 class="text-uppercase fw-bold mb-4 fs-5 custom-color"  >
                                    Get in Touch
                                </h6>
                                <div className='d-flex '>
                                    <img src={location}  height={30} className='mt-1'/>
                                    <p  class="text-color fs-5 ml-4 footer-link">8819 Ohio St.South Gate, CA 90280</p>
                                </div>
                                <div className='d-flex '>
                                    <img src={email}  height={25} className='mt-1'/>
                                    <p  class="text-color fs-5 ml-4 footer-link">Ourstudio@hello.com</p>
                                </div>
                                <div className='d-flex '>
                                    <img src={call}  height={25} className='mt-1'/>
                                    <p  class="text-color fs-5 ml-4 footer-link">+1 386-688-3295</p>
                                </div>
                               

                            </div>

                            <div class="col-md-1 col-lg-2 col-xl-1  mx-auto mb-4">

                                <h6 class="text-uppercase fw-bold mb-4 fs-5 custom-color" >
                                    Service
                                </h6>
                                <p>
                                    <p href="#!" class="text-color fs-5 footer-link">Home</p>
                                </p>
                                <p>
                                    <p href="#!" class="text-color fs-5 footer-link">About us</p>
                                </p>
                                <p>
                                    <p href="#!" class="text-color fs-5 footer-link">Vault</p>
                                </p>
                                <p>
                                    <p href="#!" class="text-color fs-5 footer-link">Policy</p>
                                </p>
                            </div>

                            <div class="col-md-1 col-lg-2 col-xl-2 mx-auto mb-md-0 mb-4">

                                <h6 class="text-uppercase fw-bold mb-4 fs-5 custom-color" >Company</h6>
                                <p className='text-color fs-5 footer-link'> Blog</p>
                                <p className='text-color fs-5 footer-link'>
                                   
                                    Help
                                </p>
                                <p className='text-color fs-5 footer-link'>Terms & Conditions</p>

                            </div>

                            <div className='col-md-2 col-lg-2 col-xl-2 mx-auto'>
                               
                                <img src={twitter} className='mr-2 social-icon' height={45} width={45}/>
                                <img src={facebook} className='mr-2 social-icon'height={45} width={45}/>
                                <img src={instagram} className='mr-2 social-icon' height={45} width={45}/>
                                <img src={pinterest} className='mr-2 social-icon' height={45} width={45}/>
                                
                            </div>

                        </div>

                    </div>
                </section>


                <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                    <span class="mr-2 " >
                        © Coverkraft 2024

                    </span><span className='border-start border-secondary pl-2'>All Right Reserved</span>
                </div>
            </footer>

        </div>
    )
}

export default Footer