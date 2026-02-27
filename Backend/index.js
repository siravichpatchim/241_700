const express = require('express');
const bodyParser =  require('body-parser');
const mysql = require('mysql2/promise'); 
const app = express();

app.use(bodyParser.json());

const port = 8000;

let conn = null;
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8700
    });
    console.log('connected to MySQL database');
}

app.get('/users',async (req,res) => {
    const results = await conn.query('SELECT * FORM users');
    res.json(results[0]);
});

app.post('/users', async (req, res) =>{
    try{
        let user = req.body;
        const results = await conn.query('INSERT INTO users SET ?', user);
        console.log('results:', results);
        res.json({
            message: 'User added successfully',
            data: results[0]
        });
    } catch(error) {
        console.error('Error inserting user:',error);
        res.status(500).json({message: 'Error adding user'});
    }
})

app.get('/users/:id',async (req,res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('SELECT * FORM users WHERE id = ?',id);
        if(results[0].length === 0) {
            throw { statusCode: 404, message: 'User not found'};
        }
        res.json(results[0][0])
    } catch(error) {
        console.error('Error fetching user:',error);
        let statusCode = error.statusCode ||500;
        res.status(statusCode).json({
            message: error.message || 'Error fetching user'
        });
    }
})

app.put('/users/:id', async (req,res) => {
    try{
        let id = req.params.id;
        let updateUser = req.body;
        const results = await conn.query('UPDATE users SET ? EHERE id = ?', [updateUser, id]);
        res.json({
            message: 'User updated successfully',
            data: results[0]
        });
    } catch(error) {
        console.error('Error updating user:', error);
        res.status(500).json({message: 'Error updating user'});
    }
})



app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on http://localhost:${port}`);
});

app.delete('/users/:id', async (req, res) => {
    try{
        let id = req.params.id;
        const results = await conn.query('DELETE FORM users WHERE id = ?', id);
        res.json({
            message: 'User deleted successfully',
            data: results[0]
        })
    } catch (error) {
        console.error('Error deleting user:',error);
        res.status(500).json({message: 'Error deleting user'});
    }
})