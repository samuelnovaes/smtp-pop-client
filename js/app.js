const net = require('net');
const win = require('nw.gui').Window.get();

new Vue({
	el: '#app',
	created(){
		win.maximize();
	},
	data: {
		smtp: {
			host: '',
			port: '',
			from: '',
			to: '',
			subject: '',
			message: ''
		},
		pop: {
			host: '',
			port: '',
			user: '',
			password: '',
			msgIndex: ''
		},
		logs: ''
	},
	methods: {
		run(port, host, cmds){
			let i = 0;
			let client = net.connect(port, host)
			.on('data', (data)=>{
				this.logs += data.toString();
				if(i < cmds.length){
					client.write(cmds[i], ()=>{
						i++;
					});
				}
				else{
					client.end();
				}
			})
			.on('end', ()=>{
				this.logs += "\n----\n\n";
				client.destroy();
				this.$nextTick(()=>{
					let logsArea = document.querySelector('.logs');
					logsArea.scrollTop = logsArea.scrollHeight;
				});
			});
		},
		enviar(){
			let client = net.connect(this.smtp.port, this.smtp.host, ()=>{
				client.write('HELO\r\n');
				client.write(`MAIL From: ${this.smtp.from}\r\n`);
				client.write(`RCPT To: ${this.smtp.to}\r\n`);
				client.write(`DATA\r\n`);
				client.write(`De: ${this.smtp.from}\r\n`);
				client.write(`Assunto: ${this.smtp.subject}\r\n`);
				client.write(`Mensagem: ${this.smtp.message}\r\n`);
				client.write(`.\r\n`);
				client.end();
			})
			.on('data', (data)=>{
				this.logs += data.toString();
			})
			.on('end', ()=>{
				this.logs += "\n----\n\n";
				client.destroy();
				this.$nextTick(()=>{
					let logsArea = document.querySelector('.logs');
					logsArea.scrollTop = logsArea.scrollHeight;
				});
			});
		},
		obter(){
			this.run(this.pop.port, this.pop.host, [
				`user ${this.pop.user}\r\n`,
				`pass ${this.pop.password}\r\n`,
				`list\r\n`,
				`quit\r\n`
			]);
		},
		ler(){
			this.run(this.pop.port, this.pop.host, [
				`user ${this.pop.user}\r\n`,
				`pass ${this.pop.password}\r\n`,
				`retr ${this.pop.msgIndex}\r\n`,
				`quit\r\n`
			]);
		},
		deletar(){
			this.run(this.pop.port, this.pop.host, [
				`user ${this.pop.user}\r\n`,
				`pass ${this.pop.password}\r\n`,
				`dele ${this.pop.msgIndex}\r\n`,
				`quit\r\n`
			]);
		}
	}
});