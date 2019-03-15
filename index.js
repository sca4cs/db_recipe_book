const express = require('express');
const helmet = require('helmet');
const db = require('./data/dbConfig.js');

const dishes = require('./data/helpers/dishesDb');
const recipes = require('./data/helpers/recipesDb');

const server = express();
server.use(helmet());
server.use(express.json());


server.get('/', (req, res) => {
    res.send('Hello World');
});


// DISH ENDPOINTS .....................................................................
server.get('/dishes', (req, res) => {
    dishes.getDishes()
    .then(dishes => {
        res.status(200).json(dishes);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The dishes information could not be retrieved." });
    });
});

server.get('/dishes/:id', (req, res) => {
    const id = req.params.id;
    dishes.getDish(id)
    .then(dish => {
        if (dish.length === 0) {
            res.status(404).json({ message: "The dish with the specified ID does not exist." })
        } else {res.status(200).json(dish)}  
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The dish information could not be retrieved." });
    });
});

server.post('/dishes', (req, res) => {
    const dishData = req.body;
        if (!dishData.name) {
            res.status(400).json({ error: "Please provide a name for this dish." });
        } else if (Number(dishData.name.length) > 128) {
            res.status(400).json({ error: "Please provide a dish name that is less than 128 characters long." });
        } else {
            dishes.addDish(dishData)
            .then(dish => {
                res.status(201).json(dish);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: "There was an error while saving the dish to the database" });
            });
        }
  });

  server.delete('/dishes/:id', (req, res) => {
    const id = req.params.id;
    dishes.removeDish(id)
      .then(count => {
          if (count) {
            res.status(200).json({ message: "The dish was successfully deleted." });
          } else {
            res.status(404).json({ message: "The dish with the specified ID does not exist." })
          }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The dish could not be removed" })
        });
  });

  server.put('/dishes/:id', (req, res) => {
    const id = req.params.id;
    const dishData = req.body;
    if (!dishData.name) {
        res.status(400).json({ errorMessage: "Please provide a name for this dish." });
    } else if (Number(dishData.name.length) > 128) {
        res.status(400).json({ error: "Please provide a dish name that is less than 128 characters long." });
    } else {
        dishes.updateDish(id, dishData)
        .then(count => {
            if (count === 0) {
                res.status(404).json({ message: "The dish with the specified ID does not exist." });
            }  else {
                res.status(200).json({ message: "The dish was updated successfully." });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "The dish information could not be modified." })
        })
    }
  });


server.listen(8000, () => console.log('API running...'));