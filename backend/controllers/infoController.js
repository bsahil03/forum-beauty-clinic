import Info from '../models/Info.js';

export const getInfo = async (req, res) => {
  try {
    let info = await Info.findOne();
    if (!info) {
      info = new Info();
      await info.save();
    }
    res.json(info);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateInfo = async (req, res) => {
  try {
    const info = await Info.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(info);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Update failed' });
  }
};