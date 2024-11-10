const { Wedding } = require('../models/weddings');
const mongoose = require('mongoose'); 
const { User } = require('../models/user'); 

exports.getAllWeddings = async (req, res) => {
    try {
        const weddingList = await Wedding.find({}, 'name1 name2 weddingDate user');

        if (!weddingList) {
            return res.status(500).json({ success: false });
        }

        res.status(200).send(weddingList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.getWeddingById = async (req, res) => {
  console.log("Request ID:", req.params.id); 
  try {
      const wedding = await Wedding.findById(req.params.id);
      if (!wedding) {
          return res.status(404).json({ message: 'The wedding with the given ID was not found.' });
      }
      res.status(200).send(wedding);
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
};


exports.submitWeddingForm = async (req, res) => {
    const { userId, weddingData } = req.body;
    if (!userId || !weddingData) {
        return res.status(400).json({ message: "User ID and wedding data are required." });
    }

    try {
        const validUserId = mongoose.Types.ObjectId(userId); 

        const newWedding = new Wedding({
            userId: validUserId, 
            ...weddingData, 
        });
        await newWedding.save(); 
        return res.status(201).json({ message: "Wedding form submitted successfully!", wedding: newWedding });
    } catch (error) {
        console.error("Error saving wedding form:", error);
        return res.status(500).json({ message: "There was an error saving the wedding form." });
    }
};

exports.confirmWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }

    wedding.weddingStatus = "Confirmed";
    wedding.confirmedAt = new Date();
    await wedding.save();

    res.status(200).json({ message: 'Wedding confirmed', wedding });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getConfirmedWeddings = async (req, res) => {
  try {
    const confirmedWeddings = await Wedding.find({ weddingStatus: 'Confirmed' });
    res.status(200).json(confirmedWeddings);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

  exports.declineWedding = async (req, res) => {
    try {
      const wedding = await Wedding.findById(req.params.id);
      if (!wedding) {
        return res.status(404).json({ message: 'Wedding not found' });
      }
      wedding.status = "declined";
      await wedding.save();
      res.status(200).json({ message: 'Wedding declined' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
};

//Dates

exports.getAvailableDates = async (req, res) => {
  try {
    const bookedDates = await Wedding.find({ isBooked: true }).select('date');
    res.status(200).json(bookedDates);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.bookDate = async (req, res) => {
  const { date, userId } = req.body;
  try {
    const weddingDate = await Wedding.findOneAndUpdate(
      { date },
      { isBooked: true, userId: mongoose.Types.ObjectId(userId) },
      { new: true, upsert: true } // Creates the document if it doesn't exist
    );
    res.status(200).json({ message: 'Date booked successfully', weddingDate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//AdminDates
exports.addAvailableDate = async (req, res) => {
  const { weddingDate } = req.body;
  try {
      const newDate = new Wedding({ weddingDate });
      await newDate.save();
      res.status(201).json({ message: 'Date added successfully', weddingDate: newDate });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.removeAvailableDate = async (req, res) => {
  const { id } = req.params;
  try {
      await Wedding.findByIdAndDelete(id);
      res.json({ message: 'Date removed successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

//Wedding dates only
exports.getWeddingSummary = async (req, res) => {
  try {
    // Fetch weddings with selected fields only
    const weddings = await Wedding.find({}, 'name1 name2 weddingDate'); // No parameter for ID expected here

    res.status(200).json({ success: true, data: weddings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error, could not retrieve weddings.' });
  }
};


  