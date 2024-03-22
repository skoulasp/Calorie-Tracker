class Storage {
    static getCalorieLimit(defaultLimit = 0) {
        let calorieLimit;
        if (localStorage.getItem("calorieLimit") === 0) {
            calorieLimit = defaultLimit;
        } else {
            calorieLimit = +localStorage.getItem("calorieLimit");
        }
        return calorieLimit;
    }

    static getCoffeeStain() {
        let coffeeStain;
        if (localStorage.getItem("coffeeStain") === "false") {
            coffeeStain = false;
        } else {
            coffeeStain = true;
        }

        return coffeeStain;
    }

    static setCoffeeStain(bool) {
        localStorage.setItem("coffeeStain", JSON.stringify(bool));
    }

    static setCalorieLimit(calorieLimit) {
        localStorage.setItem("calorieLimit", calorieLimit);
    }

    static setFullName(name = null) {
        if (name) {
            localStorage.setItem("fullName", name);
        } else {
            localStorage.removeItem("fullName");
        }
    }

    static getFullName() {
        const fullName = localStorage.getItem("fullName");
        return fullName;
    }

    static getTotalCalories(defaultCalories = 0) {
        let totalCalories;
        if (localStorage.getItem("totalCalories") === null) {
            totalCalories = defaultCalories;
        } else {
            totalCalories = +localStorage.getItem("totalCalories");
        }
        return totalCalories;
    }

    static updateTotalCalories(calories) {
        localStorage.setItem("totalCalories", calories);
    }

    static getMeals() {
        let meals;
        if (localStorage.getItem("meals") === null) {
            meals = [];
        } else {
            meals = JSON.parse(localStorage.getItem("meals"));
        }
        return meals;
    }

    static saveMeal(meal) {
        const meals = Storage.getMeals();
        const index = meals.findIndex((m) => m.id === meal.id);
        if (index !== -1) {
            meals[index] = meal;
        } else {
            meals.push(meal);
        }
        localStorage.setItem("meals", JSON.stringify(meals));
    }

    static removeMeal(id) {
        const meals = Storage.getMeals();
        meals.forEach((meal, index) => {
            if (meal.id === id) {
                meals.splice(index, 1);
            }
        });

        localStorage.setItem("meals", JSON.stringify(meals));
    }

    static getWorkouts() {
        let workouts;
        if (localStorage.getItem("workouts") === null) {
            workouts = [];
        } else {
            workouts = JSON.parse(localStorage.getItem("workouts"));
        }
        return workouts;
    }

    static saveWorkout(workout) {
        const workouts = Storage.getWorkouts();
        const index = workouts.findIndex((w) => w.id === workout.id);
        if (index !== -1) {
            workouts[index] = workout;
        } else {
            workouts.push(workout);
        }
        localStorage.setItem("workouts", JSON.stringify(workouts));
    }

    static removeWorkout(id) {
        const workouts = Storage.getWorkouts();
        workouts.forEach((workout, index) => {
            if (workout.id === id) {
                workouts.splice(index, 1);
            }
        });

        localStorage.setItem("workouts", JSON.stringify(workouts));
    }

    static setDate(date) {
        localStorage.setItem("date", JSON.stringify(date));
    }

    static getDate() {
        if (localStorage.getItem("date")) {
            return localStorage.getItem("date");
        } else {
            return false;
        }
    }
    static setForget24(bool) {
        localStorage.setItem("forget24", JSON.stringify(bool));
    }

    static getForget24() {
        let forget24;
        if (localStorage.getItem("forget24") === "true") {
            forget24 = true;
        } else {
            forget24 = false;
        }

        return forget24;
    }

    static enforceForget24() {
        const forget = Storage.getForget24();
        if (forget === "true") {
            Storage.clearAll();
        } else {
            return;
        }
    }

    static setFont(font) {
        localStorage.setItem("font", JSON.stringify(font));
    }

    static setOldSheet(sheet) {
        localStorage.setItem("oldSheet", JSON.stringify(sheet));
    }

    static getOldSheet() {
        const sheet = JSON.parse(localStorage.getItem("oldSheet"));
        return sheet !== null ? sheet : true;
    }

    static getFont() {
        let font = JSON.parse(localStorage.getItem("font"));
        if (font) {
            return font;
        } else {
            return;
        }
    }

    static setBG(bg) {
        localStorage.setItem("bg", JSON.stringify(bg));
    }

    static getBG() {
        let bg = JSON.parse(localStorage.getItem("bg"));
        if (bg) {
            return bg;
        } else {
            return;
        }
    }

    static setInkColor(color) {
        localStorage.setItem("inkColor", JSON.stringify(color));
    }

    static getInkColor() {
        let color = JSON.parse(localStorage.getItem("inkColor"));
        if (color) {
            return color;
        } else {
            return;
        }
    }

    static clearAll() {
        localStorage.removeItem("totalCalories");
        localStorage.removeItem("meals");
        localStorage.removeItem("workouts");
        localStorage.removeItem("calorieLimit");
        localStorage.removeItem("fullName");
        // localStorage.clear();
    }
}

export default Storage;
