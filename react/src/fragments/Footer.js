import React from "react";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="footer">
            <br></br>
            <h2><span className="material-icons">grade</span> SOIL <span className="material-icons">grade</span></h2>
            <br></br>
            <div className='left'>
                <p><b>Navigate</b></p>
                <div className='wrapper'>
                    <div className='inner'><Link to="/">Home Page</Link></div>
                    <div className='vertical-line'></div>
                    <div className='inner'><Link to="/products">Product Catalogue</Link></div>
                    <div className='vertical-line'></div>
                    <div className='inner'><Link to="/dietplan">Meal Planner</Link></div>
                </div>
            </div>

            <div className='right'>
                <p><b>Royalty-free resources used</b></p>
                <Link to="https://unsplash.com/" target="blank">Unsplash</Link>
                <br></br>
                <Link to="https://fonts.google.com/icons?selected=Material+Icons:home:" target="blank">Google Icons</Link>
            </div>
            <div className='clearfix'></div>

            <br></br>
        </div>
    );
};

export default Footer;