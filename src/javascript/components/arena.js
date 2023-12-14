import createElement from '../helpers/domHelper';
import { createFighterImage } from './fighterPreview';

function createFighter(fighter, position) {
    const imgElement = createFighterImage(fighter);
    const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
    const fighterElement = createElement({
        tagName: 'div',
        className: `arena___fighter ${positionClassName}`
    });

    fighterElement.append(imgElement);
    return fighterElement;
}

function createFighters(firstFighter, secondFighter) {
    const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
    const firstFighterElement = createFighter(firstFighter, 'left');
    const secondFighterElement = createFighter(secondFighter, 'right');

    battleField.append(firstFighterElement, secondFighterElement);
    return battleField;
}

function createHealthIndicator(fighter, position) {
    const { name } = fighter;
    const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
    const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
    const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
    const bar = createElement({
        tagName: 'div',
        className: 'arena___health-bar',
        attributes: { id: `${position}-fighter-indicator` }
    });

    fighterName.innerText = name;
    indicator.append(bar);
    container.append(fighterName, indicator);

    return container;
}

function createHealthIndicators(leftFighter, rightFighter) {
    const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
    const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
    const leftFighterIndicator = createHealthIndicator(leftFighter, 'left');
    const rightFighterIndicator = createHealthIndicator(rightFighter, 'right');

    healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
    return healthIndicators;
}

function createArena(selectedFighters) {
    const arena = createElement({ tagName: 'div', className: 'arena___root' });
    const healthIndicators = createHealthIndicators(...selectedFighters);
    const fighters = createFighters(...selectedFighters);

    arena.append(healthIndicators, fighters);
    return arena;
}


function addKeyListeners(onKeyPress) {
    document.addEventListener('keydown', onKeyPress);
}

function removeKeyListeners(onKeyPress) {
    document.removeEventListener('keydown', onKeyPress);
}

function determineWinner(firstFighter, secondFighter) {
    return firstFighter.health > 0 ? firstFighter : secondFighter;
}

function showWinnerModal(winner) {
    const modal = createElement({
        tagName: 'div',
        className: 'modal'
    });

    const winnerText = createElement({
        tagName: 'p',
        className: 'modal__text',
        innerText: `Winner: ${winner.name}`
    });

    modal.appendChild(winnerText);
    document.body.appendChild(modal);
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

let lastCriticalHitTime = 0;
const criticalHitCooldown = 10000; 

function getHitPower(fighter) {
    const { attack, defense } = fighter;
    const criticalHitChance = getRandomNumber(1, 2);
    const currentTime = Date.now();
    if (currentTime - lastCriticalHitTime < criticalHitCooldown) {
        return 0;
    }

    lastCriticalHitTime = currentTime;

    return attack * criticalHitChance;
}

function getBlockPower(fighter) {
    const { defense } = fighter;
    const dodgeChance = getRandomNumber(1, 2);

    return defense * dodgeChance;
}


function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);

    const damage = hitPower - blockPower > 0 ? hitPower - blockPower : 0;

    return damage;
}

function updateHealthIndicator(fighter, position, damage) {
    const healthBar = document.getElementById(`${position}-fighter-indicator`);
    const currentWidth = healthBar.clientWidth;

    const newWidth = currentWidth - damage;

    healthBar.style.width = `${newWidth}px`;
}

function fight(firstFighter, secondFighter) {
    return new Promise((resolve) => {
        let isBlocked = false;

        function handleKeyPress(event) {
            const { key } = event;

            if (!isBlocked) {
                const damage = getDamage(firstFighter, secondFighter);

                updateHealthIndicator(secondFighter, 'right', damage);
                const winner = determineWinner(firstFighter, secondFighter);

                if (winner) {
                    removeKeyListeners(handleKeyPress);
                    showWinnerModal(winner);
                    resolve();
                }
            }
        }
        addKeyListeners(handleKeyPress);
    });
}




export default function renderArena(selectedFighters) {
    const root = document.getElementById('root');
    const arena = createArena(selectedFighters);

    root.innerHTML = '';
    root.append(arena);

    fight(...selectedFighters);
}
