import React from "react";

const MealWeekly = (mealList) => {
    var mealWeek = mealList.mealList.week
    return (
        <div className="mealListWeekly">
            <br></br>
            <h1>Weekly Meal Plan</h1>
            {displayMeals(mealWeek.monday, "Mon")}
            {displayMeals(mealWeek.tuesday, "Tues")}
            {displayMeals(mealWeek.wednesday, "Weds")}
            {displayMeals(mealWeek.thursday, "Thurs")}
            {displayMeals(mealWeek.friday, "Fri")}
            {displayMeals(mealWeek.saturday, "Sat")}
            {displayMeals(mealWeek.sunday, "Sun")}
        </div>


    );
};

function displayMeals(day, weekDay) {
    var mealItem = day.meals

    return (
        <div className="displayMealsWeekly">
            <div class="day-container">
                <div className="article-day">
                    <h1>{weekDay}</h1>
                </div>
                <div className="articles-container">
                    {mealItem.map((meal) => (
                        <div key={meal.id}>
                            <div className="article">
                                <h2>{meal.title}</h2>
                                <p><b>- Serves {meal.servings} -</b></p>
                                <p>Ready in {meal.readyInMinutes} minutes</p>
                                <ul>
                                    <a href={meal.sourceUrl} target="_blank" rel="noreferrer">Go to Recipe</a>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MealWeekly;