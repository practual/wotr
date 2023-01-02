import os
import random
from uuid import uuid4


def update_log(game_id, action, data):
    with open(os.path.join('./log', game_id), 'a+') as game_log:
        game_log.write(action + '\n')
        game_log.write(str(data) + '\n')


TURN_TEMPLATE = {
    'number': 0,
    'phase': 'hunt',
    'priority': 'free',
    'action': '',
}


def create_game():
    game_id = str(uuid4())
    update_log(game_id, 'CREATE', {'game_id': game_id})
    return {
        'game_id': game_id,
        'players': {},
        'sides': {
            'shadow': {
                'dice': {str(i): {'id': i, 'face': None, 'used': False} for i in range(7)},
            },
            'free': {
                'dice': {str(i): {'id': i, 'face': None, 'used': False} for i in range(4)},
            },
        },
        'turn': TURN_TEMPLATE.copy(),
        'board': {
            'hunt': {
                'min': 0,
                'shadow': 0,
                'free': 0,
            },
            'political_track': {
                'dwarves': {
                    'name': 'Dwarves',
                    'side': 'free',
                    'distance': 3,
                    'active': False,
                },
                'gondor': {
                    'name': 'Gondor',
                    'side': 'free',
                    'distance': 2,
                    'active': False,
                },
                'north': {
                    'name': 'The North',
                    'side': 'free',
                    'distance': 3,
                    'active': False,
                },
                'rohan': {
                    'name': 'Rohan',
                    'side': 'free',
                    'distance': 3,
                    'active': False,
                },
                'elves': {
                    'name': 'Elves',
                    'side': 'free',
                    'distance': 3,
                    'active': True,
                },
                'isengard': {
                    'name': 'Isengard',
                    'side': 'shadow',
                    'distance': 1,
                    'active': True,
                },
                'sauron': {
                    'name': 'Sauron',
                    'side': 'shadow',
                    'distance': 1,
                    'active': True,
                },
                'southrons': {
                    'name': 'Southrons & Easterlings',
                    'side': 'shadow',
                    'distance': 2,
                    'active': True,
                },
            },
        },
    }


def add_player(game, name):
    player_id = str(uuid4())
    update_log(game['game_id'], 'ADD PLAYER', {'id': player_id, 'name': name})
    game['players'][player_id] = {
        'id': player_id,
        'name': name,
        'side': None,
    }
    return game, player_id


def set_side(game, player_id, side):
    update_log(game['game_id'], 'SET PLAYER SIDE', {'id': player_id, 'side': side})
    game['players'][player_id]['side'] = side
    if len(game['players'].keys()) == 2 and set(player['side'] for player in game['players'].values()) == {'shadow', 'free'}:
        game = start_game(game)
    return game


def start_game(game):
    return advance_turn(game)


def advance_turn(game):
    turn_num = game['turn']['number'] + 1
    force_one_hunt_tile = bool(game['turn'].get('hunt', {}).get('free'))
    game['turn'] = TURN_TEMPLATE.copy()
    game['turn']['number'] = turn_num
    game['board']['hunt']['min'] = 1 if force_one_hunt_tile else 0
    return game


def pass_priority(game):
    game['turn']['action'] = ''
    game['turn']['priority'] = {
        'free': 'shadow',
        'shadow': 'free',
    }[game['turn']['priority']]
    return game


def place_hunt_die(game):
    game['board']['hunt']['shadow'] += 1
    for die in game['sides']['shadow']['dice'].values():
        if die['face']:
            continue
        die['face'] = 'eye'
        die['used'] = True
        break
    return game


def roll_dice(game):
    shadow_dice_options = ['character', 'army', 'muster', 'event', 'muster/army', 'eye']
    free_dice_options = ['character', 'character', 'muster', 'event', 'muster/army', 'west']
    for die in game['sides']['shadow']['dice'].values():
        if die['face']:
            continue
        die['face'] = shadow_dice_options[random.randint(0, 5)]
        if die['face'] == 'eye':
            game['board']['hunt']['shadow'] += 1
            die['used'] = True
    for die in game['sides']['free']['dice'].values():
        die['face'] = free_dice_options[random.randint(0, 5)]
    game['turn']['phase'] = 'action'
    return game


def diplomatic_action(game, player_id, nation, die_id):
    game['board']['political_track'][nation]['distance'] -= 1
    game['sides'][game['players'][player_id]['side']]['dice'][die_id]['used'] = True
    game = pass_priority(game)
    return game
