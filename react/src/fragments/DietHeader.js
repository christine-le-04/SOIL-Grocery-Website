import React from "react";

const DietHeader = () => {
    return (

        <div className="dietheader">
            <div className="container">
                <img src="https://images.unsplash.com/photo-1505714197102-6ae95091ed70?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Two bowls of salad" class="cover-darken"></img>
                <div className="centered">
                    <br></br><br></br>
                    <h1>Create Your Diet Plan</h1>
                    <p>We can create a personalised diet plan for you, to best support you in obtaining your health goals! <br></br>
                        Here at SOIL, we believe in the importance of a healthy and happy lifestyle.</p>
                    <p>Using our diet planner, you can set your specific goals, and create tailor-made meal plans for your objectives.</p>
                    <span class="material-icons">restaurant</span>
                </div>
            </div>
            <br></br>
        </div>


    );
};

export default DietHeader;