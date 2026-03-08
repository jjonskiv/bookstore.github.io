import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import AddBook from './AddBook';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import './App.css'

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {

  const URL = 'https://bookstore-83027-default-rtdb.europe-west1.firebasedatabase.app/books'
  const [books, setBooks] = useState([])
  const [colDefs, setColDefs] = useState([
    { field: 'author', sortable: true, filter: true },
    { field: 'isbn', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
    { field: 'title', sortable: true, filter: true },
    { field: 'year', sortable: true, filter: true },
    {
      headerName: '',
      field: 'id',
      width: 100,
      cellRenderer: params =>
        <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
          <DeleteIcon />
        </IconButton>
    },
  ]);

  useEffect(() => {
    fetchItems();
  }, [])


  const fetchItems = () => {
    fetch(URL + `.json`)
      .then(response => response.json())
      .then(data => addKeys((data)))
      .catch(err => console.error(err))
  }

  // Add keys to the book objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, 'id', { value: keys[index] }));
    setBooks(valueKeys);
  }

  const addBook = (newBook) => {
    fetch(URL + `.json`,
      {
        method: 'POST',
        body: JSON.stringify(newBook)
      })
      .then(res => fetchItems())
      .catch(err => console.error(err))
  }

  const deleteBook = (id) => {
    fetch(URL + `/${id}.json`,
      {
        method: 'DELETE',
      })
      .then(res => fetchItems())
      .catch(err => console.error(err))
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} />
      <div style={{ height: 500, width: 900 }}>
        <AgGridReact
          rowData={books}
          columnDefs={colDefs}
          defaultColDef={{
            flex: 1
          }}
        />
      </div>
    </div>
  );
}

export default App;
