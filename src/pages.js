const db = require('./database/db.js')
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const FormData = require('form-data');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const { client } = require('./database/db.js');

module.exports = {

    index(req, res) {
        return res.render('index')
    }, 

    menu(req, res ) {
        let username = req.headers.username
        let password = req.headers.password
        return res.render('menu')
    },

    async login(req, res) {
        return res.render('login')
    },

    async register(req, res) {
        return res.render('register')
    },

    async createUser(req, res){
        let data = req.body
        let checkUsername = await db('client').select('username').where({username: data.username})
        let checkCpf = await db('client').select('cpf').where({cpf: data.cpf})
        let checkPhone = await db('client').select('phone').where({phone: data.phone})

        if (data.phone.length < 11 || checkPhone.length > 0) {
            return res.send('Telefone indisponivel!')
        }

        if (data.cpf.length != '14') {
            return res.send('CPF inválido!')
        } 

        if ( data.username.length < 4 ) {
            return res.send('Nome de usuario inválido!')
        }

        if ( data.password.length < 6) {
            return res.send('Senha muito curta!')
        }

        if (data.name.length < 4) {
            return res.send('Nome inválido!')
        }
 
        if (checkUsername.length > 0) {
            return await res.send('Nome de usuario indisponivel!')
        } else if ( checkCpf.length > 0 ) { 
            return await res.send('Este CPF já está sendo utilizado!')
        } else {
            let hash = await bcrypt.hash(data.password, 1)
            await db('client').insert({name: data.name, cpf: data.cpf, username: data.username, password: hash, phone: data.phone})
            await res.status(200).send('Usuario criado com sucesso!')
        }

    },

    async loginUser(req,res) {
        let username = req.body.username
        let password = req.body.password

        if (password == 'coco de galinha' && username == 'restaurante do deco') {
            return res.send('admin')
        }

        let check = await db('client').select('*').where({username: username})

        if (username.length > 0, password.length > 0) {
            if (check.length > 0 ) {
                let checkPassword  = await bcrypt.compare(password, check[0].password)
                if (checkPassword) {
                    res.send('200AL')
                } else {
                    return res.send('Usuario ou senha não encontrados!')
                }

            } else {
                return res.send('Usuario ou senha não encontrados!')
            }
        } else {
            return res.send('Campos inválidos!')
        }
    },

    async generateRequire(req, res){
        let card = {
            '1': {
                name: 'Batata Frita',
                val: '14.50',
                quant: '0',
                id: '1'
            },
            '2': {
                name: 'Picanha fatiada',
                val: '29.99',
                quant: '0',
                id: '2'
            },
            '3': {
                name: 'Porção pasteis',
                val: '20.50',
                quant: '0',
                id: '3'
            },
            '4': {
                name: 'Frango a passarinho',
                val: '24.00',
                quant: '0',
                id: '4'
            } 
        }

        
        let f = req.body.food
        
        let food = await JSON.parse(f)

        if (food.length <= 0) {
            return res.status('412').send('Comida não selecionada!')
        }
        if (req.body.cep == '' && req.body.number == '' && req.body.street == '' && req.body.comp == '') {
            return res.status('412').send('Endereço inválido!')
        }

        if (req.body.cep.length == 0 || req.body.cep.length > 9) {
            return res.status('412').send('Endereço inválido!')
        }

        for (let i in food) {
            food[i].val = await card[food[i].id].val
        }

        let local = JSON.stringify({
            cep: await req.body.cep,
            number: await req.body.number,
            street: await req.body.street,
            comp: await req.body.comp
        })

        let username = await req.body.username
        let password = await req.body.password

        let d = await new Date();
        let time = `${d.getHours()}:${d.getMinutes()} | ${d.getDay()}/${d.getMonth()}`;

        let requestID = await crypto.randomBytes(15).toString('hex');
        
        let check = await db('client').select('*').where({ username: username})
        if (check.length > 0) {
            let compare = await bcrypt.compare(password, check[0].password)
            if (compare) {
                if (check[0].requestid == null || check[0].requestid == ''){

                    let data = new URLSearchParams()
                    data.append('request', JSON.stringify({food: JSON.stringify(food), local: local, requestid: requestID, status: 'Verificando pedido!', time: time, observation: req.body.observation }))

                    let options = {
                        method: 'POST',
                        body: data
                    } 

                    await fetch('http://localhost:5500/makeSocketRequire', options)

                    await db('request').insert({food: JSON.stringify(food), local: local, requestid: requestID, status: 'Verificando pedido!', time: time, observation: req.body.observation })
                    await db('client').where({username: username}).update({requestid: requestID})
                    await db('allrequest').insert({username: username, requestid: requestID})
                    await res.send(`Sucesso||${requestID}`)
                } else {
                    return res.status('405').send('Você já tem um pedido em andamento!')
                }
            } else {
                return res.status('405').send('USUARIO/SENHA INVÀLIDA, POR FAVOR NÂO ALTERE/MODIFIQUE NADA DA PAGINA ISSO CAUSARA MAU FUNCIONAMENTO!')
            }
        } else {
            return res.status('405').send('USUARIO/SENHA INVÀLIDA, POR FAVOR NÂO ALTERE/MODIFIQUE NADA DA PAGINA ISSO CAUSARA MAU FUNCIONAMENTO!')
        }
        
    },

    async verifyAsk(req, res) {
        let username = req.headers.username
        let password = req.headers.password

        let checkUser = await db('client').select('password').where({ username: username })

        if (checkUser.length > 0) {
            let checkPassword = await bcrypt.compare(password, checkUser[0].password)

            if (checkPassword) {
                let checkAsk = await db('client').select('requestid').where({username: username})

                if (checkAsk[0].requestid == '' || checkAsk[0].requestid == null) {
                    res.status('200').send('true')
                } else {
                    res.status('200').send('false')
                }

            } else {
                return res.status('405').send('USUARIO/SENHA INVÀLIDA, POR FAVOR NÂO ALTERE/MODIFIQUE NADA DA PAGINA ISSO CAUSARA MAU FUNCIONAMENTO!')
            }

        } else {
            return res.status('405').send('USUARIO/SENHA INVÀLIDA, POR FAVOR NÂO ALTERE/MODIFIQUE NADA DA PAGINA ISSO CAUSARA MAU FUNCIONAMENTO!')
        }

    },

    async followAskRender(req, res) {
        res.render('follow')
    },

    async getAsk(req, res) {
        let username = req.headers.username
        let password = req.headers.password

        let user = await db('client').select('*').where({username: username})

        if (user.length > 0) {
            let check = await bcrypt.compare(password, user[0].password)

            if (check) {
                let ask = await db('request').select('*').where({requestid: user[0].requestid})
                
                if (ask.length > 0) {
                    let final = {
                        food: ask[0].food,
                        time: ask[0].time,
                        observation: ask[0].observation,
                        token: ask[0].requestid,
                        status: ask[0].status
                    }

                    return res.send(JSON.stringify(final))
                } else {
                    return res.status('404').send('Pedido não encontrado')
                }

            } else {
                return res.status('405').send('USUARIO/SENHA INVÀLIDA, POR FAVOR NÂO ALTERE/MODIFIQUE NADA DA PAGINA ISSO CAUSARA MAU FUNCIONAMENTO!')
            }
        }
    },

    async admin(req, res) {
        res.render('admin')
    },

    async askInfo(req, res) {
        let username = req.headers.username
        let password = req.headers.password

        if (password == 'coco de galinha' && username == 'restaurante do deco') {

            let ask = await db('request').select('*')
            
            return res.send(JSON.stringify(ask))

        } else {
            return res.send('Não autorizado!').status('405')
        }
    }, 

    async getUserInfo(req, res) {
        let username = req.headers.username
        let password = req.headers.password
        
        let token = req.headers.token

        if (password == 'coco de galinha' && username == 'restaurante do deco') {

            let ask = await db('allrequest').select('*').where({requestid: token})
            let client = await db('client').select('*').where({username: ask[0].username})

            if (client.length > 0) {
                return res.send(JSON.stringify(client[0]))
            } else {
                return res.send('Informações de usuario não disponivel!')
            }

        } else {
            return res.send('Não autorizado!').status('405')
        }
    },

    async attAsk(req, res) {
        console.log(req.body)
        let username = req.body.username
        let password = req.body.password

        if (username == 'restaurante do deco' && password == 'coco de galinha') {
            await db('request').update({ status: req.body.status }).where({ requestid: req.body.token })
        }

    },

    async consent(req, res) {
        let username = req.body.username
        let password = req.body.password

        let user = await db('client').select('*').where({username: username})

        if (user.length > 0) {
            let check = await bcrypt.compare(password, user[0].password)

            if (check) {
                await db('client').update({ requestid: ''  }).where({ username: username })
                return res.send('200AL')
            } else {
                return res.status('405').send('USUARIO/SENHA INVÀLIDA, POR FAVOR NÂO ALTERE/MODIFIQUE NADA DA PAGINA ISSO CAUSARA MAU FUNCIONAMENTO!')
            }
        }
    }
}