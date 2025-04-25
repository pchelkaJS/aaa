const getAllBtn = document.querySelector('.c1-button')
const getUserByIdBtn = document.querySelector('.search')
const addUserBtn = document.querySelector('.c3-button')
const c1Container = document.querySelector('.c1-container')
const c2Container = document.querySelector('.c2-container')
const c3Container = document.querySelector('.c3-container')
const inputId = document.querySelector('#id')
const inputName = document.querySelector('#name')
const inputAge = document.querySelector('#age')
const getById = document.querySelector('#getById')
// inputAge.value

// Получение пользователей
const getDataFunction = async url => {
	const getData = async url => {
		const res = await fetch(url)
		const json = await res.json()
		return json
	}

	try {
		const data = await getData(url)
		return data
	} catch (error) {
		console.log(`Произошла ошибка в getData, ${error.message}`)
	}
}

// Добавление пользователя
const postDataFunction = async (url, obj) => {
	const postData = async (url, obj) => {
		const res = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(obj),
			headers: { 'Content-type': 'application/json; charset=UTF-8' }
		})
		const json = await res.json()
		return json
	}

	try {
		const data = await postData(url, obj)
		return data
	} catch (error) {
		console.log(`Произошла ошибка в postData, ${error.message}`)
	}
}

window.addEventListener('load', async () => {
	if (!c1Container.innerHTML){
	const data = JSON.parse(await getDataFunction('http://localhost:3000/getUsers'))
	data.forEach(user => {
		c1Container.insertAdjacentHTML(
			`beforeend`,
			`<p>${user.name}, ${user.age}, ${user.city}</p>`
		)
	})
	console.log(data)
	}
})

getUserByIdBtn.oninput =  async () => {
	c1Container.innerHTML = ''
	const data = JSON.parse(await getDataFunction('http://localhost:3000/getUsers'))
	data.forEach(user => {
		console.log(user.name.toString(), getUserByIdBtn.value)
		if(user.name.toString().toLowerCase().includes(getUserByIdBtn.value)){
		c1Container.insertAdjacentHTML(
			`beforeend`,
			`<p>${user.name}, ${user.age}, ${user.city}</p>`
		)
		}
	})
	console.log(data)
}

addUserBtn.addEventListener('click', async () => {
	c3Container.innerHTML = ''
	const data = await postDataFunction('http://localhost:3000/addUser', {
		"city": inputId.value,
		"age": inputAge.value,
		"name": inputName.value
	})
	c3Container.insertAdjacentHTML(
		`beforeend`,
		`<p>${inputId.value}:${inputAge.value}, ${inputName.value}</p>`
	)
})