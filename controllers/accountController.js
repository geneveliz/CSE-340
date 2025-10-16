const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const accountModel = require("../models/account-model");
const utilities = require("../utilities");


// login view
async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
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


// registration view
async function buildRegister(req, res, next) {
  try {
    const nav = await utilities.getNav();
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


// Create new account
async function registerAccount(req, res, next) {
  try {
    const nav = await utilities.getNav();
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

    const hashedPassword = await bcrypt.hash(req.body.account_password, 10);

    // Default account type is 'client' - not admin
    const accountType = 'client';

    const regResult = await accountModel.registerAccount(
      req.body.account_firstname,
      req.body.account_lastname,
      req.body.account_email,
      hashedPassword,
      accountType
    );

    if (regResult?.rowCount === 1) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${req.body.account_firstname}. Please log in.`
      );
      return res.status(201).redirect("/account/login");
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(500).render("account/register", {
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
    console.error("Error in registerAccount:", error);
    next(error);
  }
}


// Handle login process
async function loginAccount(req, res, next) {
  try {
    const nav = await utilities.getNav();

    const emailRaw = req.body.account_email || "";
    const email = emailRaw.trim().toLowerCase();
    const password = req.body.account_password;

    console.log("Login attempt with:", email);

    const accountData = await accountModel.getAccountByEmail(email);

    if (!accountData) {
      console.log("No account found.");
      req.flash("notice", "No account found with that email.");
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        notice: req.flash("notice"),
        errors: [{ msg: "No account found with that email." }],
        account_email: email,
      });
    }

    const passwordMatch = await bcrypt.compare(password, accountData.account_password);
    if (!passwordMatch) {
      req.flash("notice", "Email or password incorrect.");
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        notice: req.flash("notice"),
        errors: [{ msg: "Email or password incorrect." }],
        account_email: email,
      });
    }

    const payload = {
      account_id: accountData.account_id,
      firstname: accountData.account_firstname,
      account_type: accountData.account_type,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("jwt", token, { httpOnly: true });

    req.flash("notice", "Login successful.");
    res.redirect("/account");
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
}


// account management dashboard
async function buildAccountManagement(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const token = req.cookies.jwt;

    if (!token) {
      req.flash("notice", "Please log in first.");
      return res.redirect("/account/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const accountData = await accountModel.getAccountById(decoded.account_id);

    res.render("account/account-management", {
      title: "Account Management",
      nav,
      accountData,
      notice: req.flash("notice"),
    });
  } catch (error) {
    console.error("buildAccountManagement error:", error);
    next(error);
  }
}


// account update view
async function getUpdateView(req, res, next) {
  try {
    const account = await accountModel.getAccountById(req.params.id);
    const nav = await utilities.getNav();
    res.render("account/update-account", {
      title: "Update Account",
      nav,
      account,
    });
  } catch (error) {
    next(error);
  }
}


// Update account information
async function updateAccountInfo(req, res, next) {
  try {
    const { account_id, firstname, lastname, email } = req.body;
    const result = await accountModel.updateAccount(account_id, firstname, lastname, email);

    if (result) {
      req.flash("notice", "Account updated successfully.");
      res.redirect("/account/");
    } else {
      req.flash("notice", "Update failed.");
      res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    next(error);
  }
}


// Update account password
async function updatePassword(req, res, next) {
  try {
    const { account_id, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await accountModel.updatePassword(account_id, hashedPassword);

    if (result) {
      req.flash("notice", "Password updated.");
      res.redirect("/account/");
    } else {
      req.flash("notice", "Password update failed.");
      res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    next(error);
  }
}


// password update form
async function buildPasswordUpdateForm(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render('account/update-password', {
      title: 'Change Password',
      nav,
      errors: null,
      notice: req.flash('notice'),   
      account: { account_id: req.params.id }  
    });
  } catch (error) {
    next(error);
  }
}


// Logout the user
function logoutAccount(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildAccountManagement,
  getUpdateView,
  updateAccountInfo,
  updatePassword,
  loginAccount,
  logoutAccount,
  buildPasswordUpdateForm,
};
