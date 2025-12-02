const Material = require('../models/Material');

exports.createMaterial = async (req, res) => {
  try {
    const material = await Material.create(req.body);
    const populated = await material.populate(['subject', 'uploadedBy']);
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const { class: className, subject } = req.query;
    let query = {};
    
    if (className) query.class = className;
    if (subject) query.subject = subject;

    const materials = await Material.find(query).populate(['subject', 'uploadedBy']).sort('-createdAt');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: 'Material deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
