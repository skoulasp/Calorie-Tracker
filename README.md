# Calorie Tracker App

This unique calorie tracker app offers a visually appealing experience reminiscent of a real notebook paper placed on a wooden table. With handwriting fonts and intricate design details, it creates a lifelike representation of a handwritten calorie summary.

## Features

-   **Meal and Workout Tracking**: The app features two columns for tracking meals eaten and workouts completed, along with their corresponding calorie counts.

-   **Real-time Calculation**: Near the end of the sheet, the app automatically calculates the total sum of meal calories minus the total sum of workout calories burned, providing the user with the final calorie result for the day.

-   **Personalization**: Users have the option to input their name and set a calorie upper threshold goal for the day.

-   **Calorie Threshold Notification**: If the user sets a calorie threshold goal, the app notifies whether the goal was exceeded or not.

-   **Local Storage**: All user-entered data is saved to local storage, ensuring data persistence across sessions.

-   **Settings Section**: Users can access a settings section by clicking on a cog icon, which triggers a 180-degree animation revealing a list of customizable options.
    -   **Handwriting Style**: Choose from four different handwriting styles: "Ugly (default)", "Awful", "Readable", and "Artistic".
    -   **Save to PDF**: Save the daily calorie summary to a PDF file for download.
    -   **Clear All Data**: Delete all saved data from local storage.
    -   **Restore Settings**: Restore all settings to their default options.
    -   **24hr Forget Mode**: Automatically forget saved data when the day changes.
    -   **Coffee Stain**: Toggle the decorative coffee stain on the paper.
    -   **Sheet Age Aesthetic**: Toggle an option for the paper to appear at least 10 years old.
    -   **Ink Color**: Choose between default blue text color or black.
    -   **Background Image**: Select from three different wooden table backgrounds.

## Technologies Used

-   HTML: Markup language for creating the structure of the calorie tracker.
-   Sass (CSS preprocessor): Styling language used to design the aesthetic appearance of the app.
-   Vanilla JavaScript: Programming language for adding interactivity and functionality.
-   Webpack: Project bundler for managing dependencies and building the project.

## Demo

You can use the Calorie Tracker [here](https://skoulasp.github.io/Calorie-Tracker/).

## Screenshots

**Main view** ![Screenshot 1](https://i.imgur.com/jlJBHvV.jpeg)

**Settings Page** ![Screenshot 2](https://i.imgur.com/Q63y65t.jpeg)

## Installation

To install and run the project locally:

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/skoulasp/Calorie-Tracker.git
    ```

2. Navigate to the project directory:

    ```bash
    cd calorie-tracker
    ```

3. Install dependencies using npm:=

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm start
    ```

5. Open the project in your web browser at http://localhost:3000.

These instructions provide step-by-step guidance on how to install and run the project locally.

## Credits

This project was created by Petros Skoulas. For any inquiries or feedback, feel free to reach out!

## License

This project is licensed under the [MIT License](LICENSE.md).
