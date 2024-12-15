const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

// Отримання даних студентів
app.get("/students", (req, res) => {
  fs.readFile("students.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Помилка при читанні файлу");
    }
    res.json(JSON.parse(data));
  });
});

// Додавання студента
app.post("/students", (req, res) => {
  const newStudent = req.body;
  fs.readFile("students.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Помилка при читанні файлу");
    }
    const students = JSON.parse(data);
    students.push(newStudent);
    fs.writeFile("students.json", JSON.stringify(students, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Помилка при запису файлу");
      }
      res.status(201).send("Студента додано");
    });
  });
});

app.listen(port, () => {
  console.log(`Сервер працює на http://localhost:${port}`);
});
