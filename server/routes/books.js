var express = require('express');
var router = express.Router();
var pg = require('pg');
//we use pg package to make requests to our quarries
var connectionString = 'postgres://localhost:5432/omicron';
//postgress is our protocol and localhost 5432 is default, and name of database

router.get('/',function(req,res){
  //retrieve books from database
  pg.connect(connectionString,function(err,client,done){
    //first time we have access to done, when we open the query
    if(err){
      res.sendStatus(500);
    }
    client.query('SELECT * FROM books',function(err,result){
      done();
      //done is a function, we are done with the connection (done our query got our data close the connection)
      //Can run 10 querys on a connection, if we don't call DONE the querys will stay open.
      //if we odn't call run the query connection will stay open
      if(err){
        res.sendStatus(500);
      }
      res.send(result.rows);
    });
  });
  //connect takes two parameters(connectionString,function(err,client,done))
});

router.get('/:id',function(req,res){
  var id = req.params.id;
  //this id is paired with '/:id' in the parameter
  pg.connect(connectionString, function(err,client,done){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    client.query('SELECT * FROM books ' +
                'WHERE genre = $1',
                [id],
                function(err,result){
                  done();

                  if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                  }
                  res.send(result.rows);
                });
  });
});

router.post('/',function(req,res){
  var book = req.body;
  console.log(book);

  pg.connect(connectionString, function(err,client,done){
    if(err){
      res.sendStatus(500);
    };
    client.query('INSERT INTO books(author, title, published,genre)'
    //the three fields we want to insert into but these are fields in the database
      +'VALUES($1,$2,$3,$4)',
      //prepared statements - when i prepare the statement i prepare $1 is going to be book.author.book
      //prevents SQL injections
      //$1 will always match the first thing in the array (first database field is author)
      [book.author,book.title,book.published,book.genre],
        function(err,result){
          done();
          //close connections
          if (err){
            res.sendStatus(500);
            //after we close the connection and we get an error this will be sent
          }

          else{res.sendStatus(201);
          //this is a created status
        }
        });

      //these are properities on the object
  });
});

router.put('/:id', function(req,res){
  var id = req.params.id;
  //getting the ID off the request params.id which comes from the URL
  var book = req.body;

  pg.connect(connectionString, function(err,client,done){
    if(err){
      res.sendStatus(500);
    }

    client.query('UPDATE books '+
      //doing a UPDATE query on SQL
        //$1 preventing sequel injections by using prepared statements
                  'SET title = $1,' +
                  'author = $2,'+
                  'published = $3,'+
                  'genre = $4 ' +
                  'WHERE id = $5',
                  //tell it specifically which ID to update or it will update everything
                  [book.title,book.author,book.published,book.genre,id],
                  //this pairs up with our $1,$2 etc.)
                  //id represents the variable id (NOT book.id since that property doesn't exist)
                  function(err,result){
                    done();
                    //to close our connection to server
                  //the result of the request
                  if(err){
                    console.log('err',err);
                    res.sendStatus(500);
                  } else{
                    res.sendStatus(200);
                  }
                });
  });
});
// we put a /:id so on the server our route is going to look for (id is just a placeholder)
//whats important is the colons so we can accept requests that are unique(not just a particular word)
//request.params.id

router.delete('/:id',function(req,res){
  var id = req.params.id;
  console.log(id);
  //this id is paired with '/:id' in the parameter
  pg.connect(connectionString, function(err,client,done){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    client.query('DELETE FROM books ' +
                'WHERE id = $1',
                [id],
                function(err,result){
                  done();

                  if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                  }
                  res.sendStatus(200);
                });
  });
});
module.exports = router;
