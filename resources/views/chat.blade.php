<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>Chat en vivo</title>
	<link rel="stylesheet" href="{{asset('css/app.css')}}">

	<style>
	.list-group{
		overflow-y: scroll;
		height: 200px;
	}
</style>
</head>
<body>
	<div class="container">
		<div class="row" id="app">
			<div class="offset-4 col-4 offset-sm-2 col-sm-8">
				<li class="list-group-item active">Chat room <span class="badge badge-pill badge-danger">@{{ numberOfUsers }}</span> </li>
				<div class="badge badge-pill badge-default"> @{{ typing }} </div>
				<ul class="list-group" v-chat-scroll>

					<message v-for="message, index in chat.message" 
					:key="message.index"
					:color= chat.color[index]
					:user = chat.user[index]
					:time = chat.time[index]>
					@{{ message }}
				</message>

			</ul>
			<input v-model="message" @keyup.enter="send" type="text" class="form-control" placeholder="Escribe tu mensaje..."><br>
			<a href="" class="btn btn-warning btn-sm" @click.prevent='deleteSession'>Eliminar historial</a>
		</div>

	</div>
</div>


<script src="{{ asset('js/app.js') }}"></script>
</body>
</html>