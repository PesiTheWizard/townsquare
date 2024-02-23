const DeedCard = require('../../deedcard.js');

class FirstBaptistChurch extends DeedCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => true,
            match: player => player.equals(this.controller),
            effect: ability.effects.modifyHandSize(1)
        });
    }
}

FirstBaptistChurch.code = '01059';

module.exports = FirstBaptistChurch;
