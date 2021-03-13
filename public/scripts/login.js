function strip(string) { 
    return string.replace(/^\s+|\s+$/g, ''); 
} 

async function loginUser() {

    let username = strip(document.querySelector('#username').value)
    let password = strip(document.querySelector('#password').value)

    let data = new FormData()
    data.append('username', username)
    data.append('password', password)

    let options = {
        method: 'POST',
        body: new URLSearchParams(data)
    }

    await fetch('/loginUser', options)
        .then(async data => {
            let text = await data.text()
            if (text == '200AL') {
                localStorage.setItem('username', username)
                localStorage.setItem('password', password)
                window.location.href = `${document.referrer}`
            } else if (text == 'admin') {
                localStorage.setItem('username', username)
                localStorage.setItem('password', password)
                window.location.href = `/admin`
            } else {
                alert(text)
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