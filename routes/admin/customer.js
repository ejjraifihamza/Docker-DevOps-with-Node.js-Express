const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Customer = require("../../model/customer");
const registerValidation = require("../../validation/registerValidation");

router.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find().catch((err) => {
      console.error(err);
    });
    res.status(200).send(customers);
  } catch (error) {
    console.error(error);
  }
});

router.post("/add-customer", async (req, res) => {
  const { error } = registerValidation.registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const customer = new Customer({
    name: name,
    email: email,
    password: hashedPassword,
  });
  try {
    const result = await customer.save().catch((err) => {
      res.send("Owner with giving email is already exist!");
      throw err;
    });
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});

router.get("/customer/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findById(id);
    if (customer === null) {
      return res.send("Owner with giving id is not exist!");
    }
    res.status(200).send(customer);
  } catch (error) {
    res.send("Ooops something goes wrong!");
    console.log(error);
  }
});

router.patch("/customer/:id/update", async (req, res) => {
  const customerId = req.params.id;
  const { name, email } = req.body;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, {
      name: name,
      email: email,
      password: hashedPassword,
    }).catch((err) => {
      res.send("Customer with giving id not exist!");
      console.log(err);
    });
    res.send(updatedCustomer);
  } catch (error) {
    res.send("Ooops something goes wrong!");
    console.log(error);
  }
});

router.delete("/customer/:id/delete", async (req, res) => {
  const customerId = req.params.id;
  try {
    const deleteCustomer = await Customer.findByIdAndDelete(customerId).catch(
      (err) => {
        res.send("owner with giving id not exist!");
        console.log(err);
      }
    );
    res.send(deleteCustomer);
  } catch (error) {
    res.send("Ooops something goes wrong!");
    console.log(error);
  }
});

module.exports = router;
