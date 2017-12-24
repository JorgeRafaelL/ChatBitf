require('./bootstrap');
//Para el autoscroll
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'

Vue.use(VueChatScroll)
//para las notificaciones
import Toaster from 'v-toaster'
Vue.use(Toaster, {timeout: 5000})
import 'v-toaster/dist/v-toaster.css'

window.Vue = require('vue');


Vue.component('message', require('./components/message.vue'));

const app = new Vue({
	el: '#app',
	data:{
		message: '',
		chat:{
			message: [],
			user: [],
			color:[],
			time: []
		},
		typing: '',
		numberOfUsers: 0
	},
	watch:{
		message(){
			Echo.private('chat')
			.whisper('typing', {
				name: this.message
			});
		}
	},
	methods:{
		send(){
			if (this.message != 0) {
				this.chat.message.push(this.message);
				this.chat.color.push('info');
				this.chat.user.push('Tú');
				this.chat.time.push(this.getTime());

				axios.post('/send', {
					message : this.message,
					chat: this.chat
				})
				.then(response => {
					
					this.message = ''

				})
				.catch(error => {
					console.log(error);
				});
			}

		},
		getTime(){
			let time = new Date();
			return time.getHours() + ':' + time.getMinutes();
		},
		getOldMessages(){
			axios.post('/getOldMessage')
			.then(response => {
				
				if (response.data != '') {
					this.chat = response.data;
				}
			})
			.catch(error => {
				console.log(error);
			});
		},
		deleteSession(){
			axios.post('/deleteSession')
			.then(response=> this.$toaster.info('Historial de mensajes eliminados') );
		}
	},
	mounted(){
		this.getOldMessages();
		Echo.private('chat')
		.listen('ChatEvent', (e) => {
			this.chat.message.push(e.message);
			this.chat.user.push(e.user);
			this.chat.color.push('warning');
			this.chat.time.push(this.getTime());

			axios.post('/saveToSession', {
				chat: this.chat
			})
			.then(response => {
				
				
			})
			.catch(error => {
				console.log(error);
			});
			//console.log(e);
		})

		.listenForWhisper('typing', (e) => {
			if (e.name != '') {
				this.typing = 'Escribiendo...'
			}
			else{
				this.typing = ''
			}
			
		});

		Echo.join(`chat`)
		.here((users) => {
			this.numberOfUsers = users.length;
		})
		.joining((user) => {
			this.numberOfUsers += 1;
			this.$toaster.success(user.name + ' Se unió la conversación.')
		})
		.leaving((user) => {
			this.numberOfUsers -= 1;
			this.$toaster.warning(user.name + ' Dejó la conversación.')
		});
	}
});
