import express from 'express'
import env from 'dotenv'
import bodyParser from 'body-parser'
import bcrypt from "bcrypt"

const app = express()


env.config()

app.use(express.json())

const users = []

app.get('/users', (req, res) => {

    res.json(users)
})

app.post('/users', async(req, res) => {
    try {

        const {password, name} = req.body

    const hashed = await bcrypt.hash(password, 10)
    users.push({hashed, name})

    res.send({hashed, name})

    console.log(name, hashed)
        
    } catch (error) {

        console.log({message:error.message})
        
    }

    app.post('/login', async(req, res) =>{

        const {name, password} = req.body

        const people = users.find(users => name)
    

        try {

          if(name && await bcrypt.compare(password, people.hashed) ){

    
            res.status(201).send('success')


          }
          else{

            res.status(500).send('not allowed')

          }

            
        } catch (error) {

             res.status(500).send({errorMessage:error.message})
            
        }
    })
     
    

})

app.listen(process.env.PORT, (error) => {

    if(error) console.log({message:error.message})

    console.log(`app started, running on ${process.env.PORT}.....`)
})