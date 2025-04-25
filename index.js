const express = require('express')
const path = require('path')
const morgan = require('morgan')
const fs = require('fs')
const cors = require('cors')

const PORT = 3000
const app = express()

// функция получения пути
const getPath = filename => path.join(__dirname, 'public', `${filename}.html`)

// миддлвейр для подключения статических файлов (css, js, изображения и т.д.)
app.use(express.static(path.join(__dirname, 'public')))
// логирующий morgan миддлвейр
app.use(morgan(':method :url :status'))
// миддлвейр для парсинга входящего запроса
app.use(express.json())
// cors
const allowedOrigins = ['http://127.0.0.1:5501']
app.use(
	cors({
		methods: ['GET', 'POST'],
		origin: allowedOrigins
	})
)

// роутинг
app.get('/', (req, res) => {
	res.sendFile(getPath(`index`))
})
app.get('/home', (req, res) => {
	res.redirect('/')
})


// query роут
// /search?query=...
app.get('/search', (req, res) => {
	const query = req.query.query.toLowerCase()
	const words = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf-8')

	const result = words.filter(word => word.includes(query))

	res.json({ result })
})

//! Работа с пользователями
app.get('/getUsers', (req, res) => {
	try {
		const users = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf-8')
		res.json(users)
	} catch (error) {
		console.log('Ошибка при получении пользователей', error)
		res.send('Ошибка при получении пользователей', error)
	}
})
app.post('/addUser', (req, res) => {
	try {
		const user = req.body
		const users = JSON.parse(
			fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf-8')
		)
		users.push(user)
		fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(users))
		res.send(`Пользователь ${user} успешно добавлен`)
	} catch (error) {
		console.log('Ошибка при добавлении пользователя', error)
		res.send('Ошибка при добавлении пользователя', error)
	}
})

// обработка ошибки 404
app.use((req, res) => {
	res.status(404).sendFile(getPath('404'))
})

app.listen(PORT, () => {
	console.log(`server is listening port: ${PORT}`)
})
