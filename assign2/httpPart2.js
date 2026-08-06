// q1
const http = require("http");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "users.json");

// Helper function to safely read users from JSON file
const readUsers = () => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
};

// Helper function to write users to JSON file
const writeUsers = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf8");
};

const server = http.createServer((req, res) => {
  // Set JSON response header
  res.setHeader("Content-Type", "application/json");

  // POST /user
  if (req.method === "POST" && req.url === "/user") {
    let body = "";

    // Collect incoming data chunks
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const newUser = JSON.parse(body);

        // Validate basic payload structure
        if (!newUser.email || !newUser.name || !newUser.age) {
          res.writeHead(400);
          return res.end(JSON.stringify({ message: "Invalid input data." }));
        }

        // Read current state directly from JSON file
        const users = readUsers();

        // Check if email already exists
        const userExists = users.some((u) => u.email === newUser.email);

        if (userExists) {
          res.writeHead(400);
          return res.end(JSON.stringify({ message: "Email already exists." }));
        }

        // Generate unique ID and save
        const userToSave = { id: Date.now(), ...newUser };
        users.push(userToSave);
        writeUsers(users);

        res.writeHead(201);
        return res.end(JSON.stringify({ message: "User added successfully." }));
      } catch (err) {
        res.writeHead(400);
        return res.end(JSON.stringify({ message: "Invalid JSON body." }));
      }
    });
  }
  // PATCH /user/:id
  else if (req.method === "PATCH" && req.url.startsWith("/user/")) {
    let body = "";

    // get id from URL
    const id = Number(req.url.split("/")[2]);

    // collect body data
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const updateData = JSON.parse(body);

        // read users
        const users = readUsers();

        // find user
        const user = users.find((u) => u.id === id);

        if (!user) {
          res.writeHead(404);
          return res.end(
            JSON.stringify({
              message: "User ID not found.",
            }),
          );
        }

        // update values
        if (updateData.name) {
          user.name = updateData.name;
        }

        if (updateData.age) {
          user.age = updateData.age;
        }

        if (updateData.email) {
          user.email = updateData.email;
        }

        // save changes
        writeUsers(users);

        res.writeHead(200);

        return res.end(
          JSON.stringify({
            message: "User updated successfully.",
          }),
        );
      } catch (err) {
        res.writeHead(400);

        return res.end(
          JSON.stringify({
            message: "Invalid JSON body.",
          }),
        );
      }
    });
  } else if (req.method === "DELETE" && req.url.startsWith("/user/")) {
    const id = Number(req.url.split("/")[2]);

    let users = readUsers();

    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      res.writeHead(404);

      return res.end(
        JSON.stringify({
          message: "User ID not found.",
        }),
      );
    }

    // delete user
    users.splice(userIndex, 1);

    // update json file
    writeUsers(users);

    res.writeHead(200);

    return res.end(
      JSON.stringify({
        message: "User deleted successfully.",
      }),
    );
  } else if (req.method === "GET" && req.url.startsWith("/user/")) {
    const id = Number(req.url.split("/")[2]);

    const users = readUsers();

    const user = users.find((user) => user.id === id);

    if (!user) {
      res.writeHead(404);

      return res.end(
        JSON.stringify({
          message: "User not found.",
        }),
      );
    }

    res.writeHead(200);

    return res.end(JSON.stringify(user));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Route not found." }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



// q2
