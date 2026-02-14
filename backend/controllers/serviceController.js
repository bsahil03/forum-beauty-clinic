import Service from '../models/Service.js';

export const getServices = async (req, res) => {
  try {
    let service = await Service.findOne();
    if (!service) {
      service = new Service({ data: {} });
      await service.save();
    }
    res.json(service.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateServices = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      {},
      { data: req.body },
      { upsert: true, new: true }
    );
    res.json(service.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Update failed' });
  }
};