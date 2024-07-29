import '../scss/style.scss';
import { FileController } from '../../../Controllers/File.controller'

const form = document.querySelector("form") as HTMLFormElement;
const input = document.querySelector("#file-input") as HTMLInputElement;
const tableContainer = document.querySelector(".table-container") as HTMLElement;
const nextButton = document.querySelector("#next-button") as HTMLButtonElement;
const backButton = document.querySelector("#back-button") as HTMLButtonElement;
const searchInput = document.querySelector("#search-input") as HTMLInputElement;
const chart = document.querySelector("#chart") as HTMLCanvasElement;
const csvButton = document.querySelector("#csv-button") as HTMLButtonElement;
const newFileButton = document.querySelector("#newFile-button") as HTMLButtonElement;

// the "pagination" constant refers to the maximum number of elements shown in the table. initialElement and finalElement are the variables that will be incremented at the time of pagination to display the new objects. 
const pagination: number = 15;
let initialElement: number = 1;
let finalElement: number = pagination;

// An instance of the FileController class is created, which contains all the methods used in the program.
let fileController = new FileController(input, tableContainer, initialElement, finalElement, searchInput, chart);

// This function calls the getData() method which renders the table with all the information. Additionally, a series of conditionals are set, where the amount of data and the maximum page size are taken into account in order to display the next and previous buttons.
async function updateData(): Promise<void> {
    await fileController.getData();
    const arrayLength = fileController.array?.length ?? 0;

    if (finalElement < arrayLength) {
        nextButton.style.display = "inline";
    } else {
        nextButton.style.display = "none";
    }

    if (initialElement <= pagination) {
        backButton.style.display = "none";
    } else {
        backButton.style.display = "inline";
    }
}

// When the .csv file is sent, the updateData function is called to render the table and buttons, additionally the postChart(chart) method is called to render the chart.
form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();
    fileController = new FileController(input, tableContainer, initialElement, finalElement, searchInput, chart);
    await updateData();
    searchInput.style.display = "inline";
    csvButton.style.display = "block";
    newFileButton.style.display = "block";
    fileController.postChart(chart);
});

// Search input that filters the information in the table, the function is executed after 500 ms.
searchInput.addEventListener("input", () => {
    tableContainer.innerHTML = "";
    fileController = new FileController(input, tableContainer, initialElement, finalElement, searchInput, chart);
    setTimeout(() => {
        updateData();
    }, 500);
});

// Next button for the pagination, this increase initialElement and finalElement variables and render the table.
nextButton.addEventListener("click", async () => {
    initialElement += pagination;
    finalElement += pagination;
    fileController = new FileController(input, tableContainer, initialElement, finalElement, searchInput, chart);
    await updateData();
});

// Back button for the pagination, this decrease initialElement and finalElement variables and render the table.
backButton.addEventListener("click", async () => {
    if (initialElement > pagination) {
        initialElement -= pagination;
        finalElement -= pagination;
        fileController = new FileController(input, tableContainer, initialElement, finalElement, searchInput, chart);
        await updateData();
    }
})

// Button that calls the downloadFile method to download the .csv file with the filtered data.
csvButton.addEventListener("click", async () => {
    fileController = new FileController(input, tableContainer, initialElement, finalElement, searchInput, chart);
    await fileController.getData();
    fileController.downloadFile();
})

// Button that restarts the program 
newFileButton.addEventListener("click", () => {
    window.location.href = "/";
})