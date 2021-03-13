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

function restFood() {
    let all = document.querySelectorAll('.request')
    for (let i in all) {
        try {
            all[i].remove()
        } catch (err){

        }
    }
}

function attTotal() {
    let total = 0
    for (let i in card) {
        total += Number(card[i].quant) * Number(card[i].val)
    }
    
    let a = document.querySelector('#total-cart-text')
    a.textContent = `Total: R$ ${total}`

    let b = document.querySelector('.total')
    b.textContent = `R$ ${total}` 
}

function foodAdd() {
    
    let id = document.querySelector('.food-id').textContent
    let quant = document.querySelector('#quant-value').textContent
    card[id].quant = (Number(card[id].quant) + Number(quant))
    
    let cart = document.querySelector('.total')
    let cartNum = cart.textContent.split(' ')[1]

    cart.textContent = `R$ ${(Number(cartNum) + (Number(card[id].val) * Number(quant))).toFixed(2)}`

    closeInfo()
}

function calc() {
    restFood()

    let contentCont = document.querySelector('.content-container')
    
    let cart = document.querySelector('.cart-container')
    cart.style.display = 'flex'
    cart.classList.remove('down')
    cart.classList.add('up')
    
    let filter = document.querySelectorAll('.filter')
    try {

        for (let i in filter) {
            filter[i].style.filter = 'blur(1px)'
            filter[i].style.opacity = '30%'
        }
    } 
    catch (err) {
        
    }

    let requestCont = document.querySelector('.request-container')
    for (let i in card) {
        if (card[i].quant != '0') {
            requestCont.innerHTML += `
            <div class="request">
                <div class="first-text-container">
                    <p class="quant-text">Quantidade</p>
                    <h1 class="quant-num">${card[i].quant}</h1>
                    <p>R$ ${(Number(card[i].quant) * Number(card[i].val)).toFixed(2)}</p>
                </div>

                <h1 id = '${i}'  class="food-name">${card[i].name}</h1>

                <div class="delete-food" onclick = 'deleteFood(event)'>
                    <img src="/images/close.svg" alt="">
                </div>
            </div>
            `
        }
    }
    attTotal()
}

function deleteFood(event) {
    let foodName = event.currentTarget.previousElementSibling
    card[foodName.id].quant = '0'
    foodName.parentNode.style.display = 'none'
    attTotal()
}

function closeCart() {
    let cart = document.querySelector('.cart-container')
    cart.classList.add('down')
    cart.classList.remove('up')

    setTimeout(() => {
        cart.style.display = 'none'
    }, 800)

    let filter = document.querySelectorAll('.filter')
    try {

        for (let i in filter) {
            filter[i].style.filter = 'blur(0px)'
            filter[i].style.opacity = '100%'
        }
    } 
    catch (err) {
        
    }
}
