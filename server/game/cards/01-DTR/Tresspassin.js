const ActionCard = require('../../actioncard.js');
const GameActions = require('../../GameActions/index.js');

class Tresspassin extends ActionCard {
    setupCardAbilities() {
        this.action({
            title: 'Tresspassin\'',
            playType: ['noon'],
            target: {
                activePromptTitle: 'Choose a private deed you own',
                cardCondition: {
                    location: 'play area',
                    controller: 'any',
                    condition: card => card.owner === this.controller && card.isPrivate()
                },
                cardType: ['deed']
            },
            handler: context => {
                const tresspassers = this.game.getDudesAtLocation(context.target.uuid).filter(dude => dude && !dude.controller.equals(this.controller));
                this.abilityContext = context;
                this.chickens = [];
                this.bosses = [];
                if(tresspassers.length >= 1) {
                    this.game.addMessage('{0} uses {1} on {2}', context.player, this, context.target);
                    tresspassers.forEach(dude => {
                        this.game.promptWithMenu(dude.controller, this, {
                            activePrompt: {
                                menuTitle: `What shall ${dude.title} do?`,
                                buttons: [
                                    {
                                        text: 'Go home booted',
                                        method: 'runHome',
                                        arg: dude
                                    },
                                    {
                                        text: 'Gain 1 bounty',
                                        method: 'stayLikeABoss',
                                        arg: dude
                                    }
                                ]
                            },
                            source: this
                        });
                    });
                    this.game.queueSimpleStep(() => {
                        this.game.addMessage('{0} run home; {1} stand their ground', this.chickens, this.bosses);
                    });
                } else {
                    this.game.addMessage('{0} uses {1} on {2} but no one is tresspassin\' there', context.player, this, context.target);
                }
            }
        });
    }

    runHome(p, d) {
        this.game.resolveGameAction(GameActions.sendHome({
            card: d,
            options: { isCardEffect: true }
        })).thenExecute(() => {
            this.chickens.push(d);
        });
        return true;
    }

    stayLikeABoss(p, d) {
        this.game.resolveGameAction(GameActions.addBounty({
            card: d
        }), this.abilityContext).thenExecute(() => {
            this.bosses.push(d);
        });
        return true;
    }
}

Tresspassin.code = '01110';

module.exports = Tresspassin;
