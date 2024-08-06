const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./app/model/dbconfig");
const Book = require("./app/model/book");

sequelize.sync({ force: true }).then(() => {
  console.log("db is ready...");
});

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "pug");

app.get("/", async (req, res) => {
  const books = await Book.findAll();
  res.render("index", { books });
});

app.post("/submit", async (req, res) => {
  const book = await Book.create({
    name: req.body.title,
    author: req.body.author,
    review: req.body.review,
  });
  res.send(`
    <tr>
      <td>${book.name}</td>
      <td>${book.author}</td>
      <td>${book.review}</td>
      <td>
        <button class="btn btn-primary" hx-get="/get-edit-form/${book.id}">Edit Book</button>
      </td>
      <td>
        <button hx-delete="/delete/${book.id}" class="btn btn-primary">Delete</button>
      </td>
    </tr>
  `);
});

app.delete("/delete/:id", async (req, res) => {
  await Book.destroy({ where: { id: req.params.id } });
  res.send("");
});

app.get("/get-edit-form/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.send(`
    <tr hx-trigger='cancel' class='editing' hx-get="/get-book-row/${book.id}">
      <td><input name="title" value="${book.name}"/></td>
      <td><input name="author" value="${book.author}"/></td>
      <td><textarea name="review">${book.review || ''}</textarea></td>
      <td>
        <button class="btn btn-primary" hx-get="/get-book-row/${book.id}">Cancel</button>
        <button class="btn btn-primary" hx-put="/update/${book.id}" hx-include="closest tr">Save</button>
      </td>
    </tr>
  `);
});

app.get("/get-book-row/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.send(`
    <tr>
      <td>${book.name}</td>
      <td>${book.author}</td>
      <td>${book.review}</td>
      <td>
        <button class="btn btn-primary" hx-get="/get-edit-form/${book.id}">Edit Book</button>
      </td>
      <td>
        <button hx-delete="/delete/${book.id}" class="btn btn-primary">Delete</button>
      </td>
    </tr>
  `);
});

app.put("/update/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update({
    name: req.body.title,
    author: req.body.author,
    review: req.body.review,
  });
  res.send(`
    <tr>
      <td>${book.name}</td>
      <td>${book.author}</td>
      <td>${book.review}</td>
      <td>
        <button class="btn btn-primary" hx-get="/get-edit-form/${book.id}">Edit Book</button>
      </td>
      <td>
        <button hx-delete="/delete/${book.id}" class="btn btn-primary">Delete</button>
      </td>
    </tr>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
