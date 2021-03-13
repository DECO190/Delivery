function openFinal() {
    let a = document.querySelector('.end')
    a.style.display = 'flex'
    a.classList.remove('down')
    a.classList.add('up')
    
    let all = document.querySelector('.cart-container')
    all.style.display = 'none'
}

function closeFinal() {
    let a = document.querySelector('.end')
    a.classList.remove('up')
    a.classList.add('down')

    setTimeout(() => {
        a.style.display = 'none'
    }, 800)

    closeCart()
}

async function newlive(token) {
    socket.emit('newRequest', {token: token})
}

async function makeRequire() {

    let res = []
    for (let i in card) {
        if (card[i].quant != "0") {
            res.push(card[i])
            console.log(card[i])
        }
    }
    
    let food = JSON.stringify(res)

    let cep = document.querySelector('#final-cep').value
    let number = document.querySelector('#final-num').value
    let street = document.querySelector('#final-rua').value
    let comp = document.querySelector('#final-comp').value

    let username = localStorage.getItem('username')
    let password = localStorage.getItem('password')

    
    let pay1 = document.querySelector('#pay-box1')
    let pay2 = document.querySelector('#pay-box2')
    let pay3 = document.querySelector('#pay-box3') 
    
    let observation = document.querySelector('#obs').value

    let data = new FormData()
    
    if ( pay1.checked ) {
        data.append('pay', 'credit')
    } else if ( pay2.checked ) {
        data.append('pay', 'debit')
    } else if ( pay3.checked ) {
        data.append('pay', 'money')
    }

    data.append('cep', cep)
    data.append('number', number)
    data.append('street', street)
    data.append('comp', comp)

    data.append('username', username)
    data.append('password', password)

    data.append('food', food)

    data.append('observation', observation)

    let options = {
        method: 'POST',
        body: new URLSearchParams(data)
    }

    await fetch('/generateRequire', options)
        .then(async data => {
            let text = await data.text()
            console.log(text)

            let div = text.split('||')

            if (div[0] == 'Sucesso') {
                let container = document.querySelector('.final-container-checked')
                container.style.display = 'flex'

                let token = document.querySelector('.food-token')
                token.textContent = 'Token Pedido: ' +  div[1]

                newlive(div[1])
            } else {
                await alert(text)
            }



        })
        .catch(async data => {
            let text = await data.text()
            alert('Error:', text)
            
        })
}

