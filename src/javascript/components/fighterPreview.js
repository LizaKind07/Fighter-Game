import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    const fighterImage = createFighterImage(fighter);
    fighterElement.appendChild(fighterImage);

    const fighterName = createElement({
        tagName: 'div',
        className: 'fighter-preview___name',
        innerText: fighter.name
    });
    fighterElement.appendChild(fighterName);

    const fighterHealth = createElement({
        tagName: 'div',
        className: 'fighter-preview___health',
        innerText: `Health: ${fighter.health}`
    });
    fighterElement.appendChild(fighterHealth);
    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

