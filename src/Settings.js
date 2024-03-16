import Storage from "./Storage";
import app from "./App";
import CalorieCalculator from "./CalorieCalculator";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

class Settings {
    constructor() {
        throw new Error("Cannot instantiate a singleton class");
    }

    static radioBtn = document.querySelector(".settings-wrap.radio-btn");
    static radioBG = document.querySelector(".settings-wrap.bg-select");
    static radioInkBlack = document.querySelector(".settings-wrap.ink-color .black-ink-color");
    static radioInkBlue = document.querySelector(".settings-wrap.ink-color .blue-ink-color");
    static saveToPDFBtn = document.querySelector(".save-pdf-btn");
    static clearAllInputsBtn = document.querySelector(".clear-all-btn");
    static RestoreSettingsBtn = document.querySelector(".restore-btn");
    static aside = document.querySelector("aside.sidebar");
    static t24hrModeCheckbox = document.querySelector(".settings-wrap.t24hr-mode");
    static t24hrModeCheckboxInput = document.querySelector(".settings-wrap.t24hr-mode input");
    static coffeeStain = document.querySelector(".settings-wrap.coffee-stain");
    static coffeeStainInput = document.querySelector(".settings-wrap.coffee-stain input.coffee-stain-input");
    static oldSheet = document.querySelector(".settings-wrap.old-sheet");
    static oldSheetInput = document.querySelector(".settings-wrap.old-sheet input.sheet-is-old");
    static radioUgly = document.querySelector(".radio-btn .ugly-default");
    static radioAwful = document.querySelector(".radio-btn .awful");
    static radioReadable = document.querySelector(".radio-btn .readable");
    static radioArtistic = document.querySelector(".radio-btn .artistic");
    static radioInk = document.querySelector(".radio-btn.ink-color");
    static BGRadioDefault = document.querySelector(".bg-select .default");
    static BGRadioAlternative1 = document.querySelector(".bg-select .alternative1");
    static BGRadioAlternative2 = document.querySelector(".bg-select .alternative2");
    static btnGroup = document.querySelector(".button-group");
    static modalTxt = document.querySelector("span.loading-txt");
    static loadingSpinner = document.querySelector(".simple-spinner");
    static handWrittingStyle = Storage.getFont();
    static handWrittingStyle = Storage.getFont();
    static BG = Storage.getBG();
    static inkColor = Storage.getInkColor();
    static sidebar = document.querySelector("aside.sidebar");
    static modal = document.querySelector(".modal");
    static modalContent = document.querySelector(".modal-content");
    static modalBackdrop = document.querySelector(".modal-backdrop");
    static modalChild = document.querySelector(".modal .modal-content");
    static modalUIParent = document.querySelector(".modal .ui-parent");
    static bodyEl = document.querySelector("body");
    static pseudo = "::before";

    static isPseudoElementBGImageLoaded(element, pseudoElement) {
        return new Promise(function (resolve, reject) {
            const img = new Image();
            let isResolved = false;

            const timeoutId = setTimeout(function () {
                if (!isResolved) {
                    reject(new Error("Timeout: Promise took too long to fulfill."));
                }
            }, 30000);

            img.onload = function () {
                clearTimeout(timeoutId);
                isResolved = true;
                resolve();
            };

            img.onerror = function () {
                clearTimeout(timeoutId);
                isResolved = true;
                reject(new Error("Image load error."));
            };

            const computedStyle = getComputedStyle(element, pseudoElement);
            const backgroundImage = computedStyle.getPropertyValue("background-image");
            const backgroundImageUrl = backgroundImage.replace(/^url\(['"]?/, "").replace(/['"]?\)$/, "");
            img.src = backgroundImageUrl;
        });
    }

    static loadEventListeners() {
        document.addEventListener("DOMContentLoaded", () => {
            Settings.sidebar.style.transition = "all 0.8s";
            Settings.isPseudoElementBGImageLoaded(Settings.bodyEl, Settings.pseudo)
                .then(function () {
                    Settings.revertModal();
                })
                .catch(function (error) {
                    console.log("Error loading background image of pseudo-element!");
                    Settings.errorCall(error);
                });
        });

        document.body.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-reload")) {
                window.location.reload();
            }
            if (e.target.classList.contains("btn-continue")) {
                Settings.revertModal();
            }
        });

        Settings.radioBtn.addEventListener("change", (e) => {
            if (e.target.type === "radio") {
                Settings.handWrittingStyle = e.target.value;
                console.log(Settings.handWrittingStyle);
                Settings.applyFontConfig(Settings.handWrittingStyle);
                Storage.setFont(Settings.handWrittingStyle);
            }
        });

        Settings.radioBG.addEventListener("change", (e) => {
            if (e.target.type === "radio") {
                Settings.BG = e.target.value;
                Settings.applyBG(Settings.BG);
                Settings.modal.style.display = "block";
                Settings.modalBackdrop.style.display = "block";
                Settings.modal.style.cursor = "wait";
                Settings.modalBackdrop.style.cursor = "wait";
                Settings.isPseudoElementBGImageLoaded(Settings.bodyEl, Settings.pseudo)
                    .then(function () {
                        Settings.revertModal();
                    })
                    .catch(function (error) {
                        Settings.errorCall(error);
                    });
            }
        });

        Settings.radioInk.addEventListener("change", (e) => {
            if (e.target.type === "radio") {
                Settings.inkColor = e.target.value;
                Storage.setInkColor(Settings.inkColor);
                if (Settings.inkColor === "black") {
                    document.body.classList.add("ink-blk");
                    // Settings.radioInkBlack.checked;
                } else {
                    document.body.classList.remove("ink-blk");
                    // Settings.radioInkBlue.checked;
                }
            }
        });

        Settings.t24hrModeCheckbox.addEventListener("change", (e) => {
            if (e.target.type === "checkbox") {
                if (e.target.checked) {
                    Storage.setForget24(true);
                } else {
                    Storage.setForget24(false);
                }
            }
        });

        Settings.coffeeStain.addEventListener("change", (e) => {
            if (e.target.type === "checkbox") {
                if (e.target.checked) {
                    Storage.setCoffeeStain(true);
                    app.coffeeStainCheck();
                } else {
                    Storage.setCoffeeStain(false);
                    app.coffeeStainCheck();
                }
            }
        });

        Settings.oldSheet.addEventListener("change", (e) => {
            if (e.target.type === "checkbox") {
                if (e.target.checked) {
                    Storage.setOldSheet(true);
                    app.oldSheetCheck();
                } else {
                    Storage.setOldSheet(false);
                    app.oldSheetCheck();
                }
            }
        });

        Settings.aside.addEventListener("click", (e) => {
            if (e.target === Settings.clearAllInputsBtn) {
                Storage.clearAll();
                app.clearInputs();
                Settings.clearAllInputsBtn.style.animation = "fadeOutClear 12s";
                // Settings.clearAllInputsBtn.classList.add("activated");
            }

            if (e.target === Settings.saveToPDFBtn) {
                // Settings.saveToPDFBtn.classList.add("activated");
                Settings.saveToPDFBtn.style.animation = "fadeOutSave 12s";
                Settings.generatePDF(this.generateCalorieSummaryPDF(app.calorieCalculator.organizePDFData()));
            }

            if (e.target === Settings.RestoreSettingsBtn) {
                Settings.restoreSettings();
                Settings.RestoreSettingsBtn.style.animation = "fadeOutRestore 12s";
            }
        });

        document.addEventListener("animationend", (e) => {
            if (e.animationName) {
                e.target.style.animation = "";
            }
        });
    }

    static getStoredSettings() {
        Storage.getSettings();
    }

    static loadStoredFont() {
        if (Settings.handWrittingStyle) {
            Settings.applyFontConfig(Settings.handWrittingStyle);
        } else {
            Settings.radioUgly.checked = true;
            const e = new Event("change");
            Settings.radioUgly.dispatchEvent(e);
        }
    }

    static applyFontConfig(fontOption) {
        if (fontOption === "Ugly") {
            Settings.radioUgly.checked = true;
            document.body.style.fontFamily = "ashcanbb, serif";
            document.body.classList.remove("awful", "readable", "artistic");
            document.body.style.fontWeight = "";
        }
        if (fontOption === "Awful") {
            Settings.radioAwful.checked = true;
            document.body.style.fontFamily = "Long Cang, serif";
            document.body.classList.add("awful");
            document.body.classList.remove("readable", "artistic");
        }
        if (fontOption === "Readable") {
            Settings.radioReadable.checked = true;
            document.body.style.fontFamily = "Neucha, serif";
            document.body.classList.add("readable");
            document.body.classList.remove("awful", "artistic");
        }
        if (fontOption === "Artistic") {
            Settings.radioArtistic.checked = true;
            document.body.style.fontFamily = "Satisfy, serif";
            document.body.classList.add("artistic");
            document.body.classList.remove("awful", "readable");
        }
    }

    static applyBG(bg) {
        if (bg === "Default") {
            Settings.BGRadioDefault.checked = true;
            document.body.classList.remove("alt1", "alt2");
            Storage.setBG(bg);
        }
        if (bg === "Alternative1") {
            Settings.BGRadioAlternative1.checked = true;
            document.body.classList.remove("alt2");
            document.body.classList.add("alt1");
            Storage.setBG(bg);
        }
        if (bg === "Alternative2") {
            Settings.BGRadioAlternative2.checked = true;
            document.body.classList.remove("alt1");
            document.body.classList.add("alt2");
            Storage.setBG(bg);
        }
    }

    static checkInkColor() {
        if (Settings.inkColor !== null && Settings.inkColor === "black") {
            document.body.classList.add("ink-blk");
            Settings.radioInkBlack.checked = true;
        } else {
            Settings.radioInkBlue.checked = true;
        }
    }

    static init() {
        Settings.sidebar.style.transition = "none";
        Settings.modal.style.display = "block";
        Settings.modalBackdrop.style.display = "block";
        Settings.modal.style.cursor = "wait";
        Settings.modalBackdrop.style.cursor = "wait";
        Settings.checkInkColor();
        Settings.loadEventListeners();
        Settings.loadStoredFont();
        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        if (Settings.BG) {
            Settings.applyBG(Settings.BG);
        }
    }

    static generatePDF(data) {
        var content = [
            data,
            // Include additional content as needed
        ];

        // Define the PDF document definition
        var docDefinition = {
            content: content,
            // Include additional document properties and styling options as needed
        };

        // Generate the PDF document
        pdfMake.createPdf(data).download("calories.pdf");
    }

    static generateCalorieSummaryPDF(data) {
        const docDefinition = {
            content: [
                { text: "My Daily Calorie Summary", style: "header" },
                "\n",
                { text: data.fullName, style: "boldText" },
                { text: data.date, style: "subheader" },
                "\n",

                { text: ["My Calorie Limit: ", { text: `${data.calorieLimit}`, style: "boldText" }] },

                "\n\n",
                { text: "My Meals", style: "boldText" }, // Update this line
                "\n",
                {
                    ul: data.meals.map((meal) => `${meal.name} | ${meal.calories}cal`),
                },
                "\n",
                { text: ["Total Meal Calories: ", { text: data.totalMealCalorieCount, style: "boldText" }] },
                "\n\n",
                { text: "My Workouts", style: "boldText" }, // Update this line
                "\n",
                {
                    ul: data.workouts.map((workout) => `${workout.name} | ${workout.calories}cal`),
                },
                "\n",
                { text: ["Total Workout Calories: ", { text: data.totalWorkoutCalorieCount, style: "boldText" }] },
                "\n\n",

                ,
                {
                    text: `Total Calories = ${data.totalMealCalorieCount} - ${data.totalWorkoutCalorieCount} ${data.totalSumOfCalories}`,
                    style: "boldText",
                },
            ],
            styles: {
                header: { fontSize: 18, bold: true },
                subheader: { fontSize: 14, italics: true },
                boldText: { bold: true },
            },
        };

        return docDefinition;
    }

    static restoreSettings() {
        if (Settings.t24hrModeCheckboxInput.checked) {
            Settings.t24hrModeCheckboxInput.checked = false;
            Storage.setForget24(false);
        }

        if (Settings.coffeeStainInput.checked === false) {
            Settings.coffeeStainInput.checked = true;
            Storage.setCoffeeStain(true);
            app.coffeeStainCheck();
        }

        if (Settings.oldSheetInput.checked === false) {
            Settings.oldSheetInput.checked = true;
            Storage.setOldSheet(true);
            app.oldSheetCheck();
        }

        if (Settings.BG !== "Default") {
            Settings.BG = "Default";
            Settings.applyBG(Settings.BG);
            Settings.modal.style.display = "block";
            Settings.modalBackdrop.style.display = "block";
            Settings.modal.style.cursor = "wait";
            Settings.isPseudoElementBGImageLoaded(Settings.bodyEl, Settings.pseudo)
                .then(function () {
                    Settings.revertModal();
                })
                .catch(function (error) {
                    Settings.errorCall(error);
                });

            Storage.setBG(Settings.BG);
        }

        if (Settings.inkColor === "black") {
            document.body.classList.remove("ink-blk");
            Settings.radioInkBlue.checked = true;
        }

        Settings.BG = "Default";
        Settings.handWrittingStyle = "Ugly";
        Settings.radioUgly.checked = true;
        Storage.setFont(Settings.handWrittingStyle);
        Settings.applyFontConfig(Settings.handWrittingStyle);
    }

    static errorCall(error = null) {
        Settings.btnGroup.style.display = "flex";
        Settings.modalTxt.textContent = "Loading Failed!";
        if (error) {
            console.log(error);
            const errorMsg = document.createElement("span");
            errorMsg.classList.add("errorMsg");
            errorMsg.textContent = error;
            Settings.modalTxt.insertAdjacentElement("afterend", errorMsg);
        }
        Settings.loadingSpinner.style.display = "none";
        Settings.modal.style.cursor = "default";
        Settings.modalBackdrop.style.cursor = "default";
        Settings.modalBackdrop.style.cursor = "default";
        const div = document.createElement("div");
        div.classList.add("ui-error");
        div.innerHTML = `
        <svg  viewBox="0 0 87 87" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Group-2" transform="translate(2.000000, 2.000000)">
                    <circle id="Oval-2" stroke="rgba(252, 191, 191, .5)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle>
                    <circle  class="ui-error-circle" stroke="#F74444" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle>
                        <path class="ui-error-line1" d="M22.244224,22 L60.4279902,60.1837662" id="Line" stroke="#F74444" stroke-width="3" stroke-linecap="square"></path>
                        <path class="ui-error-line2" d="M60.755776,21 L23.244224,59.8443492" id="Line" stroke="#F74444" stroke-width="3" stroke-linecap="square"></path>
                </g>
        </g>
</svg>
        `;
        Settings.modalUIParent.appendChild(div);
    }

    static revertModal() {
        Settings.modal.style.display = "none";
        Settings.modalBackdrop.style.display = "none";
    }
}

Settings.init();

export default Settings;
