const Material = require('../models/Material');

exports.createMaterial = async (req, res) => {
  try {
    const materialData = {
      ...req.body,
      uploadedBy: req.user._id
    };
    
    const material = await Material.create(materialData);
    const populated = await material.populate(['subject', 'uploadedBy']);
    
    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('materialUploaded', {
        material: populated,
        class: material.class
      });
    }
    
    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const { class: className, section, subject } = req.query;
    let query = {};
    
    if (className) query.class = className;
    if (section) {
      query.$or = [
        { section: section },
        { section: 'All Sections' }
      ];
    }
    if (subject) query.subject = subject;

    const materials = await Material.find(query).populate(['subject', 'uploadedBy']).sort('-createdAt');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markMaterialAsViewed = async (req, res) => {
  try {
    const { studentClass, studentSection } = req.body;
    
    await Material.updateMany(
      {
        class: studentClass,
        $or: [
          { section: studentSection },
          { section: 'All Sections' }
        ]
      },
      { isNewMaterial: false }
    );
    
    res.json({ message: 'Materials marked as viewed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNewMaterialsCount = async (req, res) => {
  try {
    const { class: className, section } = req.query;
    
    const count = await Material.countDocuments({
      class: className,
      $or: [
        { section: section },
        { section: 'All Sections' }
      ],
      isNewMaterial: true
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('materialDeleted', {
        materialId: req.params.id
      });
    }
    
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ message: error.message });
  }
};
