$(document).ready(function () {
  getBooks();

  // add a book
  $('#book-submit').on('click', postBook);
  $('#book-list').on('click','.update', putBook);
  //select .update where the event actually happens on
  $('#book-list').on('click','.delete', deleteBook);
  //the books are already on the dom to delete
  $('.genre-form').on('click','#genre-submit',selectGenre);
  //listener for button to run selectGenre function
});
/**
 * Retrieve books from server and append to DOM
 */
function getBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: function (books) {
      console.log('GET /books returns:', books);
      books.forEach(function (book) {
        var $el = $('<div></div>');

        var bookProperties = ['title','author','published','genre'];
// nested loop
        bookProperties.forEach(function(property){
          var inputType = 'text'
          if (property == 'published') {
                       book[property] = new Date(book[property]);

                       //get strings for month/day/year
                       var month = book[property].getUTCMonth(book[property]) + 1; //months from 1-12
                       var day = book[property].getUTCDate(book[property]);
                       var year = book[property].getUTCFullYear(book[property]);

                       //catcatcanate into one string month/day/year and set to book.published as text
                       book[property] = month + "/" + day + "/" + year;
                   }
          console.log('properties',book[property]);
          var $input = $('<input type="'+inputType+'" id="'+property+'"name="'+property +'"/>')
          $input.val(book[property]);
          $el.append($input);
        });
        $el.data('bookId',book.id);
        //we use this to uniquely identify it by the book.id
        $el.append('<button class ="update">Update</button>');
        $el.append('<button class ="delete">Delete</button>');
        $('#book-list').append($el);
      })
    },
    error: function (response) {
      console.log('GET /books fail. No books could be retrieved!');
    },
  });
}
/**
 * Add a new book to the database and refresh the DOM
 */
function postBook() {
  event.preventDefault();

  var book = {};

  $.each($('#book-form').serializeArray(), function (i, field) {
    book[field.name] = field.value;
  });

  $.ajax({
    type: 'POST',
    url: '/books',
    data: book,
    success: function () {
      console.log('POST /books works!');
      $('#book-list').empty();
      getBooks();
    },

    error: function (response) {
      console.log('POST /books does not work...');
    },
  });
}

function putBook(){
  var book= {};
  var inputs = $(this).parent().children().serializeArray();
  //get off of the button, we have to get the fields off of the buttons
  //this actually is the button, data is inside the parent
  //we didn't define a form we just have input fields
  //to get all the fields information off of it using serailizearray is taking it's children and then we can call serializeArray
  //children are all the inputs
  $.each(inputs,function(i,field){
    book[field.name] = field.value;
    //taking all the values of the field
  });
  console.log('books we are putting',book);

  var bookId = $(this).parent().data('bookId');
  //the button is this, parent is the div and we put .data on the div

  //updating a resource or the single book in this instance
  $.ajax({
    type: 'PUT',
    url:'/books/'+bookId,
    //appending the book id
    //url data is different by convention and appending our ID to it
    data: book,
    //sending data over
    success: function(){
      $('#book-list').empty();
      getBooks();
      //repopulate the book on the dom
    },
    error:function(){
      console.log('Error PUT /books/'+bookId);
    },
  });
}

function deleteBook(){
  //we just the id to delete the book
  var bookId = $(this).parent().data('bookId');
  //this is the button,but the actual .data is on the parent (the div that encloses the button),('bookId')
  $.ajax({
    type: 'DELETE',
    url:'/books/' + bookId,
    success: function(){
      console.log("DELETE success");
      //repopulate the dom if a success but we empty it first
      $("#book-list").empty();
      getBooks();
    },
    error: function(){
      console.log('DELETE failed');
    }
  });

};


function selectGenre() {
  var genre = $('#genres :selected').val();
  $.ajax({
    type: 'GET',
    url: '/books/'+ genre,
    success: function (books) {
      console.log('GET /books returns:', books);
      $("#book-list").empty();
      books.forEach(function (book) {
        var $el = $('<div></div>');

        var bookProperties = ['title','author','published','genre'];
// nested loop
        bookProperties.forEach(function(property){
          var inputType = 'text'
          if (property == 'published') {
                       book[property] = new Date(book[property]);

                       //get strings for month/day/year
                       var month = book[property].getUTCMonth(book[property]) + 1; //months from 1-12
                       var day = book[property].getUTCDate(book[property]);
                       var year = book[property].getUTCFullYear(book[property]);

                       //catcatcanate into one string month/day/year and set to book.published as text
                       book[property] = month + "/" + day + "/" + year;
                   }
          console.log('properties',book[property]);
          var $input = $('<input type="'+inputType+'" id="'+property+'"name="'+property +'"/>')
          $input.val(book[property]);
          $el.append($input);
        });
        $el.data('bookId',book.id);
        //we use this to uniquely identify it by the book.id
        $el.append('<button class ="update">Update</button>');
        $el.append('<button class ="delete">Delete</button>');
        $('#book-list').append($el);
      });
    },

    error: function (response) {
      console.log('GET /books fail. No books could be retrieved!');
    },
  });
}
