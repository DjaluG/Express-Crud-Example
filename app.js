const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

app.use(bodyParser.json());

const sequelize = new Sequelize('your_database', 'your_username', 'your_password', {
  host: 'localhost',
  dialect: 'postgres',
});

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

sequelize.sync();


app.post('/items', async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.json(newItem);
  } catch (error) {
    res.status(400).json({ error: 'Error creating the item' });
  }
});

// Read all items
app.get('/items', async (req, res) => {
  const items = await Item.findAll();
  res.json(items);
});

// Read a specific item
app.get('/items/:id', async (req, res) => {
  const id = req.params.id;
  const item = await Item.findByPk(id);

  if (!item) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    res.json(item);
  }
});

app.put('/items/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [updatedRows] = await Item.update(req.body, {
      where: { id },
    });

    if (updatedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      const updatedItem = await Item.findByPk(id);
      res.json(updatedItem);
    }
  } catch (error) {
    res.status(400).json({ error: 'Error updating the item' });
  }
});

app.delete('/items/:id', async (req, res) => {
  const id = req.params.id;
  const deletedItem = await Item.findByPk(id);

  if (!deletedItem) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    await deletedItem.destroy();
    res.json({ message: 'Item deleted' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
