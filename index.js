console.clear();
const http = require("http");
const getBodyData = require("./util");
const { v4 } = require("uuid");

const books = [
  {
    id: "1",
    title: "Maugli",
    pages: 240,
    author: "Raudyardh Keepling",
  },
  {
    id: "2",
    title: "O'tkan kunlar",
    pages: 210,
    author: "Abdulla Qodiriy",
  },
];


const server = http.createServer(async (req, res) => {
  if (req.url == "/books" && req.method == "GET") {
    res.writeHead(200, {
      "Content-type": "application/json charset-utf8",
    });
    const resp = {
      status: "OK",
      books,
    };
    res.end(JSON.stringify(resp));
    console.log("data");
  } else if (req.url == "/books" && req.method == "POST") {
    const data = await getBodyData(req);
    console.log(data);
    const { title, pages, author } = JSON.parse(data);
    const newBook = {
      id: v4(),
      title: title,
      pages: pages,
      author: author,
    };
    books.push(newBook);
    res.writeHead(201, {
      "Content-type": "application/json charset utf-8",
    });
    const resp = {
      status: "Created",
      book: newBook,
    };
    res.writeHead(200, {
      "Content-type": "application/json charset utf-8",
    });
    res.end(JSON.stringify(resp));
  } else if (req.url.match(/\/books\/\w+/) && req.method == "GET") {
    const id = req.url.split("/")[2];
    const book = books.find((b) => b.id == id);
    res.writeHead(200, {
      "Content-type": "application/json charset utf-8",
    });
    if (!book) {
      const resp = {
        status: 404,
        message: "Book not found",
      };
      res.end(JSON.stringify(resp));
    }
    const resp = {
      status: 200,
      book: book,
    };
    res.end(JSON.stringify(resp));
  } else if (req.url.match(/\/books\/\w+/) && req.method == "DELETE") {
    const id = req.url.split("/")[2];
    const book = books.findIndex((b) => b.id == id);
    if (book == -1) {
      const resp = {
        status: 404,
        message: "Book not found",
      };
      res.writeHead(404, {
        "Content-Type": "application/json charset-utf8",
      });
      res.end(JSON.stringify(resp));
    }
    books.splice(book, 1);
    res.writeHead(200, {
      "Content-Type": "application/json charset-utf8",
    });
    const resp = {
      status: 200,
      message: "Successfully deleted",
    };
    res.end(JSON.stringify(resp));
  } else if (req.url.match(/\/books\/\w+/) && req.method == "PUT") {
    const id = req.url.split("/")[2];
    const body = await getBodyData(req);
    console.log(body);
    const { title, pages, author } = JSON.parse(body);
    const bookIndex = books.findIndex((b) => b.id == id);
    res.writeHead(200, {
      "Content-Type": "application/json charset-utf8",
    });
    if(bookIndex == -1){
      const resp = {
        status: 404,
        message: "Not found",
      };
      res.end(JSON.stringify(resp));
    }
    const updateBook = {
      id: id,
      title: title,
      pages: pages,
      author: author,
    };
    books[bookIndex] = updateBook;
    const resp = {
      status: 200,
      message: "Successfully updated",
    };
    res.end(JSON.stringify(resp));
  }
});
server.listen(3000, () => {
  console.log("Server is running at 3000");
});
