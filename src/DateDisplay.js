import Storage from "./Storage";

class DateDisplay {
    constructor(selector) {
        this.selector = selector;
        this.today = new Date();
        this.day = String(this.today.getDate()).padStart(2, "0");
        this.month = String(this.today.getMonth() + 1).padStart(2, "0");
        this.year = this.today.getFullYear();
        this.currentDate = `${this.day}/${this.month}/${this.year}`;
        this.temp = Storage.getDate();
        Storage.setDate(this.currentDate);
        if (this.temp !== this.currentDate.toString()) {
            Storage.enforceForget24();
        }
    }
    display() {
        document.querySelector(this.selector).textContent = this.currentDate;
    }
}
const dateDisplay = new DateDisplay(".date");

export default dateDisplay;
