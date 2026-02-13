import Stats from '../models/Stats.js';

export const incrementVisits = async (req, res) => {
  try {
    await Stats.findOneAndUpdate(
      {},
      { $inc: { visits: 1 } },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getStats = async (req, res) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) {
      stats = new Stats();
      await stats.save();
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};