const DIET_KEY = "myDiet";

// Initialise local storage "weeklySpecials" with data. 
function initDiet() {

    var myDiet = [
        {
            id: 0,
            age: null,
            weight: null,
            height: null,
            activityLevel: null,
            dietPreferences: null,
            healthGoal: null // options are Weight Loss, Muscle Gain, Overall Health Improvement
        }
    ];

    // Set data into local storage.
    localStorage.setItem(DIET_KEY, JSON.stringify(myDiet));
}

// Pull cart items from localStorage
function getDiet() {
    const data = localStorage.getItem(DIET_KEY);
    return JSON.parse(data);
}

function updateDiet(updatedDetails) {
    var userData = getDiet()
    // ID is always 0 
    const userIndex = userData.findIndex(user => user.id === 0);
    userData[userIndex] = updatedDetails;

        // saves changes back into local storage
        localStorage.setItem(DIET_KEY, JSON.stringify(userData));
}

function resetDiet() {
    var userData = getDiet()
    
    var defaultValues = 
        {
            id: 0,
            age: null,
            weight: null,
            height: null,
            activityLevel: null,
            dietPreferences: null,
            healthGoal: null // options are Weight Loss, Muscle Gain, Overall Health Improvement
        }
    
        const userIndex = userData.findIndex(user => user.id === 0);
        userData[userIndex] = defaultValues;
    localStorage.setItem(DIET_KEY, JSON.stringify(userData));
}

// errors for meal plan
function getValidationError(age, weight, height, sex, activityLevel, dietPreferences, healthGoal, timeFrame) {
    var ageError = null;
    var weightError = null;
    var heightError = null;
    var sexError = null;
    var activityLevelError = null;
    var dietPreferencesError = null;
    var healthGoalError = null;
    var timeFrameError = null;

    // Check that all fields are filled in 
    if (!age) {
        ageError = 'Age is required';
    } else if (age) { // Ensure age is a valid input
        if ((age < 1) || (age > 120)) {
            ageError = 'This age value is invalid. Please try again';
        }
        if (!/^\d+$/.test(age)) {
            ageError = 'Age field must only contain digits'
        }
    }

    if (!weight) {
        weightError = 'Weight is required';
    } else if (!/^\d+$/.test(weight)) { 
        weightError = 'Weight field must only contain digits'
    }

    if (!height) {
        heightError = 'Height is required';
    } else if (!/^\d+$/.test(height)) {
        heightError = 'Height field must only contain digits'
    }

    if (!sex) {
        sexError = 'Please select an option';
    }

    if (!activityLevel) {
        activityLevelError = 'Please select an option';
    }
    
    if (!dietPreferences) {
        dietPreferencesError = 'Please select an option';
    }

    if (!healthGoal) {
        healthGoalError = 'Please select an option';
    }

    if (!timeFrame) {
        timeFrameError = 'Please select an option';
    }

    
    return { age: ageError, weight: weightError, height: heightError, sex: sexError, activityLevel: activityLevelError, dietPreferences: dietPreferencesError, healthGoal: healthGoalError, timeFrame: timeFrameError}
}

// errors for diet plan
function getDietError(protein, fat, carbs, calories) {
    var proteinError = null;
    var fatError = null;
    var carbError = null;
    var calorieError = null;

    if (!protein) {
        proteinError = "Protein is required"
    } else if (!/^\d+$/.test(protein)) {
        proteinError = 'Protein field must only contain digits'
    } else if (protein > 100 || protein < 0) {
        proteinError = "Protein number must be between 0 - 100"
    }

    if (!fat) {
        fatError = "Fat is required"
    } else if (!/^\d+$/.test(fat)) {
        fatError = 'Fat field must only contain digits'
    } else if (fat > 100 || fat < 0) {
        fatError = "Fat number must be between 0 - 100"
    }

    if (!carbs) {
        carbError = "Carbs are required"
    } else if (!/^\d+$/.test(carbs)) {
        carbError = 'Carbs field must only contain digits'
    } else if (carbs > 100 || carbs < 0) {
        carbError = "Carbs number must be between 0 - 100"
    }

    if (!calories) {
        calorieError = "Calories are required"
    } else if (!/^\d+$/.test(calories)) {
        calorieError = 'Calories field must only contain digits'
    } else if (calories > 800 || calories < 0) {
        calorieError = "Calories number must be between 0 - 800"
    }

    return { protein: proteinError, fat: fatError, carbs: carbError, calories: calorieError }
}

export {
    initDiet,
    getDiet,
    updateDiet,
    resetDiet,
    getValidationError,
    getDietError
}