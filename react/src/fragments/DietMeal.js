import React from "react";

const DietMeal = ({ dietList }) => {
    // if no results returned
    if (!Array.isArray(dietList) || dietList.length === 0) {
        return <div>No diet plan available</div>;
    }

    return (
        <div className="dietList">
            <h1>Diet Plan Meal</h1>
            <div className="dietflex">
                {dietList.map((meal) => (
                    <div key={meal.id}>
                        <div className="article">
                            <h2>{meal.title}</h2>
                            <p>- <b>Protein:</b> {meal.protein} -</p>
                            <p>- <b>Fat:</b> {meal.fat} -</p>
                            <p>- <b>Carbs:</b> {meal.carbs} -</p>
                            <p>- <b>Calories:</b> {meal.calories} -</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DietMeal;
