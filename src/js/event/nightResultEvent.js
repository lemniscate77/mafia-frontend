var NightResultEvent = function (game, bus, view) {
    this.game = game;
    this.bus = bus;
    this.view = view;
    this.event = 'night_result';

    this.bus.addListener('night_result.out', function (msg) {
        this.outAction(msg)
    }.bind(this));

    this.bus.addListener('view.night-result.accept', function (msg) {
        this.view.active('game-history');
        this.bus.emit('sendmessage', {event: this.event, action: 'accept'});
    }.bind(this));
};

NightResultEvent.prototype.outAction = function (msg) {
    console.info('NIGHT_RESULT.OUT', msg);
    var player = msg.data;

    var out = '';
    if (player) {
        out = 'Из игры выбывает игрок <b>' + player.username + '</b>';
    } else {
        out = 'Из игры никто не выбывает';
    }

    this.view.history(out);
    this.view.nightResult(out);
    this.view.active('night-result');

    if (parameters.isTest()) {
        setTimeout(function () {
            this.view.active('game-history');
            this.bus.emit('sendmessage', {event: this.event, action: 'accept'});
        }.bind(this), parameters.getTestTimeout());
    }

    if (!player) {
        audio.courtOutNobody();
        return false;
    }

    if (player && parseInt(player.id) === parseInt(this.game.getUserId())) {
        audio.playerOut();
    }
};