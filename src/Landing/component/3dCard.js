import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import group from '../../Images/Group3d.png';
import Frame from "../../Images/Group3d1.png";
import car from "../../Images/Group3d.png";
import Frame1 from "../../Images/frame1.png";
import Frame2 from "../../Images/frame-2.png";
import group4 from "../../Images/luggage.png"
import group2 from "../../Images/paper.png";
import group3 from "../../Images/car-2.png";
import cardimg from "../../Images/Group 1000001201.png"
import './CSS/3dCard.css'

const Card3d = () => {
    const cardsData = [
        { id: 1, imageUrl: group, textColor: "#0F4BA4", company: 'Health Insurance', desgination: 'Get claim guarantee certificate ', imageUrl2: group2, paragraph: 'with your health plans', colorCode: "#CEE4F2" },
        { id: 2, imageUrl: car, textColor: "#667920", company: 'Car Insurance', desgination: 'Get claim guarantee certificate', imageUrl2: group3, paragraph: ' with your health plans', colorCode: "#F1FEB6" },
        { id: 3, imageUrl: Frame, textColor: "#3C0BB2", company: 'Term Life Insurance', desgination: 'Get claim guarantee certificate', imageUrl2: Frame2, paragraph: ' with your health plans', colorCode: "#D1C1F6" },
        { id: 4, imageUrl: Frame1, textColor: "#1E514B", company: 'Travel Insurance', desgination: 'Get claim guarantee certificate', imageUrl2: group4, paragraph: ' with your health plans', colorCode: "#B6FFE4" },

    ];



    return (
        <>
            <div className="containercard mt-5 my-4">
                <div>
                    <div className="" style={{ marginTop: "5em" }}>
                        <h3 className='text-center mb-3'>
                            <span style={{ color: '#FF9906' }}>BENEFITS</span>
                        </h3>

                    </div>
                    <div className="">
                        <h1 className='text-center mb-3 fw-b' style={{ fontWeight: 700, fontSize: 36 }}>
                            Why Prefer CoverKraft
                        </h1>

                    </div>
                    <div className="text-center">
                        <span className='text-center text-secondary mb-5' style={{ fontWeight: 500, fontSize: 20 }}>
                            Choose us for personalized insurance solutions, exceptional customer care, and unwavering commitment to protecting what matters most to you.            </span>

                    </div>
                </div>
                
            
            {/* <div className="containercard">
                {cardsData.map((card, index) => (
                    index % 4 === 0 && (
                        <div className="row justify-content-center" key={`row-${index}`}>
                            {cardsData.slice(index, index + 4).map((card) => (
                                <div key={card.id} className="col-md-2 p-4">
                                    <div style={{ marginTop: "4em"}}>
                                        <div className="">
                                            <div className="mb-1">
                                                <img src={car} alt="Car" className="img-fluid"  style={{ maxHeight: "30vh" }}/>
                                                
                                            </div>
                                           
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ))}
            </div> */}
           
            <div class="image-container flex justify-center items-center my-28">
  <img src={cardimg} class="hover-image transition duration-500 transform hover:scale-125 bg-indigo-400 hover:bg-indigo-600"/>
  <img src={cardimg} class="hover-image ml-12"/>
  <img src={cardimg} class="hover-image ml-12"/>
  <img src={cardimg} class="hover-image ml-12"/>
</div>

            </div>

            
        </>
    );
};

export default Card3d;
