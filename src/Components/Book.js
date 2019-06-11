import React from 'react';
import ShelfSelect from './ShelfSelect';

const Book = (props) => {
  return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={props.style} title={props.bookDescription}></div>
          <ShelfSelect updateShelf={(e) => props.updateShelf(e)} bookShelf={props.bookShelf}/>
        </div>
        
        <div className="book-title">{props.bookTitle}</div>
        <div className="book-authors">{props.bookAuthors}</div>
        <div className="book-authors">Rating: {props.bookAverageRating}</div>
      </div>
    );
  }
export default Book;