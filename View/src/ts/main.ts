import '../scss/style.scss';
import { FileController } from '../../../Controllers/File.controller'

const form = document.querySelector("form") as HTMLFormElement;
const input = document.querySelector("#file-input") as HTMLInputElement;
const tableContainer = document.querySelector(".table-container") as HTMLElement;

form.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    const fileController = new FileController(input, tableContainer);
    fileController.getData();

})
