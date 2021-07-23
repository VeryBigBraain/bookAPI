import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [keyAPI, setKeyAPI] = useState('AIzaSyDL6nLVdSAJ_XI4OUnKlXxuPpuaTt81bx8');
  const [maxResults, setMaxResults] = useState(20);
  const [inputVal, setInputVal] = useState('');

  
    const handleRequest = (e) => {
      e.preventDefault();
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=${inputVal}&maxResults=${maxResults}&key=${keyAPI}`)
        .then(res => {
          const books = res.data.items;
          setBooks(books);
          setInputVal('');
        });
    }
    const handleInput = (e) => {
      const book = e.target.value;

      setInputVal(book);
    }

  try {
      return (
      <div className="wrapper">
        <div className="form-container">
          <form className="book-form">
            <input onChange={handleInput} type="text" className="form-input" value={inputVal} />
            <button type="submit" onClick={handleRequest} className="form-btn"></button>
          </form>
        </div>
            <div className="imgs-container">
              { books.map(book => 
                <a key={book.id} href={book.saleInfo.buyLink} className="book" target="__blank">
                  <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.title} />
                </a>
              )}
            </div>
      </div>
    )
  } catch(e) {
    console.warn('Error:', e.message);
    return (
      <div className="error-container">
        <h3>There is no books ;/</h3>
        <a href="http://localhost:3000">Go back</a>
      </div>
    )
  }
  
}

export default App;