import Stats from '../models/Stats.js';

export const getStats = async (req, res, next) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) {
      stats = new Stats();
      await stats.save();
    }
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const incrementVisits = async (req, res, next) => {
  try {
    await Stats.findOneAndUpdate({}, { $inc: { visits: 1 } }, { upsert: true });
    res.json({ msg: 'Incremented' });
  } catch (err) {
    next(err);
  }
};