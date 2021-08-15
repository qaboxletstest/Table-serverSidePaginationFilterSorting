import React, { useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import "./App.css"

const App = () => {
  const [gridApi, setGridApi] = useState(null);

  const columns = [
    { headerName: "Athlete", field: "athlete", filter: "agTextColumnFilter" },
    { headerName: "Age", field: "age", filter: "agTextColumnFilter" },
    { headerName: "Country", field: "country", filter: "agTextColumnFilter" },
    { headerName: "Year", field: "year", filter: "agTextColumnFilter" },
    { headerName: "Date", field: 'date', filter: "agTextColumnFilter" },
    { headerName: "Sport", field: 'sport', filter: "agTextColumnFilter" },
    { headerName: "Gold", field: 'gold', filter: "agTextColumnFilter" },
    { headerName: "Silver", field: 'silver', filter: "agTextColumnFilter" },
    { headerName: "Bronze", field: 'bronze', filter: "agTextColumnFilter" },
    { headerName: "Total", field: 'total', filter: "agTextColumnFilter" },
  ]
  const datasource = {
    getRows(params) {
      const { startRow, endRow, filterModel, sortModel } = params.request
      let url = `http://localhost:4000/olympic?`
      //Sorting
      if (sortModel.length) {
        const { colId, sort } = sortModel[0]
        url += `_sort=${colId}&_order=${sort}&`
      }
      //Filtering
      const filterKeys = Object.keys(filterModel)
      filterKeys.forEach(filter => {
        url += `${filter}=${filterModel[filter].filter}&`
      })
      //Pagination
      url += `_start=${startRow}&_end=${endRow}`
      fetch(url)
        .then(httpResponse => httpResponse.json())
        .then(response => {
          params.successCallback(response, 499);
        })
        .catch(error => {
          console.error(error);
          params.failCallback();
        })
    }
  };

  const onGridReady = (params) => {
    setGridApi(params);
    // register datasource with the grid
    params.api.setServerSideDatasource(datasource);
  }

  return (
    <div id="app" className="App-header">
      <h1 align="center">QA BOX LET'S TEST</h1>
      <h4 style={{ backgroundColor: 'burlywood', borderRadius: '5px', fontSize: '20px' }}>Table with Server-Side Pagination, Filter and Sorting</h4>
      <div className="ag-theme-alpine" style={{ height: 350, width: '100%', marginTop: '2%' }}>
        <AgGridReact
          columnDefs={columns}
          pagination={true}
          cacheBlockSize={10}
          paginationPageSize={10}
          rowModelType="serverSide"
          onGridReady={onGridReady}
          defaultColDef={{ filter: true, floatingFilter: true, sortable: true }}
        />
      </div>
    </div>
  );
};
export default App