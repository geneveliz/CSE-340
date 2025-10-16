const noteModel = require("../models/noteModel");

async function showNotes(req, res) {
  const userId = req.user?.account_id;

  if (!userId) {
    return res.redirect("/account/login"); 
  }

  const notes = await noteModel.getNotesByUser(userId);
  res.render("contact/notes", { 
    title: "Your Notes",  
    notes 
  });
}

async function createNote(req, res) {
  const userId = req.user?.account_id;
  const { carId, content } = req.body;

  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  if (!content || content.trim() === "") {
    req.flash("error", "Note content cannot be empty.");
    return res.redirect("/notes");
  }

  try {
    await noteModel.addNote(userId, carId, content);
    res.redirect("/notes");
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).send("Server error");
  }
}

module.exports = {
  showNotes,
  createNote,
};
