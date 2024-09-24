const express = require("express");
const { track } = require("./models/track.model"); 
const { sequelize } = require("./lib/index");
const {user} = require("./models/user.model");
const { isAsyncFunction } = require("util/types");
const app = express();
app.use(express.json());
let tracks = [
  {
    name: "Raabta",
    genre: "Romantic",
    release_year: 2012,
    artist: "Arijit Singh",
    album: "Agent Vinod",
    duration: 4,
  },
  {
    name: "Naina Da Kya Kasoor",
    genre: "Pop",
    release_year: 2018,
    artist: "Amit Trivedi",
    album: "Andhadhun",
    duration: 3,
  },
  {
    name: "Ghoomar",
    genre: "Traditional",
    release_year: 2018,
    artist: "Shreya Ghoshal",
    album: "Padmaavat",
    duration: 3,
  },
  {
    name: "Bekhayali",
    genre: "Rock",
    release_year: 2019,
    artist: "Sachet Tandon",
    album: "Kabir Singh",
    duration: 6,
  },
  {
    name: "Hawa Banke",
    genre: "Romantic",
    release_year: 2019,
    artist: "Darshan Raval",
    album: "Hawa Banke (Single)",
    duration: 3,
  },
  {
    name: "Ghungroo",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "War",
    duration: 5,
  },
  {
    name: "Makhna",
    genre: "Hip-Hop",
    release_year: 2019,
    artist: "Tanishk Bagchi",
    album: "Drive",
    duration: 3,
  },
  {
    name: "Tera Ban Jaunga",
    genre: "Romantic",
    release_year: 2019,
    artist: "Tulsi Kumar",
    album: "Kabir Singh",
    duration: 3,
  },
  {
    name: "First Class",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 4,
  },
  {
    name: "Kalank Title Track",
    genre: "Romantic",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 5,
  },
];
async function fetchAllTracks() {
  let allTracks = await track.findAll();
  return { tracks: allTracks };
}
async function addNewTrack(trackData) {
  let newTrack = await track.create(trackData);
  return { newTrack };
}
async function addNewUser(userData){
  let newData = await user.create(userData);
  return {newData}
}
async function updateTrackById(updatedTrackData, id) {
  let trackDetails = await track.findOne({ where: { id } });
  if (!trackDetails) {
    return {};
  }
  trackDetails.set(updatedTrackData);
  let updatedTrack = await trackDetails.save();
  return { message: "track updated", updatedTrack };
};
async function updateUserById(newUserData, id){
  let userDetails = await user.findOne({ where: { id } });
  if (!userDetails) {
    return {};
  }
  userDetails.set(newUserData);
  let updatedUser = await userDetails.save();
  return { message: "user updated", updatedUser };
}
async function deleteTrackById(id) {
  let destroyedTrack = await track.destroy({ where: { id } });
  if (destroyedTrack===0) {
    return {};
  }
  return { message: "track updated"};
}
app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await track.bulkCreate(tracks);
    res.status(200).json({ message: "Database seeding sucessful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error seeding the data", error: error.message });
  }
});
app.get("/tracks", async (req, res) => {
  try {
    let result = await fetchAllTracks();
    if (result.tracks.length === 0) {
      return res.status(404).json({ message: "No tracks found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.post("/tracks/new", async (req, res) => {
  try {
    let newTrack = req.body.newTrack;
    let result = await addNewTrack(newTrack);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.post("/tracks/update/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newTrackData = req.body;
    let result = await updateTrackById(newTrackData, id);
    if (!result.message) {
      return res.status(404).json({ message: "Track not found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.post("/tracks/delete", async (req, res) => {
  try {
    let id = parseInt(req.body.id);
    let result = await deleteTrackById( id);
    if (!result.message) {
      return res.status(404).json({ message: "Track not found" });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/users/new",async (req,res)=>{
  try{let newUser = req.body.newUser;
  let result = await addNewUser(newUser);
  return res.status(200).json(result);}
catch(error){
  return res.status(500).json({error:error.message});
}
});

app.post("/user/update/:id",async (req,res)=>{
  try{
  let newUserData = req.body;
  let id = parseInt(req.params.id); 
  let result = await updateUserById(newUserData,id);
  return res.status(200).json(result);}
catch(error){
  return res.status(500).json({error:error.message});
}
});
app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});