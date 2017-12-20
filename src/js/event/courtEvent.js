var CourtEvent = function(game, bus, view) {
    this.game = game;
    this.bus = bus;
    this.view = view;
    this.event = 'court';
    this.players = [];

    this.bus.addListener('court.start', function(msg){ this.startAction(msg)}.bind(this));
    this.bus.addListener('court.players', function(msg){ this.playersAction(msg)}.bind(this));
    this.bus.addListener('court.out', function(msg){ this.outAction(msg)}.bind(this));
    this.bus.addListener('court.vote', function(msg){ this.voteAction(msg)}.bind(this));
    this.bus.addListener('court.end', function(msg){ this.endAction(msg)}.bind(this));
    this.bus.addListener('view.court-players.vote', function(msg){
        this.view.active('game-history');
        this.bus.emit('sendmessage', {event: this.event, action: 'vote', player_id: msg.player_id});
    }.bind(this));
};

CourtEvent.prototype.startAction = function(msg) {
    console.info('COURT.START', msg);
    this.view.history('Начинается голосование');
    audio.courtStart(function() {
        this.bus.emit('sendmessage', {event: this.event, action: 'started'});
    }.bind(this));
};

CourtEvent.prototype.playersAction = function(msg) {
    console.info('COURT.PLAYERS', msg);
    this.view.courtPlayers(msg.players);
    this.view.active('court-players');
};

CourtEvent.prototype.outAction = function(msg) {
    console.info('COURT.OUT', msg);
    this.view.history('Из игры выбывает игрок ' + msg.player.username);
};

CourtEvent.prototype.voteAction = function(msg) {
    console.info('COURT.VOTE', msg);
    this.view.history('Игрок ' + msg.player.username + ' проголосовал за ' + msg.vote.username);
};

CourtEvent.prototype.endAction = function(msg) {
    console.info('COURT.END', msg);
    this.view.history('Голосование окончено');

    audio.courtEnd(function() {
        audio.courtOutOne(function() {//todo
            this.bus.emit('sendmessage', {event: this.event, action: 'ended'});
        }.bind(this));
    }.bind(this));
};