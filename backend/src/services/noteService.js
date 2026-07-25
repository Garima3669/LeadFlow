const Note = require("../models/Note");

const {
  createActivity,
} = require("./activityService");

const addNote = async ({
  leadId,
  content,
  user,
}) => {
  const note = await Note.create({
    lead: leadId,
    content,
    createdBy: user._id,
  });

  await createActivity({
    type: "NOTE_ADDED",
    description:
      `${user.name} added a note`,
    lead: leadId,
    createdBy: user._id,
  });

  return note;
};

const getLeadNotes = async (
  leadId
) => {
  return Note.find({
    lead: leadId,
  })
    .populate(
      "createdBy",
      "name email role"
    )
    .sort({
      createdAt: -1,
    });
};

module.exports = {
  addNote,
  getLeadNotes,
};