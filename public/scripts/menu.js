function openFood(event) {
    let contentCont = document.querySelector('.content-container')
    contentCont.style.filter = 'blur(1px)'
    contentCont.style.opacity = '80%'
    
    let all = document.querySelector('.info-container')
    all.style.display = 'flex'
    

    let main = document.querySelector('#infomain')
    main.classList.add('up')
    main.classList.remove('down')
    
    setInterval(() => {
        main.style.display = 'flex'
    }, 500)

    let target = event.currentTarget
    let dataCont = target.childNodes[3].childNodes
    
    let id = dataCont[1].textContent
    let img = dataCont[3].textContent
    let food = dataCont[5].textContent
    let descript = dataCont[7].textContent

    let a = document.querySelector('.image-info')
    a.style.background = `url('${img}')`
    a.style.backgroundRepeat = 'repeat'
    a.style.backgroundSize = 'contain'
    a.style.boxShadow = '0px 5px 20px rgba(0, 0, 0, 0.150)'

    let b = document.querySelector('.info-h1')
    b.textContent = food

    let c = document.querySelector('.info-desc')
    c.textContent = descript

    let d = document.querySelector('.food-id')
    d.textContent = id
}

function closeInfo() {
    let main = document.querySelector('#infomain')
    // all.style.display = 'none'
    main.classList.remove('up')
    main.classList.add('down')

    setTimeout(() => {
        let all = document.querySelector('.info-container')
        all.style.display = 'none'
        main.style.display = 'none'
    }, 800)

    let contentCont = document.querySelector('.content-container')
    contentCont.style.filter = 'blur(0px)'
    contentCont.style.opacity = '1000%'

    let value = document.querySelector('#quant-value')
    value.textContent = 0
}

function moreQuant() {
    let value = document.querySelector('#quant-value')
    value.textContent = Number(value.textContent) + 1
}

function lessQuant() {
    let value = document.querySelector('#quant-value')

    if (value.textContent > '0') {
        value.textContent = Number(value.textContent) - 1
    }

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
        
        let hasAsk = await verifyAsk(check, localStorage.getItem('password'))
        
        if (hasAsk == 'true') {
            console.log('Sem pedido feito')
        } else if (hasAsk == 'false') {
            let alert2 = document.querySelector('.hasAsk')
            alert2.style.display = 'flex'
            screen.style.display = 'block'
            console.log('Pedido em andamento')
        }
    }
}
