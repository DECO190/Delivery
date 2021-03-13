var ask = {}

function strip(string) { 
    return string.replace(/^\s+|\s+$/g, ''); 
} 

function convertStt(data) {
    if (data == 'Aprovar pedido!') {
        return 'Pedido Aprovado!'
    } else if (data == 'Rejeitar pedido!') {
        return 'Pedido rejeitado!'
    } else if ( data == 'Pedido sendo preparado!') {
        return 'Pedido sendo preparado!'
    } else if (data == 'Pedido saiu para entrega!') {
        return 'Pedido saiu para entrega!'
    } else if (data == 'Pedido entregue!') {
        return 'Pedido entregue!'
    }
}

async function renderNewRequest(data) {
    ask[data.requestid] = data
    let requestContainer = document.querySelector('.request-container')
    let local = JSON.parse(data.local)
    requestContainer.innerHTML += `
        <div onclick = 'openInfo(event)' class= "request waiting" id = '${data.requestid}'>
            <h1> Pedido: ${(data.requestid)[0]}${(data.requestid)[1]}${(data.requestid)[2]}</h1>
            <p>> Data: ${(data.time)} </p>
            <p>> ${local.street}</p>
        </div>
    `
}

var socket = io('http://localhost:5500', {query: { username: localStorage.getItem('username'), password: localStorage.getItem('password')}})

let username = localStorage.getItem('username')
let password = localStorage.getItem('password')
let data = {
    password: password,
    username: username
}
socket.emit('adminId', data)

socket.on('getRequest', data => {
    console.log(data)
    renderNewRequest(data)
})



async function getInfo() {
    let username = localStorage.getItem('username') 
    let password = localStorage.getItem('password')

    let headers = new Headers()
    headers.append('username', username)
    headers.append('password', password)

    let options = {
        method: 'GET', 
        headers: headers
    }

    await fetch('askInfo', options)
        .then(async data => {
            let text = await data.text()
            if (text == 'Não autorizado!') {
                return  alert(text)
            }
            let arr =  await JSON.parse(text)
            for (let i in arr) {
                ask[arr[i].requestid] = await arr[i]
            }
            
            let status; 
            let cl;
            let requestContainer = document.querySelector('.request-container')
            for (let a in ask) {
                status = ask[a].status
                console.log(status)
                if (status == 'Pedido aprovado!') {
                    cl = 'approve'
                } else  if (status == 'Pedido rejeitado!') {
                    cl = 'reject'
                } else  if (status == 'Pedido sendo preparado!') {
                    cl = 'preparing'
                } else  if (status == 'Pedido saiu para entrega!') {
                    cl = 'out'
                } else if (status == 'Pedido entregue!') {
                    cl = 'done'
                } else if (status == 'Verificando pedido!') {
                    cl = 'waiting'
                }
                let local = JSON.parse(ask[a].local)

                requestContainer.innerHTML += `
                <div onclick = 'openInfo(event)' class= "request ${cl} appear" id = '${ask[a].requestid}'>
                    <h1> Pedido: ${(ask[a].requestid)[0]}${(ask[a].requestid)[1]}${(ask[a].requestid)[2]}</h1>
                    <p>> Data: ${(ask[a].time)} </p>
                    <p>> ${local.street}</p>
                </div>
                `
            }
        })
}

function openInfo(event) {
    
    let client = event.currentTarget
    let askContainer = document.querySelector('.ask-container')

    let tokentElement = document.querySelector('.requestid')
    tokentElement.textContent = client.id

    let foodArr = JSON.parse(ask[client.id].food)
    console.log(foodArr, '<<<')
    var total = 0
    for (let i in foodArr) {
        askContainer.innerHTML += `
            <div class="ask">
                <div class="first-text-container">
                    <p class="quant-text">Quantidade</p>
                    <h1 class="quant-num">${foodArr[i].quant}</h1>
                    <p>${foodArr[i].val}</p>
                </div>

                <h1 class="food-name">${foodArr[i].name}</h1>
            </div>
        ` 
        total += Number(foodArr[i].val) * Number(foodArr[i].quant)
    } 

    let totalElement = document.querySelector('.total')
    totalElement.textContent = `Total: ${total}`

    let allAtt = document.querySelectorAll('.attStatus')
    console.log(allAtt)
    for (let i in allAtt) {
        try {
            allAtt[i].classList.remove('attSelected')
        } catch(e) {
            continue
        }
    }

    let active;
    console.log(client.classList.contains('reject'))
    if (client.classList.contains('waiting')) {

    } else if (client.classList.contains('approve')) {

        active = document.querySelector('.Sapprove')
        active.classList.add('attSelected')

    } else if (client.classList.contains('reject')) {

        active = document.querySelector('.Sreject')
        active.classList.add('attSelected')

    } else if (client.classList.contains('preparing')) {

        active = document.querySelector('.Spreparing')
        active.classList.add('attSelected')

    } else if (client.classList.contains('out')) {
        
        active = document.querySelector('.Sout')
        active.classList.add('attSelected')
    } else if (client.classList.contains('done')) {
        active = document.querySelector('.Sdone')
        active.classList.add('attSelected')
    }

    let local = JSON.parse(ask[client.id].local)

    let textContainer = document.querySelector('.textInfos')
    textContainer.innerHTML += `
        <div class="linha" class="textInfo"></div>
        <p class="textInfo">> Observação: ${ask[client.id].observation}</p>
        <p class="textInfo">> Data: ${ask[client.id].time}</p>
        <p class="textInfo">> Token do pedido: ${ask[client.id].requestid}</p>
        <div class="linha" class="textInfo"></div>
        <p class="textInfo">> Rua: ${local.street}</p>
        <p class="textInfo">> CEP: ${local.cep}</p>
        <p class="textInfo">> Complemento: ${local.comp}</p>
        <p class="textInfo">> Numero: ${local.number}</p>
    `
    
    let screen = document.querySelector('.white-screen')
    screen.style.display = 'flex'
    screen.classList.add('up')
    screen.classList.remove('down')
    
    
    let container = document.querySelector('.askInfo-container')
    container.classList.add('up')
    container.classList.remove('down')

    setTimeout(() => {
        container.style.display = 'flex'
    }, 800)
    

}

async function closeInfo() {
    let container = document.querySelector('.askInfo-container')
    container.classList.add('down')
    container.classList.remove('up')

    
    let screen = document.querySelector('.white-screen')
    screen.classList.add('up')
    screen.classList.remove('down')
    screen.style.display = 'none'
    
    setTimeout(() => {
        container.style.display = 'none'
    }, 1000)

    let texts = document.querySelectorAll('.textInfo')
    for (let i in texts) {
        try {
            texts[i].remove()
        } catch(e) {
            continue
        }
    }

    let asks = document.querySelectorAll('.ask')
    for (let a in asks) {
        try {
            asks[a].remove()
        } catch(e) {
            continue
        }
    }

    let status = document.querySelectorAll('.attStatus')
    for (let r in status) {
        try {
            status[r].classList.remove('attSelected')
        } catch(e) {
            continue
        }
    }

    let linhas = document.querySelectorAll('.linha')
    for (let y in linhas) {
        try {
            linhas[y].remove()
        } catch(e) {
            continue
        }
    }

}

async function getUser() {
    let requestid = document.querySelector('.requestid').textContent

    let headers = new Headers()

    headers.append('username', localStorage.getItem('username'))
    headers.append('password', localStorage.getItem('password'))
    headers.append('token', requestid)

    let options = {
        method: 'GET',
        headers: headers
    }

    await fetch('getUserInfo', options) 
            .then(async data => {
                let text = await data.text()
                if (text == 'Informações de usuario não disponivel!') {
                    alert(text)
                } else {
                    let obj = await JSON.parse(text)
                    alert(`Username: ${obj.username} || Nome: ${obj.name} || Telefone: ${obj.phone} || CPF: ${obj.cpf}`)
                }
            })

}   

// ==========================================================================================================================

async function changeStt(event) {
    let askID = document.querySelector('.requestid').textContent
    console.log(askID)
    let askC = document.getElementById(askID)
    console.log(askC, '<<<< element')
    askC.classList.remove('approve')
    askC.classList.remove('reject')
    askC.classList.remove('preparing')
    askC.classList.remove('out')
    askC.classList.remove('done')
    
    let status = document.querySelectorAll('.attStatus')
    for (let a in status) {
        try {
            status[a].classList.remove('attSelected')
        } catch(e) {
            continue
        }
    }

    let element = event.currentTarget
    element.classList.add('attSelected')



    if (strip(element.textContent) == 'Aprovar pedido!') {
        askC.classList.add('approve')
    } else  if (strip(element.textContent) == 'Rejeitar pedido!') {
        askC.classList.add('reject')
    } else  if (strip(element.textContent) == 'Pedido sendo preparado!') {
        askC.classList.add('preparing')
    } else  if (strip(element.textContent) == 'Pedido saiu para entrega!') {
        askC.classList.add('out')
    } else if (strip(element.textContent) == 'Pedido entregue!') {
        askC.classList.add('done')
    }

    let bodyData = new URLSearchParams()

    bodyData.append('username', localStorage.getItem('username'))
    bodyData.append('password', localStorage.getItem('password'))

    bodyData.append('token', askID)
    bodyData.append('status', convertStt(strip(element.textContent)))

    let options = {
        method: 'POST',
        body: bodyData
    }
    console.log()
    await fetch('/attAsk', options)
}

function appearRequest(cl) {
    let elements = document.querySelectorAll('.'+cl)

    for (let i in elements) {
        try {
            elements[i].style.display = 'flex'
        } catch {
            continue
        }
    }
} 

function filter(event) {
    console.log(event.currentTarget)

    let filter = event.currentTarget
    let all = document.querySelectorAll('.request')
    
    if (filter.id != 'filter2') {
    
        for (let a in all) {
            try {
                all[a].style.display = 'none'
            } catch {
                continue
            }
        }
        
        if (filter.id == 'filter1') {
            appearRequest('waiting')
        } else if (filter.id == 'filter3') {
            appearRequest('done')
        } else if (filter.id == 'filter4') {
            appearRequest('preparing')
            appearRequest('out')
            appearRequest('approve')
        }

    } else {
        for (let b in all) {
            try {
                all[b].style.display = 'flex'
            } catch {
                continue
            }
        } 
    }
 

    
}