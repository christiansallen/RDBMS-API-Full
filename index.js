const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true // needed for sqlite
};
const db = knex(knexConfig);

const server = express();

server.use(helmet());
server.use(express.json());

const port = 5000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

server.post("/api/cohorts", (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(404).json({ message: "Please add a name" });
  }
  db("cohorts")
    .insert({ name })
    .then(cohort => res.status(201).json(cohort))
    .catch(() => res.status(500).json({ message: "Server error" }));
});

server.get("/api/cohorts", (req, res) => {
  db("cohorts")
    .then(cohort => {
      if (cohort.length > 0) {
        res.status(200).json(cohort);
      } else {
        res
          .status(404)
          .json({ message: "No cohorts are found in the database." });
      }
    })
    .catch(() => res.status(500).json({ message: "Server error" }));
});

server.get("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;
  db("cohorts")
    .where({ id: id })
    .then(cohort => {
      if (cohort.length === 0) {
        res.status(404).json({ message: "There is no cohort with that id." });
      } else {
        res.status(200).json(cohort);
      }
    })
    .catch(() => res.status(500).json({ message: "Server error" }));
});

server.delete("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;
  db("cohorts")
    .where({ id: id })
    .del()
    .then(cohort => {
      if (cohort.length === 0) {
        res.status(404).json({ message: "There is no cohort with that id." });
      } else {
        res
          .status(200)
          .json({ message: "The cohort was successfully deleted." });
      }
    })
    .catch(() => res.status(500).json({ message: "Server error" }));
});

server.put("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    res.status(404).json({ message: "Please enter a name" });
  } else {
    db("cohorts")
      .where({ id: id })
      .update({ name })
      .then(cohort => {
        if (cohort.length > 0) {
          res.status(200).json(cohort);
        } else {
          res
            .status(404)
            .json({ message: "There is no cohort to update with that id." });
        }
      })
      .catch(() => res.status(500).json({ message: "Server error" }));
  }
});

server.get("/api/students", (req, res) => {
  db("students")
    .then(student => {
      if (student.length === 0) {
        res.status(404).json({ message: "No students are found." });
      } else {
        res.status(200).json(student);
      }
    })
    .catch(() => res.status(500).json({ message: "Server error" }));
});

server.post("/api/students", (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(404).json({ message: "Please enter a name." });
  } else {
    db("students")
      .insert({ name })
      .then(student => res.status(201).json(student))
      .catch(() => res.status(500).json({ message: "Server error" }));
  }
});
