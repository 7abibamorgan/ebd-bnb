// ebd bn'b: the listings API

// 1. Import express and create an app
import express from "express";

const app = express();

// ========== MIDDLEWARE ==========
// Log every request, then pass it on
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Read JSON request bodies into req.body
app.use(express.json());

// ========== DATABASE ==========
let listings = [
  { id: 1, title: "Cozy Studio in Zamalek", pricePerNight: 900 },
  { id: 2, title: "Sea View Flat in Alexandria", pricePerNight: 1500 },
  { id: 3, title: "Nile Houseboat", pricePerNight: 2200 },
];
let nextId = 4;

// ========== MODEL ==========
function getAllListings() {
  return listings;
}

function getListingById(id) {
  return listings.find((listing) => listing.id === id);
}

function addListing(data) {
  const listing = {
    id: nextId++,
    title: data.title,
    pricePerNight: data.pricePerNight,
  };
  listings.push(listing);
  return listing;
}

function updateListing(id, data) {
  const listing = getListingById(id);
  if (listing) {
    listing.title = data.title;
    listing.pricePerNight = data.pricePerNight;
  }
  return listing;
}

function removeListing(id) {
  const listing = getListingById(id);
  listings = listings.filter((item) => item.id !== id);
  return listing;
}

// ========== CONTROLLERS ==========
function handleGetAll(req, res) {
  res.json(getAllListings());
}

function handleGetOne(req, res) {
  const listing = getListingById(Number(req.params.id));
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  res.json(listing);
}

function handleCreate(req, res) {
  const data = req.body || {}; // no body sent? use an empty object
  if (!data.title || !data.pricePerNight) {
    return res.status(400).json({ error: "title and pricePerNight are required" });
  }
  res.status(201).json(addListing(data));
}

function handleUpdate(req, res) {
  const data = req.body || {};
  if (!data.title || !data.pricePerNight) {
    return res.status(400).json({ error: "title and pricePerNight are required" });
  }
  const listing = updateListing(Number(req.params.id), data);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  res.json(listing);
}

function handleDelete(req, res) {
  const listing = removeListing(Number(req.params.id));
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  res.status(204).end(); // done, nothing to send back
}

// ========== ROUTES ==========
app.get("/", (req, res) => {
  res.send("Welcome to ebd bn'b");
});

app.get("/api/listings", handleGetAll);
app.get("/api/listings/:id", handleGetOne);
app.post("/api/listings", handleCreate);
app.put("/api/listings/:id", handleUpdate);
app.delete("/api/listings/:id", handleDelete);

// ========== START ==========
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});