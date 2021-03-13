function strip(string) { 
    return string.replace(/^\s+|\s+$/g, ''); 
} 

async function createAccount() {
    let username = strip(document.querySelector('#username').value)
    let password = strip(document.querySelector('#password').value)
    let name = strip(document.querySelector('#name').value)
    let phone = document.querySelector('#phone').value
    let cpf = document.querySelector('#cpf').value

    const data = new FormData()
    data.append('username',username)
    data.append('password',password)
    data.append('name',name)
    data.append('phone',phone)
    data.append('cpf',cpf)

    let options = {
        method: 'POST',
        body: new URLSearchParams(data)
    }

    await fetch('/createUser', options)
        .then(async data => {
            let text = await data.text()

            if (text == 'Usuario criado com sucesso!') {
                setTimeout(async () => {
                    await window.alert(text)
                    window.location.href = '/'
                }, 5000)
            } else {
                await window.alert(text)
            }

        })
}

function loginPageCheck() {
    let check = localStorage.getItem('username')

    if (check == null) {
        return
    } else {
        window.location.href = '/'
    }
}