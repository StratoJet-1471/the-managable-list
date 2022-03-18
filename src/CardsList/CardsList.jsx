import React, {useEffect, useState} from 'react';

import CardContainer from '../Card/CardContainer';
import {BROWSER_STORAGE_KEY} from '../auxiliary-js-modules/defaults';

import './CardsList.css';

export default function CardsList({
    cards, 
    cardsSequence, 
    cardsSearchedOrSelected, 
    updateAllInfoAboutSelectedCards, 
    updateCardsSequence, 
    updateCardsSearchedOrSelected, 
    useCardsSearchedOrSelected, 
    length}) {
    const [draggingCardInfo, setDraggingCardInfo] = useState({cardId: null, cardIndexInSequence: null}); 
    const operativeCardsSequence = (useCardsSearchedOrSelected) ? cardsSearchedOrSelected : cardsSequence;
    const updateOperativeCardsSequence = (useCardsSearchedOrSelected) ? updateCardsSearchedOrSelected : updateCardsSequence;

    const updateSessionStorage = (cardIdsSequence, source) => {
        const cardInfoObjects = cardIdsSequence.map((cardId) => {return {id: cardId, selected: source[cardId].selected}; });    
        sessionStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(cardInfoObjects));
    };

    const loadStateFromBrowserStorage = (savedCardInfoObjects) => {
        //savedCardInfoObjects - массив с объектами вида {id: идентификаторКарты, selected: true/false}.

        const cardIdsSequence = savedCardInfoObjects.map((infoObj) => infoObj.id);
        updateAllInfoAboutSelectedCards(savedCardInfoObjects);
        updateCardsSequence(cardIdsSequence); 
    };

    const cardDragStartHandler = (cardId, cardIndexInSequence) => {
        setDraggingCardInfo({cardId, cardIndexInSequence});
    };

    const cardDragEndHandler = () => {
        //Для случая, когда мы взяли карту, но сбросили её не на другую карту, а где-то в стороне. В этом случае событие drop не произойдёт, поэтому надо очистить draggingCardInfo здесь. Событие dragend происходит позже drop, так что не нужно опасаться, что мы потрём данные, которые нужны в обработчике drop.
        if(draggingCardInfo.cardId!==null) setDraggingCardInfo({cardId: null, cardIndexInSequence: null});
    };
    const cardDropHandler = (cardId, cardIndexInSequence) => {
        if(cardId!==draggingCardInfo.cardId) { //Перетаскиваемую карту можно сбросить на прежнее место. В этом случае, конечно, никаких изменений производить не нужно.
            let newOperativeCardsSequence = operativeCardsSequence.slice(); //Клонируем массив.
            newOperativeCardsSequence[cardIndexInSequence] = draggingCardInfo.cardId;
            newOperativeCardsSequence[draggingCardInfo.cardIndexInSequence] = cardId;
            
            if(!useCardsSearchedOrSelected) updateSessionStorage(newOperativeCardsSequence, cards);
            
            updateOperativeCardsSequence(newOperativeCardsSequence);
        }
        setDraggingCardInfo({cardId: null, cardIndexInSequence: null});
    };

    const cardDragHandlers = {
        cardDragStartHandler,
        cardDragEndHandler,
        cardDropHandler
    };  

    useEffect(() => {
        //Нам нужно при монтировании компонента проверить содержимое sessionStorage, где хранится инфа о порядке карт и какие из них выделены, и если в sessionStorage уже что-то есть, привести список в соответствие с этой инфой, а если sessionStorage пуст, записать туда текущую инфу. 
        
        if(!useCardsSearchedOrSelected) { //sessionStorage мы используем только при обычном просмотре карт, а не когда выводим какой-то специализированный набор (результат поиска или только выделенные карты).
            const savedCardInfoObjects = sessionStorage.getItem(BROWSER_STORAGE_KEY) ? JSON.parse(sessionStorage.getItem(BROWSER_STORAGE_KEY)) : null;
            //savedCardInfoObjects - массив с объектами вида {id: идентификаторКарты, selected: true/false}.

            if(!savedCardInfoObjects) updateSessionStorage(cardsSequence, cards); //sessionStorage пуст - сохраняем в нём текущий порядок и выделение карт.
            else { //В sessionStorage уже хранится какой-то порядок и выделение карт. Используем эту инфу.
                
                loadStateFromBrowserStorage(savedCardInfoObjects);                
            }
        }        
    }, []);    

    const cardComponents = (operativeCardsSequence.length > 0) ? operativeCardsSequence.map((cardId, index) => {
        return <CardContainer key={"card" + cardId} cardId={cardId} cardIndexInSequence={index} cardInfoObject={cards[cardId]} {...cardDragHandlers}/>;
    }).slice(0, length) : null;

    return (
        <div>
            {cardComponents ? cardComponents : <span style={{color: "blue"}}>No cards found.</span>}
        </div>
    );
}