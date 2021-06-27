const electron = require("electron");
const path = require("path");
const log = require('electron-logger');
const BrowserWindow = electron.remote.BrowserWindow;

function fetchOffices() {
    (async () => {
        /**
         * Local function to add a row to table.
         * @param e
         * @param officeTable
         */
        function addRow(e, officeTable) {
            function addElement(row, index, data, className) {
                let cell = row.insertCell(index);

                cell.className += " " + className;
                cell.innerHTML = data;
            }

            let row = officeTable.insertRow();
            log.info(e + '\n');
            addElement(row, 0, e.officeCode, "id");
            let address = `${e.addressLine1}<br/> ${(e.addressLine2 !== null ? e.addressLine2 + '<br/>' : '')} ${e.city || ''}, ${e.state || ''} ${e.postalCode || ''}`;
            addElement(row, 1, address, "address");
        }

        try {
            const response = await fetch('http://localhost:8080/classicmodels/office')
            const offices = await response.json();
            log.info(offices);

            let officeTable = document.getElementById('office_table');
            let tableRows = officeTable.rows;
            for(let i = tableRows.length-1; i > 0; i--) officeTable.deleteRow(i);
            offices.forEach((e) => addRow(e, officeTable));
        }
        catch (e){
            log.info('Whoops!!!');
            log.info(e.message);
        }
    })(); // End Async.
}

// document.addEventListener("DOMContentLoaded", (event) => {
//     log.info('DOM is ready.');
//     fetchOffices();
// });

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        console.log('DOM is ready.')
        fetchOffices();
    }
};

const officeButton = document.getElementById("btn_bingo");
officeButton.addEventListener('click',(ev) => {
    log.info('Start');
    fetchOffices();
})
