import React from "react";
import { Link } from 'react-router-dom';

const Content = () => {
    return (
        <div className="main">
            <div className='wrapper'>
                <div className='inner'><b>Fresh Fruit Delivery</b> to your door</div>
                <div className='vertical-line'></div>
                <div className='inner'><b>In-Person Seminars</b> about diet</div>
                <div className='vertical-line'></div>
                <div className='inner'><b>Special Deals</b> for our customers</div>
            </div>

            <hr></hr>
            <div className='left-padding'>
                <br></br>
            </div>

            <div className='left'>
                <br></br>
                <h2>About Us</h2>
                <p>Welcome to SOIL: your one-stop shop for all things fresh food! Our grocery stores can be found all across Melbourne. Our goal is to bring high-quality, organic produce to our beloved community.</p>
                <p>In addition to our fresh produce, we also offer face-to-face seminars about diet, nutrition, and small-scale organic farming. Growing fresh fruit and vegetables can be an enriching experience!</p>
                <br></br>
            </div>

            <div className='right'>
                <br></br>
                <p><img src="https://images.unsplash.com/photo-1531730857698-ae61fc8a9826?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Tomatoes" width="300px"></img></p>
            </div>

            <div className='clearfix'></div>
            <br></br>
            <br></br>
            <div className="container">
                <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Fresh fruit" className="cover-darken"></img>
                <div className="centered">
                    <br></br><br></br><br></br><br></br>
                    <h1>Check out what we offer</h1>

                    <div className='wrapper'>
                        <div className='inner'>
                            <span className="material-icons">favorite</span>
                            <p><b>Our Produce</b></p>
                            <p>Start your day fresh with our super special products!</p>
                            <button type="button" className="btn btn-primary-big"><Link to="/products">Let's Go!</Link></button>
                        </div>
                    </div>

                    <p></p>
                </div>

            </div>
            <br></br>

        </div>
    );
};

export default Content;