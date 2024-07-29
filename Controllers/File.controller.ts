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

    constructor(input: HTMLInputElement, tableContainer: HTMLElement, initialElement: number, finalElement: number, searchInput: HTMLInputElement, chart: HTMLCanvasElement) {
        this.input = input;
        this.tableContainer = tableContainer;
        this.initialElement = initialElement;
        this.finalElement = finalElement;
        this.array = null;
        this.searchInput = searchInput;
        this.chart = chart;
        this.initialData = null;
    }

    getData(): Promise<void> {
        return new Promise((resolve) => {
            if (this.input.files && this.input.files.length === 1) {
                let emptyCells = [];
                const file = this.input.files[0];
                const fileExtension = file.name.split('.').pop()?.toLowerCase();

                if (fileExtension === "csv") {
                    const fileReader = new FileReader();

                    fileReader.onload = (event) => {
                        const text = event.target?.result as string;

                        const rows = text?.split("\n");
                        this.array = rows.map(row => row.split(","));
                        this.array.pop();

                        this.initialData = [...this.array];

                        for (const row of this.array) {
                            for (const cell of row) {
                                if (cell.trim() === "") {
                                    emptyCells.push(cell);
                                }
                            }
                        }

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

    removeAccents(str: string): string {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    postChart(chart: HTMLCanvasElement) {
        const canva = chart.getContext("2d");

        let xAxis: string[] = []

        if (this.initialData) {
            for (const row of this.initialData) {
                if (!xAxis.includes(row[2])) {
                    xAxis.push(row[2])
                }
            }
        }

        xAxis.shift();

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

        if (canva) {
            new Chart(canva, {
                type: 'bar',
                data: {
                    labels: xAxis,
                    datasets: [
                        {
                            label: `CANTIDAD DE ${this.initialData?.[0][4] ?? 'Dato1'} POR ${this.initialData?.[0][2] ?? 'Dato2'}`,
                            backgroundColor: "#000080", // Color válido para el gráfico
                            data: yAxis
                        }
                    ]
                }
            });
        }
    }

    downloadFile() {
        const dataCsv: string = this.array?.map((row: string[]) => row.join(",")).join("\n") ?? "";

        const blob: Blob = new Blob([dataCsv], { type: "text/csv" });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "datos.csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}