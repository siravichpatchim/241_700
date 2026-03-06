const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const { createConnection } = require('mysql2');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

const port = 8000;

/**
app.get('/testdb', (req, res) => {
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8700
    }).then((conn) => {
        conn
        .query('SELECT * FROM users')
        .then((results) =>{
            res.json(results[0]);
        }).catch((err) => {
            res.json({ error: err.message});
        });
    })
})
*/
let conn = null;
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8700
    });
    console.log('Connected to MySQL database');
}

//path = GET /users สำหรับด get ข้อมูล users ทั้งหมด
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users');
    res.json(results[0]);
})

//path = POST /users สำหรับเพิ่ม user ใหม่
app.post('/users', async (req, res) => {
    try {
        let user = req.body;
        const results = await conn.query('INSERT INTO users SET ?', user)
        res.json({
            message: 'User created successfully',
            data: results[0]
        });
    } catch (error){
        console.error('Error connecting to the database:', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.get('/testdb-new', async (req, res) => {
    try {

        const results = await conn.query('SELECT * FROM users');
        res.json(results[0]);
    } catch (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

app.get('/users/:id', async (req, res) => {
    try{
        let id = req.params.id;
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id);
        if (results[0].length === 0){
            throw { statusCode: 404, message: 'User not found'};
        }
        res.json([0][0]);
    }catch (error){
        console.error('Error fetching user:', error);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Error fetching user'
        });
    }
})

app.put('/users/:id', async (req, res)=>{
    try{
        let id = req.params.id;
        let updataUser = req.body;
        const results = await conn.query('UP');
    }catch (error){
        console.error('Error fetching user:', error);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Error fetching user'
        });
    }
})

/** 
let users = [];
let counter = 1;
*/

/**
 GET /users - ดึงข้อมูลผู้ใช้ทั้งหมด
 POST /users - เพิ่มผู้ใช้
 GET /users/:id - ดึงขเอมูลผู้ใช้ตาม ID
 PUT /users/:id - แก้ไขข้อมูลผู้ใช้ตาม ID ที่บันทึก
 DELETE /user/:id - ลบผู้ใช้ตาม ID ที่บันทึก
 */

/**
// path: = GET /users
app.get('/users',(req,res) => {
    res.json(users);
});

// path = POST /user
app.post('/user',(req, res) => {
    let user = req.body;
    user.id =counter
    counter +=1;

    users.push(user);
    res.json({
        message: 'User added successfully',
        user: user
    });
});

// path = PUT /user/:id
app.patch('/user/:id', (req, res) => {
    let id  = req.params.id;
    let updateUser = req.body;
    //หา user ที่จาก id ที่ส่งมา
    let selectedIndex = users.findIndex(user => user.id == id);

    //users update
    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname;
    users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname;
    
    if (updateUser.firstname) {
        users[selectedIndex].firstname = updateUser.firstname;
    }if (updateUser.lastname) {
        users[selectedIndex].lastname = updateUser.lastname;
    }

    res.json({
        message: 'User update successfully',
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
        }
    });
    //send updated users to back

})

app.delete('/users/:id', (req, res) => {
    let id = req.params.id;
    // หา index จาก id ที่ต้องการลบ
     let selectedIndex = users.findIndex(user => user.id == id);
     
    // ลบ user ออกจาก users
     users.splice(selectedIndex, 1);
    res.json({
        message: 'User update successfully',
        indexDelete: selectedIndex
    });
})
*/

app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on http://localhost:${port}`)
});