const express = require('express');
const bodyParser = require('body-parser');
const { use } = require('react');
const app = express();
const port = 8000;

app.use(bodyParser.json());

let users = [];
let counter = 1;

app.get('/test', (req, res) => {
    res.json(user);
});

app.post('/user', (req,res) => {
    let user = req.body;
    user.id = counter
    counter += 1;
    users.push(user);
    res.json({
    message: 'User added successfully',
    user: user
    });
});

app.patch('/user/:id',(req,res) => {
    let id = req.params.id;
    let updateUser = req.body;
    let selectedIndex = users.findIndex(user => user.id == id);
    
    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname;
    users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname;

    if(updateUser.firstname) {
        users[selectedIndex].firstname = updateUser.firstname;
    }
    if (updateUser.lastname) {
        users[selectedIndex].lastname = updateUser.lastname;
    }

    res.json({
        message: 'User updated successfully',
        data:{
            user: updateUser,
            indexUpdate: selectedIndex
        }
    })
})

app.delete('/user/:id', (req,res) => {
    let id = req.params.id;
    let selectedIndex = users.findIndex(user => user.id == id);
    user.splice(selectedIndex, 1);
    res.json({
        message: 'User deleted successfully',
        indexDelete: selectedIndex
    })
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});