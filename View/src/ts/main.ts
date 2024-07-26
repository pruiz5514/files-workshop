import '../scss/style.scss';
import { FileController } from '../../../Controllers/File.controller'

const form = document.querySelector("form") as HTMLFormElement;
const input = document.querySelector("#file-input") as HTMLInputElement;
const tableContainer = document.querySelector(".table-container") as HTMLElement;
const nextButton = document.querySelector("#next-button") as HTMLButtonElement;
const backButton = document.querySelector("#back-button") as HTMLButtonElement;
const searchInput = document.querySelector("#search-input") as HTMLInputElement;


const pagination = 15
let initialElement = 1;
let finalElement = pagination;


let fileController = new FileController(input, tableContainer, initialElement, finalElement);

async function updateData() {
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

form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();
    fileController = new FileController(input, tableContainer, initialElement, finalElement);
    await updateData();
    searchInput.style.display = "inline";
})


searchInput.addEventListener("input", (event: Event) => {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
})


nextButton.addEventListener("click", async () => {
    initialElement += pagination;
    finalElement += pagination;
    fileController = new FileController(input, tableContainer, initialElement, finalElement);
    await updateData();
});

backButton.addEventListener("click", async () => {
    if (initialElement > pagination) {
        initialElement -= pagination;
        finalElement -= pagination;
        fileController = new FileController(input, tableContainer, initialElement, finalElement);
        await updateData();
    }
})

