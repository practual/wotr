import os

import yaml
from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

import game as game_actions
import serializer
from cache import get_cache

app = Flask(__name__)
app.config.from_file(
    os.path.join('settings', os.environ.get('WOTR_DEPLOYMENT_MODE', 'local') + '.yml'),
    yaml.safe_load
)
socketio = SocketIO(app, path='/api/socket.io', json=serializer)


def with_game(fn):
    def wrapped(game_id, *args, **kwargs):
        cache = get_cache()
        game, cas = cache.gets(game_id)
        return_value = fn(game, *args, **kwargs)
        if isinstance(return_value, tuple):
            game = return_value[0]
            return_value = return_value[1:]
        cache.cas(game_id, game, cas)
        emit('game_state', game, broadcast=True)
        return return_value
    return wrapped


@app.route('/<string:game_id>/<string:player_id>')
@app.route('/<string:game_id>')
@app.route('/')
def index(**kwargs):
    return render_template('index.html')


@app.route('/api/game', methods=['POST'])
def api_create_game():
    game = game_actions.create_game()
    get_cache().set(game['game_id'], game)
    return game['game_id'], 201


@app.route('/api/game/<string:game_id>')
def api_get_game(game_id):
    return get_cache().get(game_id)


@socketio.on('add_player')
@with_game
def sock_add_player(game, name):
    return game_actions.add_player(game, name)


@socketio.on('select_side')
@with_game
def sock_select_side(game, player_id, side):
    return game_actions.set_side(game, player_id, side)


@socketio.on('place_hunt_die')
@with_game
def sock_place_hunt_die(game):
    return game_actions.place_hunt_die(game)


@socketio.on('hunt_dice_placed')
@with_game
def sock_hunt_dice_placed(game):
    return game_actions.roll_dice(game)


@socketio.on('diplomatic_action')
@with_game
def sock_diplomatic_action(game, player_id, nation, die_id):
    return game_actions.diplomatic_action(game, player_id, nation, str(die_id))


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')
