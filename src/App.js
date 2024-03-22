import Storage from "./Storage";
import Settings from "./Settings";
import dateDisplay from "./DateDisplay";
import CalorieCalculator from "./CalorieCalculator";
import { Meal, Workout } from "./Item";
import "./sass/stylesheet.scss";

class App {
    constructor() {
        this.inputEntries = document.querySelectorAll("div.space.entry");
        this.mealHelperDiv = document.querySelectorAll(".before-meal-helper");
        this.workoutHelperDiv = document.querySelectorAll(".before-workout-helper");
        this.fullName = Storage.getFullName();
        this.fullNameInput = document.querySelector("input[name='name']");
        this.mealCandidate = {};
        this.workoutCandidate = {};
        this.meals = new Array(19);
        this.workouts = new Array(19);
        this.main = document.querySelector("main.main");
        this.wrapper = document.querySelector("main.main .wrapper");
        this.mealItems = document.querySelectorAll(".meal-item");
        this.mealInputs = document.querySelectorAll("textarea.meal-input");
        this.mealCalories = document.querySelectorAll('input[name="meal-calories"]');
        this.workoutItems = document.querySelectorAll(".workout-item");
        this.workoutInputs = document.querySelectorAll("textarea.workout-input");
        this.workoutCalories = document.querySelectorAll('input[name="workout-calories"]');
        this.calorieGoalInput = document.querySelector("input[name='calorie-goal']");
        this.numericInputs = document.querySelectorAll("input[type=number]");
        this.textualInputs = document.querySelectorAll("input[type=text]");
        this.textareaInputs = document.querySelectorAll("textarea");
        this.activateSettings = document.querySelector(".activate-settings");
        this.activateMobileSettings = document.querySelector(".activate-settings-mobile");
        this.coffeeStainCheckbox = document.querySelector(".settings-wrap.coffee-stain input");
        this.oldSheetCheckbox = document.querySelector(".settings-wrap.old-sheet input.sheet-is-old");
        this.oldSheetCheckbox.checked = Storage.getOldSheet();
        this.t24hrModeCheckboxInput = document.querySelector(".settings-wrap.t24hr-mode input");
        this.t24hrModeCheckboxInput.checked = Storage.getForget24();
        this.coffeeStainCheckbox.checked = Storage.getCoffeeStain();
        this.coffeeStainIMG = document.querySelector(".coffee-stain");
        this.calorieGoalInputVal = 0;
        this.calorieCalculator = new CalorieCalculator(this);
        this.hiddenSpan = document.createElement("span");
        this.setupHiddenSpan();
        this.#loadEventListeners();
        this.storageCheck();
        this.coffeeStainCheck();
        this.oldSheetCheck();
        this.toggleCalorieInput(this.mealInputs, this.mealCalories);
        this.toggleCalorieInput(this.workoutInputs, this.workoutCalories);
        this.#displayDate();
    }

    clearInputs() {
        for (let i = 0; i < this.mealInputs.length; i++) {
            this.mealInputs[i].value = "";
        }
        for (let i = 0; i < this.workoutInputs.length; i++) {
            this.workoutInputs[i].value = "";
        }
        for (let i = 0; i < this.mealCalories.length; i++) {
            this.mealCalories[i].value = "";
        }
        for (let i = 0; i < this.workoutCalories.length; i++) {
            this.workoutCalories[i].value = "";
        }
        this.calorieCalculator.instaClear();
    }

    storageCheck() {
        const meals = Storage.getMeals();
        const workouts = Storage.getWorkouts();

        if (meals) {
            meals.forEach((meal) => {
                this.meals[meal.id] = meal;
                this.mealInputs[meal.id].value = meal.name;
                this.mealInputs[meal.id].nextElementSibling.firstElementChild.value = meal.calories;
                this.mealInputs[meal.id].nextElementSibling.firstElementChild.disabled = false;
            });
            this.calorieCalculator.displayTotalMealCalories(this.meals, this.calorieGoalInputVal);
        }

        if (workouts) {
            workouts.forEach((workout) => {
                this.workouts[workout.id] = workout;
                this.workoutInputs[workout.id].value = workout.name;
                this.workoutInputs[workout.id].nextElementSibling.firstElementChild.value = workout.calories;
                this.workoutInputs[workout.id].nextElementSibling.firstElementChild.disabled = false;
            });
            this.calorieCalculator.displayTotalWorkoutCalories(this.workouts, this.calorieGoalInputVal);
        }
        this.calorieGoalInputVal = Storage.getCalorieLimit();

        if (this.calorieGoalInputVal > 0) {
            this.calorieGoalInput.value = this.calorieGoalInputVal;
            this.calorieCalculator.drawComparison(this.calorieGoalInputVal);
        }
        if (this.fullName) {
            this.fullNameInput.value = this.fullName;
        }
    }

    coffeeStainCheck() {
        if (this.coffeeStainCheckbox.checked) {
            this.coffeeStainIMG.style.visibility = "visible";
        } else {
            this.coffeeStainIMG.style.visibility = "hidden";
        }
    }

    oldSheetCheck() {
        if (this.oldSheetCheckbox.checked) {
            document.body.classList.remove("recent-sheet");
        } else {
            this.wrapper.style.transition = "none";
            setTimeout(() => {
                this.wrapper.style.removeProperty("transition");
            }, 400);

            document.body.classList.add("recent-sheet");
        }
    }

    #loadEventListeners() {
        this.textareaInputs.forEach((textarea) => {
            textarea.addEventListener("focus", (e) => {
                if (document.body.classList.contains("artistic") && e.target.matches("textarea")) {
                    e.target.previousElementSibling.style.zIndex = "4";
                    e.target.style.zIndex = "3";
                    e.target.previousElementSibling.classList.add("textarea-active");
                }
            });
        });

        this.textareaInputs.forEach((textarea) => {
            textarea.addEventListener("focusout", (e) => {
                if (document.body.classList.contains("artistic") && e.target.matches("textarea")) {
                    e.target.previousElementSibling.style.zIndex = "3";
                    e.target.style.zIndex = "2";
                    e.target.style.backgroundColor = "";
                    e.target.previousElementSibling.classList.remove("textarea-active");
                }
            });
        });

        this.mealItems.forEach((mealInput) => {
            mealInput.addEventListener("input", this.inputReader.bind(this));
            mealInput.addEventListener("keyup", this.deleteCheck.bind(this));
            mealInput.addEventListener("keydown", this.checkEnter.bind(this));
            mealInput.addEventListener("focusout", this.autoCreateMeal.bind(this));
        });

        this.inputEntries.forEach((entry) => {
            entry.addEventListener("click", (e) => {
                if (e.target.matches(".before-meal-helper")) {
                    e.target.nextElementSibling.focus();
                    e.target.nextElementSibling.style.zIndex = "4";
                    e.target.nextElementSibling.style.backgroundColor = "transparent";
                    e.target.style.zIndex = "3";
                    e.target.classList.add("textarea-active");
                }
                if (e.target.matches(".before-workout-helper")) {
                    e.target.classList.add("textarea-active");
                    e.target.nextElementSibling.focus();
                    e.target.nextElementSibling.style.zIndex = "4";
                    e.target.nextElementSibling.style.backgroundColor = "transparent";
                    e.target.style.zIndex = "3";
                }
            });
        });

        this.workoutItems.forEach((workoutInput) => {
            workoutInput.addEventListener("input", this.inputReader.bind(this));
            workoutInput.addEventListener("keyup", this.deleteCheck.bind(this));
            workoutInput.addEventListener("keydown", this.checkEnter.bind(this));
            workoutInput.addEventListener("focusout", this.autoCreateWorkout.bind(this));
        });

        this.calorieGoalInput.addEventListener("input", this.getCurrentCalorieGoal.bind(this));
        this.calorieGoalInput.addEventListener("keydown", this.updateCurrentCalorieGoal.bind(this));
        this.calorieGoalInput.addEventListener("focusout", this.updateCurrentCalorieGoal.bind(this));

        this.fullNameInput.addEventListener("keydown", this.saveFullName.bind(this));
        this.fullNameInput.addEventListener("focusout", this.saveFullName.bind(this));

        const toggleSettings = () => {
            this.main.classList.toggle("settings-activated");
            document.body.classList.toggle("settings-activated");
            const style = document.createElement("style");
            style.innerHTML = `
              body::before {
                animation: zoomOut 0.4s ease-in-out;
              }
            `;
            document.head.appendChild(style);
            setTimeout(function () {
                style.remove();
            }, 400);

            window.scrollTo({
                top: 0,
                behavior: "instant",
            });
        };

        this.activateSettings.addEventListener("click", toggleSettings);
        this.activateMobileSettings.addEventListener("click", toggleSettings);

        this.numericInputs.forEach((input) => {
            input.addEventListener("input", (event) => {
                let value = event.target.value;
                if (value.length > 5) {
                    value = value.slice(0, 5);
                    event.target.value = value;
                }
            });
        });

        for (let i = 0; i < this.textareaInputs.length; i++) {
            if (!this.textareaInputs[i].hasAttribute("maxlength")) {
                this.textareaInputs[i].setAttribute("maxlength", "32");
            }
        }

        document.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });
    }

    #displayDate() {
        dateDisplay.display();
    }

    saveFullName() {
        Storage.setFullName(this.fullNameInput.value);
    }

    setupHiddenSpan() {
        this.hiddenSpan.style.visibility = "hidden";
        this.hiddenSpan.style.fontFamily = getComputedStyle(this.textareaInputs[0]).fontFamily;
        this.hiddenSpan.style.position = "absolute";
        this.hiddenSpan.style.top = "-9999px";
        this.hiddenSpan.style.left = "-9999px";
        document.body.appendChild(this.hiddenSpan);
    }

    getCurrentCalorieGoal() {
        this.calorieGoalInputVal = this.calorieGoalInput.value;
        if (this.calorieGoalInputVal === 0) {
            this.calorieCalculator.drawComparison(this.calorieGoalInputVal);
        }
    }

    updateCurrentCalorieGoal() {
        this.calorieCalculator.drawComparison(this.calorieGoalInputVal);
        Storage.setCalorieLimit(this.calorieGoalInputVal);
    }

    inputReader(e) {
        if (e.target.matches(".meal-input")) {
            this.hiddenSpan.style.fontFamily = getComputedStyle(this.mealInputs[e.target.dataset.pos]).fontFamily;
            this.hiddenSpan.style.fontSize = getComputedStyle(this.mealInputs[e.target.dataset.pos]).fontSize;
            this.hiddenSpan.innerText = this.mealInputs[e.target.dataset.pos].value;
            if (this.hiddenSpan.offsetWidth >= 297 && this.hiddenSpan.offsetWidth <= 325) {
                this.mealInputs[e.target.dataset.pos].setAttribute("maxlength", `${this.hiddenSpan.textContent.length}`);
            } else {
                this.mealInputs[e.target.dataset.pos].setAttribute("maxlength", "32");
            }

            this.mealCandidate.id = e.target.dataset.pos;
            this.mealCandidate.name = e.target.value;
            this.mealCandidate.calories = +document.querySelectorAll(".meal-calories")[this.mealCandidate.id].value;

            if (this.meals[this.mealCandidate.id] && e.target.value === "") {
                e.target.nextElementSibling.firstElementChild.value = "";
                delete this.meals[this.mealCandidate.id];
                Storage.removeMeal(this.mealCandidate.id);
                this.calorieCalculator.displayTotalMealCalories(this.meals, this.calorieGoalInputVal);
            }
        } else if (e.target.matches(".meal-calories")) {
            this.mealCandidate.id = e.target.parentElement.parentElement.children[1].dataset.pos;
            this.mealCandidate.name = e.target.parentElement.parentElement.children[1].value;
            this.mealCandidate.calories = +e.target.value;
        } else if (e.target.matches(".workout-input")) {
            this.hiddenSpan.style.fontFamily = getComputedStyle(this.workoutInputs[e.target.dataset.pos]).fontFamily;
            this.hiddenSpan.style.fontSize = getComputedStyle(this.workoutInputs[e.target.dataset.pos]).fontSize;
            this.hiddenSpan.innerText = this.workoutInputs[e.target.dataset.pos].value;
            if (this.hiddenSpan.offsetWidth >= 297 && this.hiddenSpan.offsetWidth <= 325) {
                this.workoutInputs[e.target.dataset.pos].setAttribute("maxlength", `${this.hiddenSpan.textContent.length}`);
            } else {
                this.workoutInputs[e.target.dataset.pos].setAttribute("maxlength", "32");
            }

            this.workoutCandidate.id = e.target.dataset.pos;
            this.workoutCandidate.name = e.target.value;
            this.workoutCandidate.calories = +document.querySelectorAll(".workout-calories")[this.workoutCandidate.id].value;

            if (this.workouts[Number(this.workoutCandidate.id)] && e.target.value === "") {
                e.target.nextElementSibling.firstElementChild.value = "";
                delete this.workouts[this.workoutCandidate.id];
                Storage.removeWorkout(this.workoutCandidate.id);
                this.calorieCalculator.displayTotalWorkoutCalories(this.workouts, this.calorieGoalInputVal);
            }
        } else if (e.target.matches(".workout-calories")) {
            this.workoutCandidate.id = e.target.parentElement.parentElement.children[1].dataset.pos;
            this.workoutCandidate.name = e.target.parentElement.parentElement.children[1].value;
            this.workoutCandidate.calories = +e.target.value;
        } else {
            return;
        }
    }

    deleteCheck(e) {
        if (e.target.matches(".meal-input")) {
            if (this.meals[this.mealCandidate.id] && e.target.value === "") {
                e.target.nextElementSibling.firstElementChild.value = "";
                delete this.meals[this.mealCandidate.id];
                Storage.removeMeal(this.mealCandidate.id);
                this.calorieCalculator.displayTotalMealCalories(this.meals, this.calorieGoalInputVal);
            }
        }
        if (e.target.matches(".workout-input")) {
            if (this.workouts[this.workoutCandidate.id] && e.target.value === "") {
                e.target.nextElementSibling.firstElementChild.value = "";
                delete this.workouts[this.workoutCandidate.id];
                Storage.removeWorkout(this.workoutCandidate.id);
                this.calorieCalculator.displayTotalWorkoutCalories(this.workouts, this.calorieGoalInputVal);
            }
        }
    }

    checkEnter(e) {
        if (e.key !== "Enter") {
            return;
        }

        e.preventDefault();
        const target = e.target;

        if (target.matches(".meal-input, .meal-calories")) {
            if (target.matches(".meal-input")) {
                const nextElement = target.nextElementSibling.firstElementChild;
                nextElement.focus();
            }

            if (this.mealCandidate.id && this.mealCandidate.name && this.mealCandidate.calories) {
                this.meals[this.mealCandidate.id] = new Meal(...Object.values(this.mealCandidate));
                Storage.saveMeal(this.meals[this.mealCandidate.id]);
                this.mealCandidate.id = this.mealCandidate.name = this.mealCandidate.calories = null;
                this.calorieCalculator.displayTotalMealCalories(this.meals, this.calorieGoalInputVal);
                if (
                    target.matches(".meal-calories") &&
                    target.parentElement.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.classList.contains(
                        "entry"
                    )
                ) {
                    target.parentElement.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.children[1].firstElementChild.children[1].focus();
                } else {
                    this.workoutInputs[0].focus();
                }
            }
        } else if (target.matches(".workout-input, .workout-calories")) {
            if (target.matches(".workout-input")) {
                const nextElement = target.nextElementSibling.firstElementChild;
                nextElement.focus();
            }

            if (this.workoutCandidate.id && this.workoutCandidate.name && this.workoutCandidate.calories) {
                this.workouts[this.workoutCandidate.id] = new Workout(...Object.values(this.workoutCandidate));
                Storage.saveWorkout(this.workouts[this.workoutCandidate.id]);
                this.workoutCandidate.id = this.workoutCandidate.name = this.workoutCandidate.calories = null;
                this.calorieCalculator.displayTotalWorkoutCalories(this.workouts, this.calorieGoalInputVal);
                if (
                    target.matches(".workout-calories") &&
                    target.parentElement.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.classList.contains(
                        "entry"
                    )
                ) {
                    target.parentElement.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.children[1].children[1].children[1].focus();
                }
            }
        }
    }

    autoCreateMeal(e) {
        if (this.mealCandidate.id && this.mealCandidate.name && this.mealCandidate.calories) {
            if (e.target.matches(".meal-calories")) {
                this.meals[this.mealCandidate.id] = new Meal(...Object.values(this.mealCandidate));
                Storage.saveMeal(this.meals[this.mealCandidate.id]);
                this.calorieCalculator.displayTotalMealCalories(this.meals, this.calorieGoalInputVal);
            } else if (e.target.matches(".meal-input")) {
                if (this.meals[this.mealCandidate.id] && this.mealCandidate.name !== this.meals[this.mealCandidate.id].name) {
                    this.meals[this.mealCandidate.id] = new Meal(...Object.values(this.mealCandidate));
                    Storage.saveMeal(this.meals[this.mealCandidate.id]);
                }
            }
        } else {
            return;
        }
    }

    autoCreateWorkout(e) {
        if (this.workoutCandidate.id && this.workoutCandidate.name && this.workoutCandidate.calories) {
            if (e.target.matches(".workout-calories")) {
                this.workouts[this.workoutCandidate.id] = new Workout(...Object.values(this.workoutCandidate));
                Storage.saveWorkout(this.workouts[this.workoutCandidate.id]);
                this.calorieCalculator.displayTotalWorkoutCalories(this.workouts, this.calorieGoalInputVal);
            } else if (e.target.matches(".workout-input")) {
                if (
                    this.workouts[this.workoutCandidate.id] &&
                    this.workoutCandidate.name !== this.workouts[this.workoutCandidate.id].name
                ) {
                    this.workouts[this.workoutCandidate.id] = new Workout(...Object.values(this.workoutCandidate));
                    Storage.saveWorkout(this.workouts[this.workoutCandidate.id]);
                }
            }
        } else {
            return;
        }
    }

    toggleCalorieInput(inputEls, calorieEls) {
        inputEls.forEach((inputEl, i) => {
            inputEl.addEventListener("input", function () {
                if (inputEl.value.trim() !== "") {
                    calorieEls[i].disabled = false;
                } else {
                    calorieEls[i].disabled = true;
                }
            });
        });
    }
}

const app = new App();

export default app;
