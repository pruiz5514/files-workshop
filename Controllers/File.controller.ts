import Chart from 'chart.js/auto';
import { dataFile } from '../Models/DataFile'

export class FileController {
    input: HTMLInputElement;
    tableContainer: HTMLElement;
    initialElement: number;
    finalElement: number;
    array: dataFile | null;
    searchInput: HTMLInputElement;
    chart: HTMLCanvasElement;
    initialData: dataFile | null;
    buttonAscend: HTMLButtonElement | undefined;
    buttonDesc: HTMLButtonElement | undefined;

    constructor(input: HTMLInputElement, tableContainer: HTMLElement, initialElement: number, finalElement: number, searchInput: HTMLInputElement, chart: HTMLCanvasElement) {
        this.input = input;
        this.tableContainer = tableContainer;
        this.initialElement = initialElement;
        this.finalElement = finalElement;
        this.array = null;
        this.searchInput = searchInput;
        this.chart = chart;
        this.initialData = null;
        this.buttonAscend = undefined;
        this.buttonDesc = undefined;
    }

    // Method that renders the table 
    getData(): Promise<void> {
        return new Promise((resolve) => {

            // It is validated that only one file has been added.
            if (this.input.files && this.input.files.length === 1) {
                let emptyCells = [];
                const file = this.input.files[0];
                const fileExtension = file.name.split('.').pop()?.toLowerCase();

                // Validates that it is a .csv file.
                if (fileExtension === "csv") {
                    const fileReader = new FileReader();

                    // The information is obtained from the file
                    fileReader.onload = (event) => {
                        const text = event.target?.result as string;

                        // All the information is stored in an array of arrays called array
                        const rows = text?.split("\n");
                        this.array = rows.map(row => row.split(","));
                        this.array.pop();

                        // All the initial information is stored for later use in the graph.
                        this.initialData = [...this.array];

                        for (const row of this.array) {
                            for (const cell of row) {
                                if (cell.trim() === "") {
                                    emptyCells.push(cell);
                                }
                            }
                        }

                        // Validate that no cells are empty and perform the logic for data filtering. 
                        if (emptyCells.length === 0) {
                            if (this.searchInput.value === "") {
                                this.tableContainer.innerHTML = "";
                                this.tableContainer.append(this.createTable(this.array));
                            }
                            else {
                                const header = this.array[0];
                                this.array = this.array.filter((row) =>
                                    row.some(cell =>
                                        this.removeAccents(cell.toLowerCase()).includes(this.removeAccents(String(this.searchInput.value.toLowerCase())))
                                    )
                                );

                                // Table is rendered
                                this.array = [header, ...this.array];
                                this.tableContainer.innerHTML = "";
                                this.tableContainer.append(this.createTable(this.array));
                            }
                        }
                        else {
                            alert("El archivo no cumple con el formato correcto")
                            window.location.href = "/"
                        }

                        resolve();
                    };
                    fileReader.readAsText(file);
                } else {
                    alert("Solo se reciben documentos .csv");
                    window.location.href = '/';
                }
            }
        });
    }


    // Method that creates the table
    createTable(array: dataFile): HTMLTableElement {
        const table = document.createElement("table") as HTMLTableElement;
        table.className = "table";
        const thead = document.createElement("thead") as HTMLTableCaptionElement;
        const trHeader = document.createElement("tr") as HTMLTableCaptionElement;

        array[0].forEach((cell, index) => {
            this.buttonAscend = document.createElement("button") as HTMLButtonElement;
            this.buttonDesc = document.createElement("button") as HTMLButtonElement;

            this.buttonAscend.innerText = "as";
            this.buttonDesc.innerText = "des";
            this.buttonAscend.id = `as${index}`;
            this.buttonDesc.id = `des${index}`;
            this.buttonAscend.className = "btn btn-primary mx-2";
            this.buttonDesc.className = "btn btn-primary";

            this.buttonAscend.addEventListener('click', (event) => this.sortTable(event, 'asc'));
            this.buttonDesc.addEventListener('click', (event) => this.sortTable(event, 'desc'));

            let th = document.createElement("th") as HTMLTableCaptionElement;
            th.setAttribute("scope", "col");
            th.innerText = cell;
            th.append(document.createElement("br"), this.buttonDesc, this.buttonAscend);
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

    // method that removes the tildes for data filtering 
    removeAccents(str: string): string {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    // Method that creates the chart, the chart.js library is implemented.
    postChart(chart: HTMLCanvasElement) {
        const canva = chart.getContext("2d");

        // The array xAxis stores all the data of column 2 of all the information, (in this case the departments).
        let xAxis: string[] = []

        if (this.initialData) {
            for (const row of this.initialData) {
                if (!xAxis.includes(row[2])) {
                    xAxis.push(row[2])
                }
            }
        }

        xAxis.shift();

        // The array yAxis stores the number of times the data of the array xAxis is repeated, (in this case it counts the municipalities by departments).
        let yAxis: number[] = [];
        for (const dataX of xAxis) {
            let counter = 0;
            if (this.initialData) {
                for (const dataY of this.initialData) {
                    if (dataX === dataY[2]) {
                        counter += 1;
                    }
                }
            }
            yAxis.push(counter);
        }

        // The chart is created
        if (canva) {
            new Chart(canva, {
                type: 'bar',
                data: {
                    labels: xAxis,
                    datasets: [
                        {
                            label: `CANTIDAD DE ${this.initialData?.[0][4] ?? 'Dato1'} POR ${this.initialData?.[0][2] ?? 'Dato2'}`,
                            backgroundColor: "#000080",
                            data: yAxis
                        }
                    ]
                }
            });
        }
    }

    sortTable(event: Event, direction: 'asc' | 'desc') {
        const target = event.currentTarget as HTMLButtonElement;
        const columnIndex = parseInt(target.id.replace(/\D/g, ''));

        if (this.array && this.array.length > 1) {
            const header = this.array[0];
            this.array = this.array.slice(1);

            this.array.sort((a, b) => {
                const valueA = a[columnIndex].toLowerCase();
                const valueB = b[columnIndex].toLowerCase();

                if (direction === 'asc') {
                    return valueA.localeCompare(valueB);
                } else {
                    return valueB.localeCompare(valueA);
                }
            });

            this.array = [header, ...this.array];
            this.tableContainer.innerHTML = "";
            this.tableContainer.append(this.createTable(this.array));
        }
    }

    //  Method to download the .csv file
    downloadFile() {

        //The array of arrays with all the information is converted into text separated by line breaks and commas. 
        const dataCsv: string = this.array?.map((row: string[]) => row.join(",")).join("\n") ?? "";

        const blob: Blob = new Blob([dataCsv], { type: "text/csv" });

        const url = URL.createObjectURL(blob);

        // An anchor is created to store the link with which the file is downloaded. 
        const link = document.createElement("a");
        link.href = url;
        link.download = "datos.csv";

        document.body.appendChild(link);
        link.click();

        // The anchor is removed once the file has been downloaded.
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }



}