$(function(){
    
    var IO = {

        init : function(){

            //var url = "http://localhost:5000";
            var url = 'https://ancient-fjord-8441.herokuapp.com';

            IO.socket = io.connect(url);
            IO.bindEvents();

        },
        bindEvents: function(){
            IO.socket.on('connected', IO.onConnected );
            IO.socket.on('newGameCreated',IO.onNewGameCreated);
            IO.socket.on('playerJoinedRoom',IO.playerJoinedRoom);
            IO.socket.on('updatePlayerPlayers',IO.updatePlayerPlayers);
            IO.socket.on('newChatMessage',IO.newChatMessage);
            IO.socket.on('prepareStartGame',IO.prepareStartGame);
            IO.socket.on('isMoving',IO.isMoving);
            IO.socket.on('gameEnded',IO.gameEnded);
        },
        onConnected: function(){
            App.mySocketID = IO.socket.socket.sessionid;

        },
        onNewGameCreated: function(data){
            App.gameInit(data);
        },
        playerJoinedRoom: function(data){
            App.updatePlayers(data);
        },
        updatePlayerPlayers: function(data){
            App.updatePlayerScreen(data);
        },
        newChatMessage: function(data){
            App.updateChat(data);
        },
        prepareStartGame: function(data){
            App.prepareStartGame(data);
        },
        isMoving: function(data){
            App.moving(data);
        },
        gameEnded: function(data){
            App.gameEnded(data);
        }

    }
    
    var App = {
        gameID:0,
        myRole: '',
        myName: '',
        mySocketID:'',
        players : [],
        clients:{},
        word:"",
        gameRole: 'guess',
        gameState: 'lobby',
        init: function(){
            App.cacheElements();
            App.bindEvents();

        },
        cacheElements: function(){
            App.$doc = $(document);
            App.$chat_template = $('#chat_template').html();
            App.$game_area  = $('#game_area').html();
            App.$lobby = $('#lobby').html();
        },
        bindEvents: function(){
            App.$doc.on('click','#create_room',App.onCreateClick);
            App.$doc.on('click','#join_room',App.onJoinRoom);
            App.$doc.on('click','#send_message',App.sendMessage);
            App.$doc.on('click','#start_game',App.startGame);



        },
        onCreateClick: function(){
            data={playerName:$('#player_name').val() || 'anon'};
            IO.socket.emit('hostCreateNewGame',data);
        },
        gameInit: function(data){
            App.gameID=data.gameID;
            App.mySocketID=data.mySocketID;
            App.myRole='Host';
            App.myName=data.playerName;
            App.displayNewGameScreen(data);

        },
        displayNewGameScreen : function(data){
            $('#main_area').html(App.$lobby);
            $('#instructions').html("<h1>"+App.gameID+"</h1>");
            $('#room_number_header').html(App.gameID);
            $('#players_waiting').append('<p>'+data.playerName+'</p>');
            App.players.push(data);
            $("#chat_area").html(App.$chat_template);
            App.$cont = $('#chat');
            $("#m").keyup(function(event){
                if(event.keyCode == 13){
                    $("#send_message").click();
                    
                }
            });
        
        },
        onJoinRoom: function(){
            var data = {gameID: $('#room_id').val(), 
                        playerName:$('#player_name').val() || 'anon'};
            IO.socket.emit('playerJoinGame',data);
            App.myRole = 'Player';
            App.myName=data.playerName;
            App.gameID=data.gameID;
            
        },
        updatePlayers: function(data){
            if (App.myRole == 'Host'){
                App.players.push(data);
                if (App.gameState!='playing'){
                    $('#instructions').html("<h1>"+App.gameID+"</h1>");
                    $('#room_number_header').html(App.gameID);
                    $('#players_waiting').append('<p>'+data.playerName+'</p>');
                }
                IO.socket.emit('updatePlayerPlayersServer',App.players);
            }
        },
        updatePlayerScreen: function(data){
            if (App.myRole == 'Player'){

                if (App.gameState=="playing"){App.players.push(data[i]);}
                else{
                    $('#main_area').html(App.$lobby);
                    $("#chat_area").html(App.$chat_template);
                    App.$cont = $('#chat');
                    $("#m").keyup(function(event){
                        if(event.keyCode == 13){
                            $("#send_message").click();    
                        }
                    });
                    $('#instructions').html("<h1>"+App.gameID+"</h1>");
                    $('#room_number_header').html(App.gameID);
                    $('#players_waiting').html("");
                    for (var i = 0 ; i < data.length; i++){
                        $('#players_waiting').append('<p>'+data[i].playerName+'</p>');
                        App.players.push(data[i]);
                    }
                }
            }
        },
        sendMessage: function(){
            var chat_message=$('#m').val();
            console.log(chat_message);
            console.log(App.word);
            if (App.gameState == "playing" && chat_message.toUpperCase().indexOf(App.word) != -1 ){
                console.log("win");
                data= {'name':App.myName,'gameID':App.gameID};
                IO.socket.emit('gameEnd',data);
            }
            var data = { playerName:App.myName,message:chat_message,gameID:App.gameID};
            IO.socket.emit('chatMessage',data);
            $('#m').val('');
        },
        updateChat: function(data){
            $('#messages').append($('<li class="pure-menu-item">').text(data.playerName+": "+data.message));
            App.$cont[0].scrollTop = App.$cont[0].scrollHeight;
            App.$cont[0].scrollTop = App.$cont[0].scrollHeight;
            
        },
        startGame: function(){
            console.log(App.gameID);
            IO.socket.emit('startGame',App.gameID);
        },
        prepareStartGame: function(data){
            console.log(data);
            console.log(App.mySocketID);

            $("#main_area").html(App.$game_area);
            $("#chat_area").html(App.$chat_template);
            App.$cont = $('#chat');
            $("#m").keyup(function(event){
                if(event.keyCode == 13){
                    $("#send_message").click();
                }
            });
            App.gameState = "playing";
            App.drawing = false;
            App.canvas = $('#paper');
            App.ctx = App.canvas[0].getContext('2d');
            App.clients = {};
            App.cursors = {};
            App.prev = {};
            App.lastEmit = $.now();
            App.gameRole = (App.mySocketID==data.id?"drawer":"guesser")
            App.word=data.word;
            $("#current-word").html((App.gameRole=="drawer")?"Word: "+App.word:"");
            App.canvas.on('mousedown',function(e){
                e.preventDefault();
                App.drawing = true;
                App.prev.x = e.pageX;
                App.prev.y = e.pageY;
            });
            App.$doc.bind('mouseup mouseleave',function(){
                App.drawing = false;
            });
            App.$doc.on('mousemove',function(e){
                if($.now() - App.lastEmit > 30){
                    var moveData = {
                        'gameID': App.gameID,
                        'x': e.pageX,
                        'y': e.pageY,
                        'drawing': App.drawing,
                        'id': App.mySocketID
                    };

                    IO.socket.emit('mousemove',moveData);
                    App.lastEmit = $.now();
                }
                if(App.drawing){

                    App.drawLine(App.prev.x, App.prev.y, e.pageX, e.pageY);

                    App.prev.x = e.pageX;
                    App.prev.y = e.pageY;
                }
            });
            
            if(App.gameRole == "drawer"){
                console.log("foo");
                console.log(App.word);
            }
        },

        moving: function (data) {

            if(! (data.id in App.clients)){
                App.cursors[data.id] = $('<div class="cursor">').appendTo('#cursors');
            }
            App.cursors[data.id].css({
                'left' : data.x,
                'top' : data.y
            });
            if(data.drawing && App.clients[data.id]){

                App.drawLine(App.clients[data.id].x, App.clients[data.id].y, data.x, data.y);
            }
            App.clients[data.id] = data;
            App.clients[data.id].updated = $.now();
        },
        drawLine: function(fromx, fromy, tox, toy){
            App.ctx.moveTo(fromx, fromy);
            App.ctx.lineTo(tox, toy);
            App.ctx.stroke();
        },
        gameEnded: function(data){
            App.gameState = "lobby";
            console.log("i know who won");
            $("#main_area").html(App.$lobby);
            $('#instructions').html("<h1>"+App.gameID+"</h1><h2>Winner: "+data+"</h2");
            for (var i  = 0 ; i < App.players.length ; i ++ ){
                console.log(App.players);
                $('#players_waiting').append('<p>'+App.players[i].playerName+'</p>');
            }
            
        }
    }

    IO.init();
    App.init();   

});