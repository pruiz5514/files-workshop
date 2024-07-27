import '../scss/style.scss';
import { FileController } from '../../../Controllers/File.controller'

const form = document.querySelector("form") as HTMLFormElement;
const input = document.querySelector("#file-input") as HTMLInputElement;
const tableContainer = document.querySelector(".table-container") as HTMLElement;
const nextButton = document.querySelector("#next-button") as HTMLButtonElement;
const backButton = document.querySelector("#back-button") as HTMLButtonElement;
const searchInput = document.querySelector("#search-input") as HTMLInputElement;


const pagination: number = 15;
let initialElement: number = 1;
let finalElement: number = pagination;


let fileController = new FileController(input, tableContainer, initialElement, finalElement, searchInput);

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
    fileController = new FileController(input, tableContainer, initialElement, finalElement, searchInput);
    await updateData();
    searchInput.style.display = "inline";
})



searchInput.addEventListener("input", () => {
    tableContainer.innerHTML = "";
    fileController = new FileController(input, tableContainer, initialElement, finalElement, searchInput);
    setTimeout(() => {
        updateData();
    }, 500);
});


nextButton.addEventListener("click", async () => {
    initialElement += pagination;
    finalElement += pagination;
    fileController = new FileController(input, tableContainer, initialElement, finalElement, searchInput);
    await updateData();
});

backButton.addEventListener("click", async () => {
    if (initialElement > pagination) {
        initialElement -= pagination;
        finalElement -= pagination;
        fileController = new FileController(input, tableContainer, initialElement, finalElement, searchInput);
        await updateData();
    }
})

