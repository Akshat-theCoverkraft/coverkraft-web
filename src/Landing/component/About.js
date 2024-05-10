import React from 'react'
import './CSS/afterglow.css'
import happy from '../../Images/ic-happy.png'
import check from '../../Images/ic-check.png'
import done from '../../Images/ic-done.png'
const About = () => {
    return (
        <div className='container-fluid bg-image2 d-flex justify-content-around p-5'>
            <div className='col-md-4'>

                <h1 className='mb-5 mt-5' style={{ fontSize: '3.0rem' }}>Explore why we're the preferred destination for purchasing <span className='text-danger'>insurance</span></h1>
                <p className='text-secondary' style={{ fontSize: '1.7rem' }}>Join the multitude of  satisfied customers who choose us as their go-to destination for insurance solutions in India</p>

            </div>
            {/* <div className='col-md-8'>
        <div className='card row p-2'>
           <div>
                <img className='p-5 border-right' src={happy}/>
            </div> 
            <div>
                <h5>Seamless Experience</h5>
                <p></p>
            </div>
        </div>
      </div> */}
            <div class=" d-flex row col-md-5 " >
                <div class=" bg-white mb-4 rounded-4 row p-3">
                    <div class="col-md-4">
                        <img className='p-5 border-right' src={happy} />
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">

                            <h3 class="card-text mb-3">Seamless Experience</h3>
                            <p className='text-secondary fs-4'>Enjoy hassle-free policy management with our user-friendly platform.</p>
                        </div>
                    </div>
                </div>
                <div class="  bg-white mb-4 rounded-4 row p-3 ">
                    <div class="col-md-4" data-mdb-ripple-init data-mdb-ripple-color="light">
                        <img className='p-5 border-right' src={check} />
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">

                            <h3 class="card-text mb-3">Best Value</h3>
                            <p className='text-secondary fs-4'>Enjoy hassle-free policy management with our user-friendly platform.</p>
                        </div>
                    </div>
                </div>
                <div class=" bg-white mb-4 rounded-4 row p-3 shadow shadow-md">
                    <div class="col-md-4">
                        <img className='p-5 border-right' src={done} />
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">

                            <h3 class="card-text mb-3">Seamless Experience</h3>
                            <p className='text-secondary fs-4'>Enjoy seamless transactions for a stress-free insurance journey </p>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default About
