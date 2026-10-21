
/**
 * Midterm API Project - COMP229
 * Equipment REST API
 */
import express from 'express';

const app = express();
app.use(express.json());

let equipment = [
  { name: 'USB Microphone', category: 'audio', brand: 'AudioLab', year: 2021, quantity: 5 },
  { name: 'LED Panel', category: 'lighting', brand: 'BrightWorks', year: 2022, quantity: 4 },
  { name: 'Network Switch', category: 'networking', brand: 'NetCore', year: 2020, quantity: 3 },
  { name: 'Cable Tester', category: 'tools', brand: 'TestPro', year: 2019, quantity: 6 },
  { name: 'Studio Headphones', category: 'audio', brand: 'SoundCraft', year: 2023, quantity: 8 },

  // Personalized items: student ID ends in 2 (years 2000–2009)
  { name: 'Digital Video Camera', category: 'video', brand: 'Canon', year: 2005, quantity: 2 },
  { name: 'Portable Projector', category: 'presentation', brand: 'Epson', year: 2008, quantity: 3 }
];

// Check that an ID is a valid array index.
function getIndex(id) {
  if (!/^\d+$/.test(id)) return -1;

  const index = Number(id);
  if (!Number.isSafeInteger(index) || index >= equipment.length) {
    return -1;
  }

  return index;
}

// Validate equipment fields.
function isValidEquipment(item) {
  return item &&
    typeof item.name === 'string' && item.name.trim() !== '' &&
    typeof item.category === 'string' && item.category.trim() !== '' &&
    typeof item.brand === 'string' && item.brand.trim() !== '' &&
    Number.isInteger(item.year) &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 0;
}

// 1. GET all equipment
app.get('/api/equipment', (req, res) => {
  res.status(200).json(equipment);
});

// 2. GET equipment filtered by category
// Keep this route before /:id.
app.get('/api/equipment/filter', (req, res) => {
  const category = req.query.category;

  if (typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({
      message: 'Please provide a category query.'
    });
  }

  const results = equipment.filter(
    item => item.category.toLowerCase() === category.trim().toLowerCase()
  );

  res.status(200).json(results);
});

// 3. GET one item by array index
app.get('/api/equipment/:id', (req, res) => {
  const index = getIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Equipment not found.' });
  }

  res.status(200).json(equipment[index]);
});

// 4. POST a new equipment item
app.post('/api/equipment', (req, res) => {
  if (!isValidEquipment(req.body)) {
    return res.status(400).json({
      message: 'Provide name, category, brand, integer year, and non-negative integer quantity.'
    });
  }

  const newItem = {
    name: req.body.name.trim(),
    category: req.body.category.trim(),
    brand: req.body.brand.trim(),
    year: req.body.year,
    quantity: req.body.quantity
  };

  equipment.push(newItem);

  res.status(201).json(newItem);
});

// 5. PUT (update) an equipment item by array index
app.put('/api/equipment/:id', (req, res) => {
  const index = getIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Equipment not found.' });
  }

  if (!isValidEquipment(req.body)) {
    return res.status(400).json({
      message: 'Provide name, category, brand, integer year, and non-negative integer quantity.'
    });
  }

  equipment[index] = {
    name: req.body.name.trim(),
    category: req.body.category.trim(),
    brand: req.body.brand.trim(),
    year: req.body.year,
    quantity: req.body.quantity
  };

  res.status(200).json(equipment[index]);
});

// 6. DELETE an equipment item by array index
app.delete('/api/equipment/:id', (req, res) => {
  const index = getIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Equipment not found.' });
  }

  const deletedItem = equipment.splice(index, 1)[0];

  res.status(200).json({
    message: 'Equipment deleted successfully.',
    equipment: deletedItem
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '127.0.0.1', err => {
  if (err) {
    console.error(`Cannot start on port ${PORT}: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Server is running on http://localhost:${PORT}`);
});
