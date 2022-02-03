const router = require("express").Router();
const multer = require("multer");

const Hotel = require("../../model/hotel");
const hotelSchemaValidation = require("../../validation/hotelInputValidation");
const deleteFile = require("../../utils/deleteFile");

const storageConfig = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storageConfig });

router.get("/", (req, res) => {
  res.redirect("/hotels");
});

router.get("/hotels", async (req, res) => {
  const hotels = await Hotel.find();
  if (!hotels)
    return res.status(400).send("Sorry We Can Not Get Your Request!");
  res.status(200).send(hotels);
});

router.post("/add-hotel", upload.array("hotelImages", 8), async (req, res) => {
  if (req.files.length < 4 || req.files.length > 8) {
    const unwantedUploadedImages = req.files;
    deleteFile.deleteFile(unwantedUploadedImages);
    return res
      .status(400)
      .send("Please Choose Between 4 And 8 Photos For Each Hotel!");
  }
  const { error } = hotelSchemaValidation.addHotelValidation(req.body);
  if (error) {
    const unwantedUploadedImages = req.files;
    deleteFile.deleteFile(unwantedUploadedImages);
    return res.status(400).send(error.details[0].message);
  }
  const existHotel = await Hotel.find({ name: req.body.name });
  if (existHotel.length > 0) {
    const unwantedUploadedImages = req.files;
    deleteFile.deleteFile(unwantedUploadedImages);
    return res.status(400).send("Hotel With Given Name Is Already Exist!");
  }
  const uploadedImageFiles = req.files;
  let images = [];
  for (const uploadedImageFile of uploadedImageFiles) {
    images.push(uploadedImageFile.filename);
  }
  const { name, place, stars } = req.body;
  const insertHotel = new Hotel({
    name: name,
    place: place,
    stars: stars,
    imagesPath: images,
  });
  const hotel = await insertHotel.save();
  if (!hotel) return res.status(400).send("Sorry Hotel Does Not Added!");
  res.status(200).send("Hotel Added Successfully!");
});

router.get("/hotel/:id", async (req, res) => {
  const hotelId = req.params.id;
  const hotel = await Hotel.findById(hotelId);
  if (!hotel)
    return res.status(400).send("Sorry We Can Not Find Hotel With Given Id!");
  res.status(200).send(hotel);
});

router.patch(
  "/hotel/:id/update",
  upload.array("hotelImages", 8),
  async (req, res) => {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel)
      return res.status(400).send("Sorry We Can Not Find Hotel With Given Id!");
    let hotelImages = hotel.imagesPath;
    deleteFile.deleteExistingFile(hotelImages);
    const uploadedImageFiles = req.files;
    let images = [];
    for (const uploadedImageFile of uploadedImageFiles) {
      images.push(uploadedImageFile.filename);
    }
    const { name, place, stars } = req.body;
    const updateHotel = await Hotel.updateOne(
      { _id: hotelId },
      { name: name, place: place, stars: stars, imagesPath: images }
    );
    if (updateHotel) return res.status(200).send("Hotel Updated Successfully!");
    res.send("Ooops Something Goes Wrong!");
  }
);

router.delete("/hotel/:id/delete", async (req, res) => {
  const hotelId = req.params.id;
  const hotel = await Hotel.findById(hotelId);
  if (!hotel)
    return res.status(400).send("Sorry We Can Not Find Hotel With Given Id!");
  await Hotel.deleteOne({ _id: hotelId });
  let hotelImages = hotel.imagesPath;
  deleteFile.deleteExistingFile(hotelImages);
  res.status(200).send("delete hotel");
});

module.exports = router;
