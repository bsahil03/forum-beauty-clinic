import Info from '../models/Info.js';

export const getInfo = async (req, res) => {
  try {
    let info = await Info.findOne();
    if (!info) {
      info = new Info({
        name: 'Forum Beauty Care & Aesthetic Clinic',
        address: 'F7 Shree Ram Avenue near HP Petrol Pump, Kalikund Balva Road Dholka-Ahmedabad, 382225',
        contact: '9313706593',
        instagram: 'forum_beauty_aesthetic_clinic',
        ownerName: 'Sejal Dhumda'
      });
      await info.save();
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateInfo = async (req, res) => {
  try {
    const info = await Info.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(info);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};