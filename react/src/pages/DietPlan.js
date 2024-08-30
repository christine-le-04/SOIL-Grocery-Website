import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DietHeader from "../fragments/DietHeader";
import Meal from "../fragments/Meal";
import MealWeekly from "../fragments/MealWeekly";
import DietMeal from "../fragments/DietMeal";
import { getValidationError, getDietError } from "../data/repodiet";
import { Button } from 'react-bootstrap';

const DietPlan = (props) => {
    const [currDetails, setCurrDetails] = useState({ id: 0, age: null, weight: null, height: null, sex: null, activityLevel: null, dietPreferences: null, healthGoal: null, timeFrame: null });
    const [updateError, setUpdateError] = useState({ age: null, weight: null, height: null, sex: null, healthGoal: null });
    const [userData, setUserData] = useState ({ protein: null, fat: null, carbs: null, calories: null, healthGoal: null });
    const [dietError, setDietError] = useState({ protein: null, fat: null, carbs: null, calories: null });
    const [userDiet, setUserDiet] = useState ({ protein: null, fat: null, carbs: null, calories: null });
    const [dietData, setDietData] = useState(null)
    const [mealData, setMealData] = useState(null)
    const [planType, setPlanType] = useState(null)
    const [showDietPlan, setShowDietPlan] = useState(false)
    const navigate = useNavigate();

    // TURN BACK ON LATER THIS IS FOR TESTING PURPOSES

    useEffect(() => {
        // keeps track of loggedIn status
        if (props.loggedIn === false) {
            // if not logged in, navigates to home page
            navigate("/");
        } 
    }, [props.loggedIn]);

    const handleInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        // copy of inputs object that holds the input data from the input fields
        const temp = { age: currDetails.age, weight: currDetails.weight, height: currDetails.height, sex: currDetails.sex, activityLevel: currDetails.activityLevel, dietPreferences: currDetails.dietPreferences, healthGoal: currDetails.healthGoal, timeFrame: currDetails.timeFrame  };

        // updates the input and state
        temp[name] = value;
        setCurrDetails(temp);
    }

    const saveData = (event) => {
        event.preventDefault();
        
        // check for errors
        let errors = getValidationError(currDetails.age, currDetails.weight, currDetails.height, currDetails.sex, currDetails.activityLevel, currDetails.dietPreferences, currDetails.healthGoal, currDetails.timeFrame);
        setUpdateError(errors);

        // if there are errors, replace any existing meal data and diet data retrieved from the api
        // when there's an error, the diet plan will act as if the personalised profile has not been created
        if (errors.age !== null || errors.weight !== null || errors.height !== null || errors.sex !== null || errors.activityLevel !== null || errors.dietPreferences !== null || errors.healthGoal !== null ||  errors.timeFrame !== null) {
            setMealData(null);
            setDietData(null);
            setShowDietPlan(false);
        }

        // Check if there are no errors in the info
        if (errors.age === null && errors.weight === null && errors.height === null && errors.sex === null && errors.activityLevel === null && errors.dietPreferences === null && errors.healthGoal === null && errors.timeFrame === null) {
            // generate meal plan using spoonacular api
            getMealPlan(currDetails)

            // TO DO: Show confirmation of purchase 
            alert("Your meal plan has been generated!")

            // when meal plan is generated, showdietplan = true
            setShowDietPlan(true)

            return
        } 

    }

    function getMealPlan(currDetails) {
        var mealPlanString = "https://api.spoonacular.com/mealplanner/generate?apiKey=711388a6f0854bcebe162d1066e6ac5b"
        //add parameter: daily or weekly?
        if (currDetails.timeFrame === "Daily")
        {
            mealPlanString = mealPlanString.concat("&timeFrame=day")
            setPlanType("Daily")
        }
        else if (currDetails.timeFrame === "Weekly")
        {
            mealPlanString = mealPlanString.concat("&timeFrame=week")
            setPlanType("Weekly")
        }
        else
        { 
            console.log("Unidenitified timeFrame found. Defaulting to Daily.")
            mealPlanString = mealPlanString.concat("&timeFrame=day")
            setPlanType("Daily")
        }

        //add parameter: diet restrictions?
        if (currDetails.dietPreferences === "GlutenFree")
        {
            mealPlanString = mealPlanString.concat("&diet=glutenfree")
        }
        else if (currDetails.dietPreferences === "Ketogenic")
        {
            mealPlanString = mealPlanString.concat("&diet=ketogenic")
        }
        else if (currDetails.dietPreferences === "Vegetarian")
        {
            mealPlanString = mealPlanString.concat("&diet=vegetarian")
        }
        else if (currDetails.dietPreferences === "Vegan")
        {
            mealPlanString = mealPlanString.concat("&diet=vegan")
        }
        else if (currDetails.dietPreferences === "Pescetarian")
        {
            mealPlanString = mealPlanString.concat("&diet=pescetarian")
        }
        else if (currDetails.dietPreferences === "Paleo")
        {
            mealPlanString = mealPlanString.concat("&diet=paleo")
        } 

        // calorie intake equation based on Harris-Benedict equation from 'A Biometric Study of Human Basal Metabolism' (cited in readme.md)
        // determines calorie amount based on health goal, age, sex at birth, and activity lvl
        var calorieIntake = 0;
        if (currDetails.sex === "Male") {
            calorieIntake = 66.5 + (13.95 * currDetails.weight) + (5.003 * currDetails.height) - (6.75 * currDetails.age)
        } else if (currDetails.sex === "Female") {
            calorieIntake = 665.1 + (9.563 * currDetails.weight) + (1.850 * currDetails.height) - (4.676 * currDetails.age)
        }
        
        if (currDetails.activityLevel === "Sedentary") {
            calorieIntake *= 1.2
        } else if (currDetails.activityLevel === "LightlyActive") {
            calorieIntake *= 1.375
        } else if (currDetails.activityLevel === "ModeratelyActive") {
            calorieIntake *= 1.55
        } else if (currDetails.activityLevel === "Active") {
            calorieIntake *= 1.725
        }

        if (currDetails.healthGoal === "HealthImprovement") {            
            mealPlanString = `${mealPlanString}&targetCalories=${calorieIntake}`;
        } else if (currDetails.healthGoal === "WeightLoss") {
            calorieIntake -= 500
            mealPlanString = `${mealPlanString}&targetCalories=${calorieIntake}`;
        } else if (currDetails.healthGoal === "MuscleGain") {
            calorieIntake += 500
            mealPlanString = `${mealPlanString}&targetCalories=${calorieIntake}`;
        }
        
        setMealData(null);
        setDietPlanVar(calorieIntake, currDetails.weight);

        fetch(
            mealPlanString
        )
        .then((response) => response.json())
        .then((data) => {
            setMealData(data);
        })
        .catch(() => {
            console.log("Error - getMealPlan function is not working. Fetch from API has not worked.")
        })
    }

    function setDietPlanVar(calorieIntake, weight) {
        var proteinIntake = null;
        var fatIntake = null;
        var carbsIntake = null;
        var goalString = null;

        // this data was based on Best Macros Calculator for Tracking Muscle Gain and Fat Loss (cited in readme)
        proteinIntake = 2.2 * weight; // 2.2 grams per kg
        fatIntake = 0.66 * weight; // 0.66 grams per kg
        carbsIntake = calorieIntake - ((proteinIntake * 4) + (fatIntake * 9)); // calorie amount of carbs = total calorie intake - (protein in cal + fat in cal)
        carbsIntake /= 4; // 4 cals per gram of carb; this converts calories to grams
        
        if (currDetails.healthGoal === "MuscleGain") {
            goalString = "gain muscle"
        } else if (currDetails.healthGoal === "WeightLoss") {
            goalString = "lose weight"
        } else if (currDetails.healthGoal === "HealthImprovement") {
            goalString = "improve your health"
        }

        const temp = { protein: proteinIntake, fat: fatIntake, carbs: carbsIntake, calories: calorieIntake, healthGoal: goalString };
        setUserData(temp);
    }

    const handleDietInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        // copy of inputs object that holds the input data from the input fields
        const temp = { protein: userDiet.protein, fat: userDiet.fat, carbs: userDiet.carbs, calories: userDiet.calories  };

        // updates the input and state
        temp[name] = value;
        setUserDiet(temp);
    }

    const saveDietData = (event) => {
        event.preventDefault();
        
        // check for errors
        let errors = getDietError(userDiet.protein, userDiet.fat, userDiet.carbs, userDiet.calories);
        setDietError(errors);

        // if there are errors, reset any existing diet data retrieved from the api
        if (errors.protein !== null || errors.fat !== null || errors.carbs !== null || errors.calories !== null) {
            setDietData(null);
        }

        // Check if there are no errors in the info
        if (errors.protein === null && errors.fat === null && errors.carbs === null && errors.calories === null) {
            // generate meal plan using spoonacular api
            getDietPlan(userDiet)

            // TO DO: Show confirmation of purchase 
            alert("Your diet plan has been generated!")

            return
        } 

    }

    function getDietPlan(userDiet) {
        var dietPlanString = "https://api.spoonacular.com/recipes/findByNutrients?apiKey=711388a6f0854bcebe162d1066e6ac5b"

        // gets the max num of grams for ecah macronutrient
        dietPlanString = dietPlanString.concat("&maxProtein=", userDiet.protein);
        dietPlanString = dietPlanString.concat("&maxFat=", userDiet.fat);
        dietPlanString = dietPlanString.concat("&maxCarbs=", userDiet.carbs);
        dietPlanString = dietPlanString.concat("&maxCalories=", userDiet.calories);

        setDietData(null);

        fetch(
            dietPlanString
        )
        .then((response) => response.json())
        .then((data) => {
            setDietData(data);
        })
        .catch(() => {
            console.log("Error - getDietPlan function is not working. Fetch from API has not worked.")
        })
    }

    return (
        <div className="dietplan">
            <DietHeader />
            <br></br><br></br><br></br><br></br>
            <div className="popup-container">
                <br></br>
                <div className="popup-text" id="mealplan">
                    <h1>Personalise Your Meal Plan</h1>
                    <p>Please enter your details to create your personalised profile.</p>
                    <div className="cc-input-container">
                        <center>
                            <div className="left-option">
                                <input name="age" type="text" onChange={handleInputChange} placeholder="Age"/>
                                <div className="cc-error">
                                    {updateError.age !== null &&
                                        <div className="error-message">
                                            <span className="text-danger">{updateError.age}</span>
                                        </div>
                                    }
                                </div>

                                <input name="weight" type="text" onChange={handleInputChange} placeholder="Weight in kg"/>
                                <div className="cc-error">
                                    {updateError.weight !== null &&
                                        <div className="error-message">
                                            <span className="text-danger">{updateError.weight}</span>
                                        </div>
                                    }
                                </div>

                                <input name="height" type="text" onChange={handleInputChange} placeholder="Height in cm"/>
                                <div className="cc-error">
                                    {updateError.height !== null &&
                                        <div className="error-message">
                                            <span className="text-danger">{updateError.height}</span>
                                        </div>
                                    }
                                </div>

                                <select name="sex" type="text" onChange={handleInputChange}>
                                    <option value="">Sex at Birth</option>   
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                </select>
                                <div className="cc-error">
                                    {updateError.sex !== null &&
                                        <div className="error-message">
                                            <span className="text-danger">{updateError.sex}</span>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="right-option">
                                <select name="activityLevel" type="text" onChange={handleInputChange}>
                                    <option value="">Activity Level</option>   
                                    <option value="Sedentary">Sedentary</option>
                                    <option value="LightlyActive">Lightly Active</option>
                                    <option value="ModeratelyActive">Moderately Active</option>
                                    <option value="Active">Active</option>
                                </select>
                                <div className="cc-error">
                                    {updateError.activityLevel !== null &&
                                        <div className="error-message">
                                            <span className="text-danger">{updateError.activityLevel}</span>
                                        </div>
                                    }
                                </div>

                                <select name="dietPreferences" type="text" onChange={handleInputChange}>
                                    <option value="">Dietary Preference</option>
                                    <option value="None">None</option>
                                    <option value="GlutenFree">Gluten Free</option>
                                    <option value="Ketogenic">Ketogenic</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Pescetarian">Pescetarian</option>
                                    <option value="Paleo">Paleo</option>
                                </select>
                                <div className="cc-error">
                                    {updateError.dietPreferences !== null &&
                                        <div className="error-message">
                                            <span className="text-danger">{updateError.dietPreferences}</span>
                                        </div>
                                    }
                                </div>
                            
                                <select name="healthGoal" type="text" onChange={handleInputChange}>
                                    <option value="">Health Goal</option>
                                    <option value="WeightLoss">Weight Loss</option>
                                    <option value="MuscleGain">Muscle Gain</option>
                                    <option value="HealthImprovement">Health Improvement</option>
                                </select>
                                <div className="cc-error">
                                    {updateError.healthGoal !== null &&
                                        <div className="error-message">
                                            <span className="text-danger">{updateError.healthGoal}</span>
                                        </div>
                                    }
                                </div>
                                
                                <select name="timeFrame" type="text" onChange={handleInputChange}>
                                    <option value="">Meal Plan Frequency</option>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                </select>
                                <div className="cc-error">
                                    {updateError.timeFrame !== null &&
                                        <div className="error-message">
                                            <span className="text-danger">{updateError.timeFrame}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </center>
                        <br></br>
                        <Button class="button button-green" onClick={saveData} >Generate Your Meal Plan</Button>
                    </div>
                </div>
            </div>
            
            <center> 
                { (mealData && planType === "Daily")  ? (
                                <Meal mealList={mealData} />
                            ) : (null)}

                { (mealData && planType === "Weekly")  ? (
                                <MealWeekly mealList={mealData} />
                            ) : (null)}
            </center>

            <div className="popup-container">
                <br></br>
                <div id="diet-popup" className="popup-text">
                    <h1>Diet Plan</h1><br></br>
                    
                    { showDietPlan ? (
                        <div className="dietplan">
                            <p>Based on your personalised profile, your goal is to <b>{userData.healthGoal}</b></p>
                            {currDetails.healthGoal !== "healthImprovement" && (
                                <p>As your goal is to {userData.healthGoal}, your daily calorie intake goal below is <b>{currDetails.healthGoal === "MuscleGain" ? "increased" : "decreased"}</b> by 500 calories</p>
                            )}
                            <p>To achieve this, we suggest concentrating on the following daily macronutrient intake in grams:</p>
                            
                            <div className="macronutrients">
                                <div>
                                    <p><b>Protein</b>: {Math.round(userData.protein)} grams ({Math.round(userData.protein * 4)} calories)</p>
                                    <p><b>Carbohydrates:</b> {Math.round(userData.carbs)} grams ({Math.round(userData.carbs * 4)} calories)</p>
                                </div>
                                <div>
                                    <p><b>Fat:</b> {Math.round(userData.fat)} grams ({Math.round(userData.fat * 9)} calories)</p>
                                    <p><b>Total Daily Calorie Intake:</b> {Math.round(userData.calories)} calories</p>
                                </div>
                            </div>

                            <p>With the above recommendations, please enter the maximum amount of macronutrients in grams that you would like for <b>one meal. </b> 
                                We will generate a diet plan with a list of recipes according to your input</p>
                            <div className="macroinput">
                                <div className="macro1">
                                    <input name="protein" type="text" onChange={handleDietInputChange} placeholder="Protein (grams)"/>
                                    <div className="macro-error">
                                        {dietError.protein !== null &&
                                            <div className="error-message">
                                                <span className="text-danger">{dietError.protein}</span>
                                            </div>
                                        }
                                    </div>

                                    <input name="carbs" type="text" onChange={handleDietInputChange} placeholder="Carbs (grams)"/>
                                    <div className="macro-error">
                                        {dietError.carbs !== null &&
                                            <div className="error-message">
                                                <span className="text-danger">{dietError.carbs}</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="macro2">
                                    <input name="fat" type="text" onChange={handleDietInputChange} placeholder="Fat (grams)"/>
                                    <div className="macro-error">
                                        {dietError.fat !== null &&
                                            <div className="error-message">
                                                <span className="text-danger">{dietError.fat}</span>
                                            </div>
                                        }
                                    </div>

                                    <input name="calories" type="text" onChange={handleDietInputChange} placeholder="Total calories"/>
                                    <div className="macro-error">
                                        {dietError.calories !== null &&
                                            <div className="error-message">
                                                <span className="text-danger">{dietError.calories}</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <Button className="dietbtn" onClick={saveDietData}>Generate Your Diet Plan</Button>
                        </div>

                    ) : (
                        <div className="dietplan">
                            <p>Create your personalised profile above to access your diet plan!</p>
                            <a href="#mealplan"><Button>Create Your Personalised Profile</Button></a>
                            <br></br>
                        </div>
                    )}
                </div>
            </div>
            <div className="mealBox"> 
                { (dietData !== null)  ? (
                    <DietMeal dietList={dietData} />
                ) : (null)}
            </div>
        </div>
    )
}

export default DietPlan;