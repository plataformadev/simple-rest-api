const express = require('express');

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));;
app.use(express.static('public'));

let nextID = 1;
let contacts = []

class Contact {
    constructor({ id, name, email, phone }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}



app.get('/contacts', (req, res) => {
    const { name } = req.query;
    const result = name != null && name.length > 0 ? contacts.filter((contact) => contact.name.startsWith(name)) : contacts;
    res.json(result);
})


app.get('/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const record = contacts.find((contact) => contact.id === id);
    if (record) {
        return res.json(record);
    }
    return res.sendStatus(404);
})

app.post('/contacts', (req, res) => {
    const contact = new Contact(req.body);
    contact.id = nextID++;
    contacts.push(contact);
    res.status(201).json(contact);
})


app.put('/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const contact = new Contact(req.body);
    if (id != contact.id) {
        return res.sendStatus(412);
    }
    contacts = contacts.map(record => {
        if (record.id === contact.id) {
            return contact;
        }
        return record;
    })

    return res.sendStatus(204);
})
app.delete('/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const contact = contacts.find((contact) => contact.id === id);
    if (!contact) {
        return res.sendStatus(412);
    }
    contacts = contacts.filter(record => record.id !== id)

    return res.sendStatus(204);

})


app.listen(PORT, () => console.log(`Servidor rodando na porta 3000`));