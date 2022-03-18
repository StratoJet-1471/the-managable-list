import React, {useState} from 'react';
import {BROWSER_STORAGE_KEY} from '../auxiliary-js-modules/defaults';

import './Card.css';

export default function Card({
    selectCard, 
    deselectCard, 
    cardId, 
    cardIndexInSequence,
    cardInfoObject: {
        selected, 
        content
    }, 
    cardDragStartHandler,
    cardDragEndHandler,
    cardDropHandler
}) {

    const [additionalClassName, setAdditionalClassName] = useState('');

    const cardClass = selected ? 'card card_selected' : 'card';

    const onDragStart = () => {
        cardDragStartHandler(cardId, cardIndexInSequence); //Вызывается у карты, когда её "хватают" мышью
    };

    const onDragOver = (e) => {//Вызывается у карты, над которой находится курсор, перетаскивающий другую карту.
        e.preventDefault(); 
    };

    const onDragEnter = () => { //Вызывается у карты, над которой проносят перетаскиваемую, в момент, когда курсор оказывается в её пределах.
        setAdditionalClassName(' card_drag-over');
    };

    const onDragLeave = () => {//Вызывается у карты, над которой проносят перетаскиваемую, когда курсор покидает её пределы (т.е., перетаскивающий курсор на неё зашёл, а теперь уходит).
        setAdditionalClassName('');
    };

    const onDragEnd = () => {//Вызывается у перетаскиваемой карты, когда её "сбрасывают".
        cardDragEndHandler();
    };

    const onDrop = (e) => {//Вызывается у карты, на которую "сбросили" перетаскиваемую карту (курсор должен находиться над картой - если он будет вне её, событие не произойдёт).
        e.preventDefault();
        setAdditionalClassName('');
        cardDropHandler(cardId, cardIndexInSequence);     
    };

    const propsForDragging = {
        draggable: true,
        onDragStart, 
        onDragEnter,
        onDragLeave, 
        onDragEnd, 
        onDragOver, 
        onDrop
    };

    const updateSessionStorageByCardSelect = (newSelected) => {
        const savedCardInfoObjects = sessionStorage.getItem(BROWSER_STORAGE_KEY) ? JSON.parse(sessionStorage.getItem(BROWSER_STORAGE_KEY)) : null;
        //savedCardInfoObjects - массив с объектами вида {id: идентификаторКарты, selected: true/false}.

        if(savedCardInfoObjects) {
            savedCardInfoObjects[cardIndexInSequence].selected = newSelected;
            sessionStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(savedCardInfoObjects));
        }
    };

    return (
        <div className={cardClass + additionalClassName} {...propsForDragging}>
            <span className='card__title'>Card {cardId}:</span>
            <span>{content}</span>
            <input type="checkbox" checked={selected} onChange={() => {
                if(selected) {
                    updateSessionStorageByCardSelect(false);
                    deselectCard(cardId);
                }
                else {
                    updateSessionStorageByCardSelect(true);
                    selectCard(cardId);
                }
            }}/>
        </div>
    );
}