let {app, BrowserWindow} = require('electron')
let path = require('path')
let url = require('url')

app.on('ready', () => {

	let win = new BrowserWindow({
		backgroundColor: '#eee',
		title: 'Cliente de Emails'
	})

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'src', 'index.html'),
		slashes: true,
		protocol: 'file'
	}))

})

app.on('window-all-closed', () => {
	app.quit()
})
