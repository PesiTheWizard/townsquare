const DudeCard = require('../../dudecard.js');
const GameActions = require('../../GameActions');

class ErinKnight extends DudeCard {
    setupCardAbilities() {
        this.action({
            title: 'Shootout: Erin Knight',
            playType: ['shootout:join'],
            cost: ability.costs.boot(card => card.location === 'play area' &&
                card.getType() === 'dude' &&
                card.controller.equals(this.controller) &&
                card.hasKeyword('deputy') && !card.isParticipating()),
            condition: () => this.isParticipating(),
            repeatable: true,
            message: context => this.game.addMessage('{0} uses {1} to move {2} into the posse booted',
                context.player, this, context.costs.boot),
            handler: context => {
                this.game.resolveGameAction(GameActions.joinPosse({
                    card: context.costs.boot
                }), context);
            }
        });
    }
}

ErinKnight.code = '17006';

module.exports = ErinKnight;
