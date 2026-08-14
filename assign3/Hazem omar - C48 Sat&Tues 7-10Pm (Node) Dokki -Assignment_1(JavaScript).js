// part 1
// Q1
// The  Event Loop is a mechanism that allows Node.js to perform non-blocking asynchronous operations even though JavaScript code normally runs on a single main thread
// ========================================================================================
// q2
/**
  libuv is a cross-platform C library used by Node.js to provide its event-driven and asynchronous I/O functionality.
 roles of libuv
 
  * Managing the Event Loop.
  Handling asynchronous network I/O.
  Providing asynchronous file system operations.
  Providing a thread pool for certain blocking operations.
 */
// ========================================================================================
// q3
/**
 When Node.js receives an asynchronous operation, it does not necessarily wait for that operation to finish.

Instead, the operation is handled using the Event Loop, operating-system asynchronous I/O mechanisms, or libuv's thread pool depending on the type of operation.
 */
// ==============================================

// q4
/**
 *  Call Stack keeps track of the JavaScript functions that are currently being executed.
 * The Event Queue contains callbacks/tasks that are ready to be executed after their asynchronous operations have completed.
 * The Event Loop continuously checks whether the Call Stack is available and processes pending asynchronous callbacks according to Node.js's event-loop phases.
 */

// ===============================================================================================
// q5
/**
 * The Node.js Thread Pool is a group of worker threads provided by libuv.

  It is used for operations that cannot be efficiently performed using the normal non-blocking network I/O mechanism, such as:

  -File system operations
  -Some DNS operations
  -User-defined work submitted through libuv


  the default size thread pool is 4 threads
 */
// ===============================================
// Q6
/**
 * Non-blocking operations allow Node.js to continue executing other JavaScript code while waiting for an operation to complete.
 * Blocking code prevents the main JavaScript thread/Event Loop from continuing until the operation finishes.
 */
// ============================================================================================================================================
// part2
// Q1

const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
// q1
app.post("/user", (req, res) => {
  const { name, age, email } = req.body;

  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error reading users file.",
      });
    }

    const users = JSON.parse(data);

    // Check if email already exists
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return res.json({
        message: "Email already exists.",
      });
    }

    // Create new ID
    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    // Create new user
    const newUser = {
      id: newId,
      name,
      age,
      email,
    };

    // Add user
    users.push(newUser);

    // Write updated data to JSON file
    fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({
          message: "Error writing users file.",
        });
      }

      res.json({
        message: "User added successfully.",
      });
    });
  });
});
// q2
app.patch("/user/:id", (req, res) => {
  const id = Number(req.params.id);

  const { name, age, email } = req.body;

  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error reading users file.",
      });
    }

    const users = JSON.parse(data);

    // Find user by ID
    const user = users.find((user) => user.id === id);

    // User not found
    if (!user) {
      return res.json({
        message: "User ID not found.",
      });
    }

    // Update values if they were provided
    if (name !== undefined) {
      user.name = name;
    }

    if (age !== undefined) {
      user.age = age;
    }

    if (email !== undefined) {
      user.email = email;
    }

    // Write updated users to JSON file
    fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({
          message: "Error writing users file.",
        });
      }

      // Response message
      if (name !== undefined) {
        return res.json({
          message: "User name updated successfully.",
        });
      }

      if (age !== undefined) {
        return res.json({
          message: "User age updated successfully.",
        });
      }

      if (email !== undefined) {
        return res.json({
          message: "User email updated successfully.",
        });
      }
    });
  });
});
// q3
app.delete("/user/:id", (req, res) => {
  const id = Number(req.params.id);

  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error reading users file.",
      });
    }

    const users = JSON.parse(data);

    // Find user
    const index = users.findIndex((user) => user.id === id);

    // User not found
    if (index === -1) {
      return res.json({
        message: "User ID not found.",
      });
    }

    // Delete user
    users.splice(index, 1);

    // Update JSON file
    fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({
          message: "Error writing users file.",
        });
      }

      res.json({
        message: "User deleted successfully.",
      });
    });
  });
});
// q4
app.get("/user/getByName", (req, res) => {
  const name = req.query.name;

  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error reading users file.",
      });
    }

    const users = JSON.parse(data);

    // Find user by name
    const user = users.find((user) => user.name === name);

    // User not found
    if (!user) {
      return res.json({
        message: "User name not found.",
      });
    }

    // Return user
    res.json(user);
  });
});
// q5
app.get("/user", (req, res) => {
  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error reading users file."
      });
    }

    const users = JSON.parse(data);

    res.json(users);
  });
});
// q6

app.get("/user/filter", (req, res) => {
  const minAge = Number(req.query.minAge);

  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error reading users file."
      });
    }

    const users = JSON.parse(data);

    // Filter users by minimum age
    const filteredUsers = users.filter(
      (user) => user.age >= minAge
    );

    // No users found
    if (filteredUsers.length === 0) {
      return res.json({
        message: "no user found"
      });
    }

    // Return filtered users
    res.json(filteredUsers);
  });
});

// q7

app.get("/user/:id", (req, res) => {
  const id = Number(req.params.id);

  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error reading users file."
      });
    }

    const users = JSON.parse(data);

    // Find user by ID
    const user = users.find((user) => user.id === id);

    // User not found
    if (!user) {
      return res.json({
        message: "User not found."
      });
    }

    // Return user
    res.json(user);
  });
});







app.listen(3000, () => {
  console.log("Server running on port 3000");
});
