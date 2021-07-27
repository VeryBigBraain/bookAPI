import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [keyAPI, setKeyAPI] = useState('AIzaSyDL6nLVdSAJ_XI4OUnKlXxuPpuaTt81bx8');
  const [maxResults, setMaxResults] = useState(20);
  const [inputVal, setInputVal] = useState('');
  const [numberOfStart, setNumberOfStart] = useState(0);
  const [currentBook, setCurrentBook] = useState('');
  const [visible, setVisible] = useState('hide');
  const [isLoaded, setIsLoaded] = useState(true);

    const handleInput = (e) => {
      const book = e.target.value;

      setInputVal(book);
    }
    const handleRequest = (e) => {
      e.preventDefault();
      setIsLoaded(false);
      console.log(`https://www.googleapis.com/books/v1/volumes?q=${inputVal}&startIndex=${numberOfStart}&maxResults=${maxResults}&key=${keyAPI}`)
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=${inputVal}&startIndex=${numberOfStart}&maxResults=${maxResults}&key=${keyAPI}`)
        .then(res => {
          const newBooks = res.data.items;
          setVisible('');
          setBooks(newBooks);
          setNumberOfStart(numberOfStart + maxResults);
          setCurrentBook(inputVal);
          setInputVal('');
          setIsLoaded(true);
        });
    }
    const filterNewBooks = (moreBooks) => {
      const filteredBooks = moreBooks.filter(newBook => {
        const booksId =  books.map(book => book.id);
        return !(booksId.includes(newBook.id));
      })

      return filteredBooks;
    };
    const hanldeAddBooks = () => {
      setIsLoaded(false);
      console.log(`https://www.googleapis.com/books/v1/volumes?q=${currentBook}&startIndex=${numberOfStart}&maxResults=${maxResults}&key=${keyAPI}`)
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=${currentBook}&startIndex=${numberOfStart}&maxResults=${maxResults}&key=${keyAPI}`)
        .then(res => {
          let moreBooks = filterNewBooks(res.data.items);
          setBooks([...books, ...moreBooks]);
          setNumberOfStart(numberOfStart + maxResults);
          console.log(books);
          setIsLoaded(true);
        });
    }

  if (isLoaded) {
    try {
      return (
        <div className="wrapper">
          <h1 className="header">Find a book:</h1>
          <div className="form-container">
            <form className="book-form" onSubmit={handleRequest}>
              <input onChange={handleInput} type="text" className="form-input" value={inputVal} required />
              <button type="submit" className="form-btn">Got it</button>
            </form>
          </div>
              <div className= {`imgs-container ${visible}`}>
                { books.map(book => 
                  <a key={book.id} href={book.saleInfo.buyLink || book.volumeInfo.canonicalVolumeLink} className="book" target="__blank">
                    <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.title} />
                  </a>
                )}
              </div>
              <button className={`form-btn ${visible}`} onClick={hanldeAddBooks}>More</button>
        </div>
      )
    } catch(e) {
      console.warn('Error:', e.message);
      return (
        <div className="wrapper">
          <div className="error-container">
            <h1 className="error-header">There is no books ;/</h1>
            <a className="home-link" href="http://localhost:3000">Go back</a>
          </div>
        </div>
      )
    }
  } else {
    return (
      <div className="wrapper">
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        <h2 className="header">Loading...</h2>
      </div>
    )
  }
}

export default App;
