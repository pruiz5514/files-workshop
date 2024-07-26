import { dataFile } from '../Models/DataFile'

export class FileController {
    input: HTMLInputElement;
    tableContainer: HTMLElement;
    initialElement: number;
    finalElement: number;
    array: dataFile | null;


    constructor(input: HTMLInputElement, tableContainer: HTMLElement, initialElement: number, finalElement: number) {
        this.input = input;
        this.tableContainer = tableContainer;
        this.initialElement = initialElement;
        this.finalElement = finalElement;
        this.array = null;

    }

    getData(): Promise<void> {
        return new Promise((resolve) => {
            if (this.input.files && this.input.files.length === 1) {
                const file = this.input.files[0];
                const fileReader = new FileReader();

                fileReader.onload = (event) => {
                    const text = event.target?.result as string;

                    const rows = text?.split("\n");
                    this.array = rows.map(row => row.split(","));
                    console.log(this.array.length);

                    this.tableContainer.innerHTML = "";
                    this.tableContainer.append(this.createTable(this.array));

                    resolve();
                };

                fileReader.readAsText(file);
            }
        });
    }
    createTable(array: dataFile) {
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
            if (index !== 0 && index >= this.initialElement && index <= this.finalElement) {
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

    async getArrayLength() {
        return await this.array?.length;
    }

}