async function getAsk(username, password) {
    let header = new Headers()
    header.append('username', username)
    header.append('password', password)

    let options = {
        method: 'GET', 
        headers: header
    }

    await fetch('/getAsk', options)
            .then(async (data) => {
                let text = await data.text()
                
                if (text != 'Pedido não encontrado' || text != 'USUARIO/SENHA INVÀLIDA, POR FAVOR NÂO ALTERE/MODIFIQUE NADA DA PAGINA ISSO CAUSARA MAU FUNCIONAMENTO!') {
                    let obj = JSON.parse(text)
                    console.log(obj)
                    let food =  JSON.parse(obj.food)
                    console.log(food)

                    let requestContainer = document.querySelector('.request-container')

                    var total = 0
                    for (let i in food) {
                        requestContainer.innerHTML += `
                        <div class="request">
                            <div class="first-text-container">
                                <p class="quant-text">Quantidade</p>
                                <h1 class="quant-num">${food[i].quant}</h1>
                                <p>${food[i].val}</p>
                            </div>
            
                            <h1 class="food-name">${food[i].name}</h1>
                        
                        </div>
                        `

                        total += Number(food[i].quant) * Number(food[i].val)
                    }
                    let obs = document.querySelector('.ask-obs')
                    obs.textContent = '> '+ obj.observation
                    let time = document.querySelector('.ask-time')
                    time.textContent = '> Hora e data do pedido: ' + obj.time
                    let token = document.querySelector('.ask-token')
                    token.textContent = `> Token do pedido: ${obj.token}`
                    let totalContainer = document.querySelector('.ask-total')
                    totalContainer.textContent = '> Total: ' + total

                    let statusText = document.querySelector('.status-text')
                    statusText.textContent = obj.status
                    let image = document.querySelector('.status-image')

                    let consent = document.querySelector('.consentBttn')

                    if ( obj.status == 'Verificando Pedido!') {
                        image.src = '/images/waiting.gif'
                    } else if (obj.status == 'Seu pedido está sendo feito!') {
                        image.src = '/images/cooking.gif'
                    } else if (obj.status == 'Seu pedido saiu para entrega!') {
                        image.src = '/images/delivery.gif'
                    } else if (obj.status == 'Pedido rejeitado!') {
                        consent.style.display = 'block'
                        image.src = '/images/cancel.svg'
                    } else if (obj.status == 'Pedido aprovado!') {
                        image.src = '/images/approve.svg' 
                    } else if (obj.status == 'Pedido entregue!') {
                        consent.style.display = 'block'
                        image.src = '/images/approve.svg'
                    }
                }
            })
}

async function verifyAsk(username, password) {
    let header = new Headers()
    header.append('username', username)
    header.append('password', password)
    
    let options = {
        method: 'GET',
        headers: header
    }

    let res = await (await fetch('/verifyAsk', options)).text()
    console.log(res)
    
    return res
}

async function verify() {
    let check = localStorage.getItem('username')
    let check2 = localStorage.getItem('password')

    let alert = document.querySelector('.nologin')
    let screen = document.querySelector('.white-screen')

    if (check == null || check2 == null) {
        alert.style.display = 'flex'
        screen.style.display = 'block'
    } else {
        alert.style.display = 'none'
        screen.style.display = 'none'
        
        let hasAsk = await verifyAsk(check, check2)
        
        if (hasAsk == 'true') {
            let alert2 = document.querySelector('.hasAsk')
            alert2.style.display = 'flex'
            screen.style.display = 'block'
            console.log('Sem pedido feito')
        } else if (hasAsk == 'false') {
            await getAsk(check, check2)
            console.log('Pedido em andamento')
        }
    }
}

async function consent() {
    let username = localStorage.getItem('username')
    let password = localStorage.getItem('password')

    let data = new URLSearchParams()
    data.append('username', username)
    data.append('password', password)

    let options = {
        method: 'POST',
        body: data
    }

    await fetch('/consent', options)

    window.location.href = '/'
}