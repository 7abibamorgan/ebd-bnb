import express from "express";

const app = express();

const listings = [
  { id: 1, title: "Cozy Studio in Zamalek", pricePerNight: 900 },
  { id: 2, title: "Sea View Flat in Alexandria", pricePerNight: 1500 },
  { id: 3, title: "Nile Houseboat", pricePerNight: 2200 },
];

app.get("/", (req, res) => {
  res.send("Welcome to ebd bn'b");
});

app.get("/api/listings", (req, res) => {
  res.json(listings);
});

app.get("/api/listings/:id", (req, res) => {
  const id = Number(req.params.id);
  const listing = listings.find((l) => l.id === id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  res.json(listing);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});