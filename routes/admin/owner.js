const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Owner = require("../../model/owner");
const registerValidation = require("../../validation/registerValidation");

router.get("/owners", async (req, res) => {
  try {
    const owners = await Owner.find().catch((err) => {
      console.error(err);
    });
    res.status(200).send(owners);
  } catch (error) {
    console.error(error);
  }
});

router.post("/add-owner", async (req, res) => {
  const { error } = registerValidation.registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const owner = new Owner({
    name: name,
    email: email,
    password: hashedPassword,
  });
  try {
    const result = await owner.save().catch((err) => {
      res.send("Owner with giving email is already exist!");
      throw err;
    });
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});

router.get("/owner/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const owner = await Owner.findById(id);
    if (owner === null) {
      return res.send("Owner with giving id is not exist!");
    }
    res.status(200).send(owner);
  } catch (error) {
    res.send("Ooops something goes wrong!");
    console.log(error);
  }
});

router.patch("/owner/:id/update", async (req, res) => {
  const ownerId = req.params.id;
  const { name, email } = req.body;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const updatedOwner = await Owner.findByIdAndUpdate(ownerId, {
      name: name,
      email: email,
      password: hashedPassword,
    }).catch((err) => {
      res.send("owner with giving id not exist!");
      console.log(err);
    });
    res.send(updatedOwner);
  } catch (error) {
    res.send("Ooops something goes wrong!");
    console.log(error);
  }
});

router.delete("/owner/:id/delete", async (req, res) => {
  const ownerId = req.params.id;
  try {
    const deleteOwner = await Owner.findByIdAndDelete(ownerId).catch((err) => {
      res.send("owner with giving id not exist!");
      console.log(err);
    });
    res.send(deleteOwner);
  } catch (error) {
    res.send("Ooops something goes wrong!");
    console.log(error);
  }
});

module.exports = router;
