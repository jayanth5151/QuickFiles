const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require('path');


const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://jayanth:passw0rd@angular.rg7p2cp.mongodb.net/filemanager?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// File schema
const fileSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});
const File = mongoose.model("File", fileSchema);

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ===== Middleware to protect routes =====
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "secret123");
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
// ===== List files uploaded by the user =====
app.get("/files", authMiddleware, async (req, res) => {
  const files = await File.find().select("name createdAt");
  res.json(files);
});



// ===== Upload route =====
app.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const newFile = new File({
    name: req.file.originalname,
    data: req.file.buffer,
    contentType: req.file.mimetype,
    uploadedBy: req.userId,
  });

  await newFile.save();
  res.json({ message: "File uploaded successfully", fileId: newFile._id });
});

// Signup route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = new User({ email, password: hashed });
    await user.save();
    res.json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: "1h" });
  res.json({ token });
});

// Protected route example
app.get("/profile", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "secret123");
    res.json({ message: "Welcome!", userId: decoded.id });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Download a file by its ID
app.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const file = await File.findById( req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    res.set({
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${file.name}"`,
    });
    res.send(file.data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Delete a file by ID
app.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    await File.deleteOne({ _id: req.params.id });
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// Serve Angular frontend
app.use(express.static(path.join(__dirname, '../QuickFiles-frontend-app/dist/quickfiles-app')));

// For all other routes, send Angular index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../QuickFiles-frontend-app/dist/quickfiles-app/index.html'));
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
