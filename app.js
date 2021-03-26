const fetch = require('node-fetch');
const express = require('express');

const bodyParser = require('body-parser')


const app = express();
app.use(bodyParser.json());

app.get('/', async function(req, res) {
    await fetch('https://api.airtable.com/v0/appR9dvK14hO5FTYg/tabledemo', {
            headers: {
                'Authorization': 'Bearer keyUT1JCMYroyPOD3',
            },
        })
        .then(res => res.json())
        .then(json => {
            res.json(json);
        });
})


app.post('/update', async function(req, res) { //cập nhật 

    const { body } = req // nhận giá trị req
    const data = { "records": body }

    await fetch('https://api.airtable.com/v0/appR9dvK14hO5FTYg/tabledemo', {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Authorization': 'Bearer keyUT1JCMYroyPOD3',
                'Content-Type': 'application/json',
            },
        })
        .then(res => res.json()) // expecting a json response
        .then(json => {
            // console.log(json);
            res.json(json);
        });
})

app.get('/delete', async function(req, res) { //xoas
    const { body } = req;
    // res.json(body)
    await fetch(`https://api.airtable.com/v0/appR9dvK14hO5FTYg/tabledemo/${body.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer keyUT1JCMYroyPOD3',
            }
        })
        .then(res => res.json()) // expecting a json response
        .then(json => {
            // console.log(json);
            res.json(json);
        });
})

app.post('/create-02', async function(req, res) {
    const data = { "records": [] } //tạo đối tượng rỗng
    const { body } = req // nhận giá trị req

    body.forEach(element => { //format data
        const field = { "fields": element }
        data.records.push(field)
    });
    // res.json(data)
    await fetch('https://api.airtable.com/v0/appR9dvK14hO5FTYg/tabledemo', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Authorization': 'Bearer keyUT1JCMYroyPOD3',
                'Content-Type': 'application/json',

            },
        })
        .then(res => res.json()) // expecting a json response
        .then(json => {
            res.json(json);
        });
})
app.get('/graphql', async(req, res) => {
    await fetch('http://localhost:8080/v1/graphql', {
            method: 'POST',
            body: JSON.stringify({
                query: `
            query MyQuery {
              test {
                id
                age
                name
              }
            }
          `,
                variables: {},
                operationName: "MyQuery"
            })
        })
        .then(res => res.json())
        .then(json => {
            res.json(json);
        });
})
app.post('/graphql/create', async(req, res) => {
    const fullname = req.body.fullname;

    if (fullname != null) {
        await fetch('http://localhost:8080/v1/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: `
                mutation MyMutation {
                  insert_profile_one(object: {fullname: "${fullname}"}) {
                    id
                  }
                }
              `,
                    variables: {},
                    operationName: "MyMutation"
                })
            })
            .then(res => res.json())
            .then(json => {
                res.json(json);
            });
    } else {
        res.send('error')
    }

})
app.delete('/graphql/delete/:id', async(req, res) => {

    const id = req.params.id;

    if (id != null) {
        await fetch('http://localhost:8080/v1/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: `
                    mutation MyMutation {
                      delete_profile(where: {id: {_eq: ${id} }}) {
                        affected_rows
                      }
                    }
                  `,
                    variables: {},
                    operationName: "MyMutation"
                })
            })
            .then(res => res.json())
            .then(json => {
                res.json(json);
            });
    } else {
        res.send('error')
    }

})
app.post('/graphql/update', async(req, res) => {
        const { body } = req;
        if (body.id != null) {
            await fetch('http://localhost:8080/v1/graphql', {
                    method: 'POST',
                    body: JSON.stringify({
                        query: `
                    mutation MyMutation {
                      update_profile(where: {id: {_eq:${body.id} }}, _set: {fullname: "${body.fullname}"}) {
                        affected_rows
                      }
                    }
                  `,
                        variables: {},
                        operationName: "MyMutation"
                    })
                })
                .then(res => res.json())
                .then(json => {
                    res.json(json);
                });
        } else {
            res.send('error')
        }
    })
    // app.get('/demo', (req, res) => {
    // res.format({
    //         'text/html': function() {
    //             res.send('<h1>fsjlkasjflaksdjf</h1>')
    //         }
    //     })
    // res.links({
    //     next: 'http://api.example.com/users?page=2',
    //     last: 'http://api.example.com/users?page=5'
    // })
    // res.location('http://example.com')
    // res.redirect('http://example.com')
    // res.status(500).send({ error: 'something blew up' })
    // res.send(Buffer.from('<p>some html</p>'))
    // res.vary('User-Agent').render('docs')
    // })
app.listen(3000, '0.0.0.0');