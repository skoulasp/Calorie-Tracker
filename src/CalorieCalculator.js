import Storage from "./Storage";
import app from "./App";
import dateDisplay from "./DateDisplay";

class CalorieCalculator {
    constructor() {
        this.calorieLimit = document.querySelector(".calorie-input");
        this.totalMealCalorieCount = document.querySelector(".total-meal-calorie-count");
        this.totalWorkoutCalorieCount = document.querySelector(".total-workout-calorie-count");
        this.totalSumOfCalories = document.querySelector(".total-calorie-count");
        this.totalMealCalorieHighlight = document.querySelector(".meal-total-title");
        this.totalWorkoutCalorieHighlight = document.querySelector(".workout-total-title");
        this.totalMealCalorieHighlightVal = document.querySelector(".meal-total-value");
        this.totalWorkoutCalorieHighlightVal = document.querySelector(".workout-total-value");
        this.grandTotal = document.querySelector(".grand-total-text");
        this.meals = Storage.getMeals();
        this.workouts = Storage.getWorkouts();
        this.total = 0;
    }

    organizePDFData() {
        return {
            fullName: app.fullNameInput.value || "Anonymous",
            date: dateDisplay.currentDate,
            fullName: app.fullNameInput.value,
            calorieLimit: this.calorieLimit.value || "none",
            totalSumOfCalories: this.totalSumOfCalories.textContent,
            totalMealCalorieCount: this.totalMealCalorieCount.textContent,
            totalWorkoutCalorieCount: this.totalWorkoutCalorieCount.textContent.replace("-", "").trim(),
            meals: app.meals,
            workouts: app.workouts,
        };
    }

    displayTotalMealCalories(meals, calorieGoal) {
        this.meals = meals = meals.reduce((acc, meal) => acc + meal.calories, 0);
        this.totalMealCalorieCount.textContent = `${this.meals}cal`;
        if (this.meals > 0) {
            this.totalMealCalorieCount.textContent = `${this.meals}cal`;
            this.totalMealCalorieHighlight.textContent = "Total Meal Calories";
            this.totalMealCalorieHighlightVal.textContent = `${this.meals}cal`;
        } else {
            this.totalMealCalorieCount.textContent = "";
            this.totalMealCalorieHighlight.textContent = "";
            this.totalMealCalorieHighlightVal.textContent = "";
        }

        this.displayTotalSumOfCalories(calorieGoal);
    }

    displayTotalWorkoutCalories(workouts, calorieGoal) {
        this.workouts = workouts.reduce((acc, workout) => acc + workout.calories, 0);
        this.totalWorkoutCalorieCount.textContent = this.workouts > 0 ? ` - ${this.workouts}cal` : "";
        if (this.workouts > 0) {
            this.totalWorkoutCalorieCount.textContent = ` - ${this.workouts}cal`;
            this.totalWorkoutCalorieHighlight.textContent = "Total Workout Calories";
            this.totalWorkoutCalorieHighlightVal.textContent = `${this.workouts}cal`;
        } else {
            this.totalWorkoutCalorieCount.textContent = "";
            this.totalWorkoutCalorieHighlight.textContent = "";
            this.totalWorkoutCalorieHighlightVal.textContent = "";
        }
        this.displayTotalSumOfCalories(calorieGoal);
    }

    displayTotalSumOfCalories(calorieGoal) {
        if (this.meals > 0 || this.workouts > 0) {
            this.grandTotal.textContent = "Grand Total: ";
            if (this.meals > 0 && this.workouts > 0) {
                this.totalSumOfCalories.textContent = ` = ${this.meals - this.workouts}cal`;
                this.drawComparison(calorieGoal);
            }
            if (this.meals > 0) {
                this.drawComparison(calorieGoal);
            }
        } else {
            this.grandTotal.textContent = "";
            this.totalMealCalorieCount.textContent = "";
            this.totalWorkoutCalorieCount.textContent = "";
            this.totalSumOfCalories.textContent = "";
            this.totalMealCalorieHighlight.textContent = "";
            this.totalWorkoutCalorieHighlight.textContent = "";
        }
        if ((this.meals > 0 && !(this.workouts > 0)) || (this.workouts > 0 && !(this.meals > 0))) {
            this.totalSumOfCalories.textContent = "";
            this.drawComparison(calorieGoal);
        }
    }

    drawComparison(calorieGoal) {
        const sum = this.meals - this.workouts;
        if (calorieGoal > 0 && sum > 0) {
            if (this.meals > 0 && this.workouts > 0) {
                if (calorieGoal > sum) {
                    this.totalSumOfCalories.innerHTML = ` = ${
                        this.meals - this.workouts
                    }cal <span class="calorie-goal-comparison-green">&lt; My cal. limit (${calorieGoal})</span>`;
                } else if (calorieGoal < sum) {
                    this.totalSumOfCalories.innerHTML = ` = ${
                        this.meals - this.workouts
                    }cal <span class="calorie-goal-comparison-red">&gt; My cal. limit (${calorieGoal})</span>`;
                } else {
                    this.totalSumOfCalories.innerHTML = ` = ${
                        this.meals - this.workouts
                    }cal <span class="calorie-goal-comparison-black">= My cal. limit (${calorieGoal})</span>`;
                }
            } else if (this.meals > 0 && this.workouts === 0) {
                if (calorieGoal > sum) {
                    this.totalSumOfCalories.innerHTML = `<span class="calorie-goal-comparison-green">&lt; My cal. limit (${calorieGoal})</span>`;
                } else if (calorieGoal < sum) {
                    this.totalSumOfCalories.innerHTML = `<span class="calorie-goal-comparison-red">&gt; My cal. limit (${calorieGoal})</span>`;
                } else {
                    this.totalSumOfCalories.innerHTML = `<span class="calorie-goal-comparison-black">= My cal. limit (${calorieGoal})</span>`;
                }
            }
        }
        if (!(calorieGoal > 0)) {
            if (this.meals > 0 && this.workouts > 0) {
                this.totalSumOfCalories.textContent = ` = ${this.meals - this.workouts}cal`;
            } else {
                this.totalSumOfCalories.textContent = "";
            }
        }
    }

    instaClear() {
        this.totalMealCalorieCount.textContent = "";
        this.totalWorkoutCalorieCount.textContent = "";
        this.totalSumOfCalories.textContent = "";
        this.totalSumOfCalories.innerHTML = "";
        this.totalMealCalorieHighlight.textContent = "";
        this.totalWorkoutCalorieHighlight.textContent = "";
        this.totalMealCalorieHighlightVal.textContent = "";
        this.totalWorkoutCalorieHighlightVal.textContent = "";
        this.grandTotal.textContent = "";
        this.meals = null;
        this.workouts = null;
        app.meals = new Array(19);
        app.workouts = new Array(19);
        app.fullNameInput.value = "";
        app.calorieGoalInput.value = "";
    }
}

export default CalorieCalculator;
