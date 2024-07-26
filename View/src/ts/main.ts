// Import our custom CSS
import '../scss/style.scss';

const form = document.querySelector("form") as HTMLFormElement;
const input = document.querySelector("#file-input") as HTMLInputElement;
const tableContainer = document.querySelector(".table-container") as HTMLElement;

form.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    let fileReader = new FileReader();

    if (input.files && input.files.length === 1) {
        const file = input.files[0];

        fileReader.onload = (event) => {
            const text = event.target?.result as string;

            const rows = text?.split("\n");
            const array = rows.map(row => row.split(","))

            tableContainer.append(createTable(array));


        }

        fileReader.readAsText(file);
    }

})

function createTable(array: string[][]) {
    const table = document.createElement("table") as HTMLTableElement;
    table.className = "table";
    const thead = document.createElement("thead") as HTMLTableCaptionElement;
    const trHeader = document.createElement("tr") as HTMLTableCaptionElement;

    array[0].forEach(cell => {
        let th = document.createElement("th") as HTMLTableCaptionElement;
        th.setAttribute("scope", "col");
        th.innerText = cell;
        trHeader.append(th);
    });

    const tbody = document.createElement("tbody") as HTMLTableSectionElement;
    array.forEach((row, index) => {
        if (index !== 0) {
            let tr = document.createElement("tr") as HTMLTableCaptionElement;

            row.forEach(cell => {
                let td = document.createElement("td") as HTMLTableCellElement;
                td.innerText = cell;
                tr.append(td)
            })

            tbody.append(tr);
        }
    })

    thead.append(trHeader);
    table.append(thead, tbody);

    return table;
}