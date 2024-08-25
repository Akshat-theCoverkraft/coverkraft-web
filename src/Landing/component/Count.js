import React from 'react';
import frame from '../../Images/Frame 8.png';

const Count = () => {
    const imgStyle = {
        width: '100%',
        height: 'auto',
        display: 'block',
        objectFit: 'cover'
    };

    return (
        <div>
            <img src={frame} alt="Full Screen Image" style={imgStyle} />
        </div>
    );
}

export default Count;
