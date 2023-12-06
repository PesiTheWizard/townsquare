const DudeCard = require('../../dudecard.js');
const GameActions = require('../../GameActions');

class ErinKnight extends DudeCard {
    setupCardAbilities() {
        this.action({
            title: 'Shootout: Erin Knight',
            playType: ['shootout:join'],
            target: {
                cardCondition: {
                    location: 'play area',
                    participating: false,
                    booted: false,
                    controller: 'current'
                    condition: card => card.hasKeyword('deputy')
                },
                cardType: 'dude',
                gameAction: ['joinPosse', 'boot']
            }
            condition: () => this.isParticipating(),
            repeatable: true,
            message: context => this.game.addMessage('{0} uses {1} to move {2} into the posse booted',
                context.player, this, context.target),
            handler: context => {
                this.game.resolveGameAction(GameActions.joinPosse({
                    card: context.target,
                    options: { needToBoot: true }
                }), context);
            }
        });
    }
}

ErinKnight.code = '17006';

module.exports = ErinKnight;
