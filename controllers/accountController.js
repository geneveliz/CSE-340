const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const accountModel = require("../models/account-model");
const utilities = require("../utilities/index");

async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      notice: req.flash("notice"),
      errors: null,
      account_email: "",
    });
  } catch (error) {
    next(error);
  }
}

async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Registration",
      nav,
      notice: req.flash("notice"),
      errors: null,
      account_firstname: "",
      account_lastname: "",
      account_email: "",
    });
  } catch (error) {
    next(error);
  }
}

async function registerAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();

    // validation erro
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("account/register", {
        title: "Registration",
        nav,
        notice: req.flash("notice"),
        errors: errors.array(),
        account_firstname: req.body.account_firstname,
        account_lastname: req.body.account_lastname,
        account_email: req.body.account_email,
      });
    }

    // Hash pasword
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hashSync(req.body.account_password, 10);
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.');
      return res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        account_firstname: req.body.account_firstname,
        account_lastname: req.body.account_lastname,
        account_email: req.body.account_email,
      });
    }

    // Pasword
    const regResult = await accountModel.registerAccount(
      req.body.account_firstname,
      req.body.account_lastname,
      req.body.account_email,
      hashedPassword
    );

    if (regResult && regResult.rows && regResult.rows.length > 0) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${req.body.account_firstname}. Please log in.`
      );
      return res.status(201).redirect("/account/login");
    } else {
      // Validation form
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("account/register", {
        title: "Registration",
        nav,
        notice: req.flash("notice"),
        errors: null,
        account_firstname: req.body.account_firstname,
        account_lastname: req.body.account_lastname,
        account_email: req.body.account_email,
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
};