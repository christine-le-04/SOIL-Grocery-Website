import React from "react";

const Meal = (mealList) => {
    var mealItem = mealList.mealList.meals

    return (
        <div className="mealList">
            <h1>Daily Meal Plan</h1>
            <div class="flex">
                {mealItem.map((meal) => (
                    <div key={meal.id}>
                        <div className="article">
                            <h2>{meal.title}</h2>
                            <p><b>- Serves {meal.servings} -</b></p>
                            <p>Ready in {meal.readyInMinutes} minutes</p>
                            <ul>
                                <a href={meal.sourceUrl} target="blank">Go to Recipe</a>
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default Meal;