import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';

import { Route, Switch, Link } from 'react-router-dom';

import SearchPage from './Components/SearchPage';
import BookDisplayShelf from './Components/BookDisplayShelf';

const currentlyReading = 'currentlyReading';
const wantToRead = 'wantToRead';
const read = 'read';
const none = 'none';

class BooksApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      books : [],
      searchedBooks : []
    }
  }

  componentDidMount(){
    BooksAPI.getAll().then((books) =>
      this.setState({ books : books})
    );
  }

  updateShelf = function(shelf, book) {
    book.shelf = shelf;

    BooksAPI.update(book, shelf);
    
    const updatedBooks = this.state.books.filter(b => b.id !== book.id).concat(book);
    this.setState({ books : updatedBooks});
  }

  searchBook = function(bookTitleOrAuthor){
    let shelf = this.none;
    BooksAPI.search(bookTitleOrAuthor).then((books) => {
      if(books) {
        this.setState({ searchedBooks : []});
        books && books.length && books.map((book) => {
          
          this.state.books.forEach((b) => {
            if(b.id === book.id){
             return shelf = b.shelf;
            }
          });
          
          let updatedBook = book;
          updatedBook.shelf = shelf;

          this.setState((state) => { 
             return {searchedBooks : state.searchedBooks.concat([updatedBook])};
          })
          return shelf = this.none;
        })
      } else {
        return this.setState(() => ({ searchedBooks : []}));
      }
    })
  }

  render() {
    let {books} = this.state; 
    let {searchedBooks} = this.state;

    const PageNotFound = () => (
      <div>Page not found!</div>
    );
    
    return (
      <div className="app">
        <Switch>
          <Route exact path='/search' render={() => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link to='/'> 
                  <button className="close-search">Close</button> 
                </Link>
                <div className="search-books-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Search by title or author"
                    onChange= {(event) => this.searchBook(event.target.value)} 
                    />
                </div>
              </div>
              <div className="search-books-results">
                <SearchPage books={searchedBooks} 
                  updateShelf={(newShelf, book) => (this.updateShelf(newShelf,book))}/>
              </div>
            </div>
          )} />
          
          <Route exact path='/' render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <div className="bookshelf">

                    <h2 className="bookshelf-title">Currently Reading</h2>
                    <BookDisplayShelf shelf={currentlyReading} books={books} 
                    updateShelf={(newShelf, book) => (this.updateShelf(newShelf, book))}/>
                  </div>
                  <div className="bookshelf">

                    <h2 className="bookshelf-title">Want to Read</h2>
                    <BookDisplayShelf shelf={wantToRead} books={books} 
                    updateShelf={(newShelf, book) => (this.updateShelf(newShelf, book))}/>
                  </div>
                  <div className="bookshelf">

                    <h2 className="bookshelf-title">Read</h2>
                    <BookDisplayShelf shelf={read} books={books} 
                    updateShelf={(newShelf, book) => (this.updateShelf(newShelf, book))}/>
                  </div>
                </div>
              </div>

              <Link to='/search' onClick={this.searchBook} className="open-search">
                <button>Add a book</button>
              </Link>

            </div>
          )}/>

          <Route component={PageNotFound} />

        </Switch>
      </div>
    );
  }
}

export default BooksApp
