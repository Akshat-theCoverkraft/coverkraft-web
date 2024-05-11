import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import group from '../../Images/Clip path group.png';
import Frame from "../../Images/frame.png";
import car from "../../Images/car-1.png";
import Frame1 from "../../Images/frame1.png";
import Frame2 from "../../Images/frame-2.png";
import group4 from "../../Images/luggage.png"
import group2 from "../../Images/paper.png";
import group3 from "../../Images/car-2.png";
const Job = () => {
    const cardsData = [
        { id: 1, imageUrl: group, textColor: "#0F4BA4", company: 'Health Insurance', desgination: 'Get claim guarantee certificate ', imageUrl2: group2, paragraph: 'with your health plans', colorCode: "#CEE4F2" },
        { id: 2, imageUrl: car, textColor: "#667920", company: 'Car Insurance', desgination: 'Get claim guarantee certificate', imageUrl2: group3, paragraph: ' with your health plans', colorCode: "#F1FEB6" },
        { id: 3, imageUrl: Frame, textColor: "#3C0BB2", company: 'Term Life Insurance', desgination: 'Get claim guarantee certificate', imageUrl2: Frame2, paragraph: ' with your health plans', colorCode: "#D1C1F6" },
        { id: 4, imageUrl: Frame1, textColor: "#1E514B", company: 'Travel Insurance', desgination: 'Get claim guarantee certificate', imageUrl2: group4, paragraph: ' with your health plans', colorCode: "#B6FFE4" },

    ];



    return (
        <>
            <div className="container my-4">


                {cardsData.map((card, index) => (
                    index % 4 === 0 && (
                        <div className="row" key={`row-${index}`}>
                            {cardsData.slice(index, index + 4).map((card) => (
                                <div key={card.id} className="col-md-3 p-2">
                                    <Card className="h-100" style={{ padding: '40px', backgroundColor: card.colorCode, width: '95%' }}>
                                        <div className='d-flex flex-column grid'>
                                            <div className=''>
                                                <div className='mb-1'>
                                                    <img
                                                        src={card.imageUrl}
                                                    />
                                                </div>
                                            </div>
                                            <div className='p-1'>
                                                <Typography className='mt-1' gutterBottom variant="body2" style={{ fontSize: '25px', fontWeight: "700", color: card.textColor, }}>
                                                    {card.company}
                                                </Typography>
                                                <Typography gutterBottom variant="body2" style={{ fontSize: '40px', fontWeight: 'bold', color: card.textColor, }}>
                                                    {card.desgination}
                                                </Typography>
                                            </div>
                                            {/* <div className='d-flex col-md-11'>
                    <Typography variant="body2"  style={{fontSize: '25px', fontWeight: "700", color: card.textColor, }}>
                      {card.paragraph}
                    </Typography>
                  </div> */}
                                            <div className='d-flex justify-content-end' style={{ maxHeight: "120px", marginTop: "1em" }}>
                                                <div>
                                                    <img
                                                        style={{ height: "160px" }}
                                                        src={card.imageUrl2}
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                    </Card>
                                </div>
                            ))}
                        </div>
                    )
                ))}

            </div>
        </>
    );
};

export default Job;
