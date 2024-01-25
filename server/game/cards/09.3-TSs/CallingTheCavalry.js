const ActionCard = require('../../actioncard.js');

class CallingTheCavalry extends ActionCard {
    setupCardAbilities() {
        this.action({
            title: 'Calling the Cavalry',
            playType: ['shootout'],
            message: context => this.game.addMessage('{0} uses {1} to give both players +1 hand rank for each Horse in their posse', context.player, this),
            handler: context => {
                let eventHandler = () => {
                    this.lastingEffect(context.ability, ability => ({
                        until: {
                            onPlayWindowClosed: event => event.playWindow.name === 'shootout resolution',
                            onShootoutRoundFinished: () => true
                        },
                        condition: () => this.game.shootout,
                        match: this.game.getPlayers(),
                        effect: ability.effects.dynamicHandRankMod(player => this.getNumberOfMountsForPlayer(player))
                    }), context.causedByPlayType);
                };
                this.game.onceConditional('onPlayWindowOpened', {
                    until: 'onShootoutPhaseFinished',
                    condition: event => event.playWindow.name === 'shootout resolution' 
                }, eventHandler);
                const modifyHandRankEventHandler = () => {
                    this.game.getPlayers().forEach(player => {
                        const numOfMounts = this.getNumberOfMountsForPlayer(player);
                        if(numOfMounts > 0 && player.modifyRank(numOfMounts, context)) {
                            this.game.addMessage('{0}\'s hand rank is increased by {1} thanks to {2}; Current hand rank is {3}', 
                                player, this, player.getTotalRank());
                        }
                    });
                };
                this.game.onceConditional('onPlayWindowClosed', { condition: event => event.playWindow.name === 'shootout resolution' }, modifyHandRankEventHandler);                
                this.game.once('onShootoutPhaseFinished', () => this.game.removeListener('onPlayWindowOpened', modifyHandRankEventHandler));
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a dude',
                    waitingPromptTitle: 'Waiting for opponent to select dude',
                    cardCondition: card => card.location === 'play area' && card.controller.equals(context.player) && card.isParticipating(),
                    cardType: 'dude',
                    onSelect: (player, card) => {
                        this.applyAbilityEffect(context.ability, ability => ({
                            match: card,
                            effect: ability.effects.setAsStud()
                        }));
                        this.game.addMessage('{0} uses {1} to set {2} as stud', player, this, card);
                        return true;
                    }
                });
            }
        }); 
    }

    getNumberOfMountsForPlayer(player) {
        let playerPosse = this.game.shootout.getPosseByPlayer(player);
        if(playerPosse) {
            return playerPosse.getDudes(dude => dude.hasHorse()).length;
        }
        return 0;
    }
}

CallingTheCavalry.code = '17018';

module.exports = CallingTheCavalry;
