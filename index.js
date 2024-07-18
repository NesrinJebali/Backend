const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

const app = express(); // Initialize Express

app.use(cors({
  origin: 'http://localhost:4200', // Adjust according to your Angular app's URL
  credentials: true
}));
app.use(bodyParser.json()); // Add body parser middleware to parse JSON requests

mongoose.connect("mongodb+srv://nesrinejebali297:cTZ95a0TPqsN6mT1@cluster0.t808edr.mongodb.net/jebalinesrin297", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected successfully");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

const FormationInfo = mongoose.model('FormationInfo', {
  id: {
    type: Number,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  ImageUrl: {
    type: String,
  },
  prix: {
    type: Number,
  },
});

app.post('/direct', async (req, res) => {
  let check = await FormationInfo.findOne({ id: req.body.id });
  if (check) {
    return res.status(400).json({ success: false, errors: "Existing Formation found with the same id" });
  }

  const formation = new FormationInfo({
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    ImageUrl: req.body.ImageUrl,
    prix: req.body.prix,
  });

  await formation.save();

  res.json({ success: true, formation });
});
// formations de langues
const FormationLangue = mongoose.model('FormationLangue', {
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ImageUrl: {
    type: String,
    required: true,
  },
  prix: {
    type: Number,
    required: true,
  },
});

app.post('/Langue', async (req, res) => {
  try {
    console.log("Received request for /Langue:", req.body); // Log incoming request body

    let check = await FormationLangue.findOne({ id: req.body.id });
    if (check) {
      return res.status(400).json({ success: false, errors: "Existing Formation found with the same id" });
    }

    const formation = new FormationLangue({
      id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      ImageUrl: req.body.ImageUrl,
      prix: req.body.prix,
    });

    await formation.save();
    res.json({ success: true, formation });
  } catch (error) {
    console.error('Error creating formation:', error);
    res.status(500).json({ success: false, errors: 'Server error' });
  }
});



const Users = mongoose.model('Users', {
  fullname: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  }
});


app.post('/signup', async (req, res) => {
  try {
    // Log the incoming request body
    console.log("Received signup request:", req.body);

    // Check if the user with the same email already exists
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      console.log("User already exists with email:", req.body.email);
      return res.status(400).json({ success: false, errors: "Existing user found with the same email address" });
    }

    // If not, create a new user
    const user = new Users({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();
    console.log("User created successfully:", user);

    const data = {
      user: {
        id: user.id
      }
    };
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id
        }
      };
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.status(401).json({ success: false, errors: "Wrong Email Id" });
  }
});
const Contact = mongoose.model('Contact',{
  id: {
    type: Number,
  },
  email: {
    type: String,
    unique: true,
  },
  password:{
    type:String,
    unique:true,
  },
  message:{
    type:String,
  },
  tel:{
    type:String,
  }
})
app.post('/Contact', async (req, res) => {
  console.log("Received Contact request:", req.body); // Log incoming request body

  if (!req.body.email || !req.body.message || !req.body.password || !req.body.tel) {
    return res.status(400).json({ success: false, errors: "Missing required fields" });
  }

  try {
    const contact = new Contact({
      id: req.body.id,
      email: req.body.email,
      password: req.body.password,
      message: req.body.message,
      tel: req.body.tel,
    });

    await contact.save();
    res.json({ success: true, contact });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      res.status(400).json({ success: false, errors: "Email already exists" });
    } else {
      console.error("Error during sending message:", error);
      res.status(500).json({ success: false, errors: "Server error" });
    }
  }
});
const Inscription = mongoose.model('Inscription', {
  id: {
    type: Number,
  },
  fullname: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  formation_name: {
    type: String,
  },
  prix: {
    type: Number,
  }
});


app.post('/Inscription', async (req, res) => {
  console.log("Received inscription request:", req.body); // Log incoming request body

  if (!req.body.email || !req.body.fullname) {
    return res.status(400).json({ success: false, errors: "Missing required fields" });
  }

  try {
    const inscription = new Inscription({
      id: req.body.id,
      fullname: req.body.fullname,
      email: req.body.email,
      formation_name: req.body.formation_name,
      prix: req.body.prix,
    });

    await inscription.save();
    res.json({ success: true, inscription });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      res.status(400).json({ success: false, errors: "Email already exists" });
    } else {
      console.error("Error during inscription:", error);
      res.status(500).json({ success: false, errors: "Server error" });
    }
  }
});
const PORT = process.env.PORT || 9992;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});