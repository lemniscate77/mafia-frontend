var GirlEvent = function(game, bus) {
    this.game = game;
    this.bus = bus;
    this.view = view;
    this.event = 'girl';

    this.bus.addListener('girl.start', function(msg){ this.startAction(msg)}.bind(this));
    this.bus.addListener('girl.players', function(msg){ this.playersAction(msg)}.bind(this));
    this.bus.addListener('girl.end', function(msg){ this.endAction(msg)}.bind(this));
    this.bus.addListener('view.girl-players.choice', function(msg){
        this.view.active('game-history');
        this.bus.emit('sendmessage', {event: this.event, action: 'choice', player_id: msg.player_id});
    }.bind(this));
};

GirlEvent.prototype.startAction = function(msg) {
    console.info('GIRL.START', msg);
    this.view.history('Просыпается девушка');
    audio.girlStart(function() {
        this.bus.emit('sendmessage', {event: this.event, action: 'started'});
    }.bind(this));
};

GirlEvent.prototype.playersAction = function(msg) {
    console.info('GIRL.PLAYERS', msg);
    this.view.history('Девушка делает свой выбор');

    if(this.game.role === 'ROLE_GIRL') {
        this.view.girlPlayers(msg.players);
        this.view.active('girl-players');
    }
};

GirlEvent.prototype.endAction = function(msg) {
    console.info('GIRL.END', msg);
    this.view.history('Девушка сделала свой выбор. Девушка засыпает');
    audio.girlEnd(function() {
        this.bus.emit('sendmessage', {event: this.event, action: 'ended'});
    }.bind(this));
};