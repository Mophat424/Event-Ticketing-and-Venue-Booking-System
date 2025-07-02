// import express from "express";
// import {
//   getAllVenues,
//   getVenueById,
//   createVenue,
//   updateVenue,
//   deleteVenue,
// } from "./venue.controller";

// const router = express.Router();

// router.get("/", getAllVenues);
// router.get("/:id", getVenueById);
// router.post("/", createVenue);
// router.put("/:id", updateVenue);
// router.delete("/:id", deleteVenue);

// export default router;




//AUTH
import express from "express";
import {
  getVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from "./venue.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Everyone can view venues
router.get("/", getVenues);

// Only admins can create/update/delete venues
router.post("/", authenticate, createVenue);
router.put("/:id", authenticate, updateVenue);
router.delete("/:id", authenticate, deleteVenue);

export default router;
