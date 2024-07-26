import '../scss/style.scss';
import { FileController } from '../../../Controllers/File.controller'

const form = document.querySelector("form") as HTMLFormElement;
const input = document.querySelector("#file-input") as HTMLInputElement;
const tableContainer = document.querySelector(".table-container") as HTMLElement;



let initialElement = 1;
let finalElement = 15;


form.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    const fileController = new FileController(input, tableContainer, initialElement, finalElement);
    fileController.getData();

})

const nextButton = document.querySelector("#next-button") as HTMLButtonElement;
const backButton = document.querySelector("#back-button") as HTMLButtonElement;

nextButton.addEventListener("click", () => {
    initialElement += 15;
    finalElement += 15;

    const fileController = new FileController(input, tableContainer, initialElement, finalElement);
    fileController.getData();
})

backButton.addEventListener("click", () => {
    if (initialElement >= 15) {
        initialElement -= 15;
        finalElement -= 15;

        const fileController = new FileController(input, tableContainer, initialElement, finalElement);
        fileController.getData();
    }
})

