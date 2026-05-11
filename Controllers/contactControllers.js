const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../Utils/dbUtils');

// GET all contacts for logged-in user
const getContacts = async (req, res) => {
  try {
    const db = await readDB();
    const userContacts = db.contacts.filter((c) => c.userId === req.user.id);
    return res.status(200).json(userContacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    return res.status(500).json({ message: 'Server error fetching contacts.' });
  }
};

// GET single contact
const getContact = async (req, res) => {
  try {
    const db = await readDB();
    const contact = db.contacts.find(
      (c) => c.id === req.params.id && c.userId === req.user.id
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }
    return res.status(200).json(contact);
  } catch (error) {
    console.error('Get contact error:', error);
    return res.status(500).json({ message: 'Server error fetching contact.' });
  }
};

// CREATE contact
const createContact = async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Contact name is required.' });
    }

    const db = await readDB();

    const newContact = {
      id: uuidv4(),
      userId: req.user.id,
      name,
      email: email || '',
      phone: phone || '',
      address: address || '',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.contacts.push(newContact);
    await writeDB(db);

    return res.status(201).json({ message: 'Contact created successfully.', contact: newContact });
  } catch (error) {
    console.error('Create contact error:', error);
    return res.status(500).json({ message: 'Server error creating contact.' });
  }
};

// UPDATE contact
const updateContact = async (req, res) => {
  try {
    const db = await readDB();
    const index = db.contacts.findIndex(
      (c) => c.id === req.params.id && c.userId === req.user.id
    );

    if (index === -1) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    const { name, email, phone, address, notes } = req.body;

    db.contacts[index] = {
      ...db.contacts[index],
      name: name || db.contacts[index].name,
      email: email !== undefined ? email : db.contacts[index].email,
      phone: phone !== undefined ? phone : db.contacts[index].phone,
      address: address !== undefined ? address : db.contacts[index].address,
      notes: notes !== undefined ? notes : db.contacts[index].notes,
      updatedAt: new Date().toISOString(),
    };

    await writeDB(db);
    return res.status(200).json({ message: 'Contact updated.', contact: db.contacts[index] });
  } catch (error) {
    console.error('Update contact error:', error);
    return res.status(500).json({ message: 'Server error updating contact.' });
  }
};

// DELETE contact
const deleteContact = async (req, res) => {
  try {
    const db = await readDB();
    const index = db.contacts.findIndex(
      (c) => c.id === req.params.id && c.userId === req.user.id
    );

    if (index === -1) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    db.contacts.splice(index, 1);
    await writeDB(db);

    return res.status(200).json({ message: 'Contact deleted successfully.' });
  } catch (error) {
    console.error('Delete contact error:', error);
    return res.status(500).json({ message: 'Server error deleting contact.' });
  }
};

module.exports = { getContacts, getContact, createContact, updateContact, deleteContact };