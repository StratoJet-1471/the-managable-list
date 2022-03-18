import React, {useState, useEffect} from 'react';

import CardsListContainer from '../CardsList/CardsListContainer';
import {CARDS_LIST_CHUNK_SIZE, BROWSER_STORAGE_KEY} from '../auxiliary-js-modules/defaults';

import '../auxiliary-css/cross-modules-elements.css';
import './Main.css';

export default function Main({cards, cardsSequence, fetchInfoStatus, updateCardsSearchedOrSelected, resetCardsStateToDefault, fetchInfo}) {
    const [selectedCardsOnlyFilter, setSelectedCardsOnlyFilter] = useState(false);
    const [isSearchResult, setIsSearchResult] = useState(false);
    const [cardsListLength, setCardsListLength] = useState(CARDS_LIST_CHUNK_SIZE);
    const [shouldExpandCardsList, setShouldExpandCardsList] = useState(false);

    const search = (e) => {
        e.preventDefault();
        const foundCardEntires = Object.entries(cards).filter((cardEntire) => {
            const card = cardEntire[1];
            return card.content.toLowerCase().includes(e.target.search.value.toLowerCase().trim());
        });
        const foundCardIds = foundCardEntires.map((entire) => entire[0]);
        setIsSearchResult(true);
        if(selectedCardsOnlyFilter) setSelectedCardsOnlyFilter(false);
        updateCardsSearchedOrSelected(foundCardIds);
    };

    const resetAll = () => {
        sessionStorage.removeItem(BROWSER_STORAGE_KEY);
        resetCardsStateToDefault();
        setSelectedCardsOnlyFilter(false);
        setIsSearchResult(false);
        resetCardsSearchedOrSelected();
    };

    const resetCardsSearchedOrSelected = () => {
        updateCardsSearchedOrSelected([]);
    }

        
    const toggleSelectedCardsOnlyFilter = () => {
        if(selectedCardsOnlyFilter) {//Нужно выключить
            setSelectedCardsOnlyFilter(false);
            resetCardsSearchedOrSelected();
        }
        else { //Нужно включить
            const selectedCardIds = cardsSequence.filter((cardId) => { 
                if(cards[cardId].selected) return true;
                return false;
            });
            setSelectedCardsOnlyFilter(true);
            if(isSearchResult) setIsSearchResult(false);
            updateCardsSearchedOrSelected(selectedCardIds);
        }       
    };

    const resetSearchResult = () => {
        if(isSearchResult) {
            setIsSearchResult(false);
            resetCardsSearchedOrSelected();
        }
    };

    //Ловим момент, когда домотаем почти до низа страницы, и даём команду расширить список.
    const scrollHandler = (e) => {
        if(e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
            setShouldExpandCardsList(true);
        }
        else setShouldExpandCardsList(false);
    };

    //Вешаем слушатель на скролл.
    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);
        return () => document.removeEventListener('scroll', scrollHandler);
    }, []);

    useEffect(() => fetchInfo(), []);   
    
    //Расширяем показываемый список. 
    useEffect(() => {
        if(shouldExpandCardsList) {
            if(cardsListLength <= cardsSequence.length - CARDS_LIST_CHUNK_SIZE) setCardsListLength(cardsListLength + CARDS_LIST_CHUNK_SIZE);
            else setCardsListLength(cardsSequence.length);
        }
    }, [shouldExpandCardsList]);

    if(fetchInfoStatus==='pending' || fetchInfoStatus===null) return <span>Loading...</span>;
    if(fetchInfoStatus==='rejected') return <span className='error-text'>Fetch error!</span>;

    return (
        <div className='uni-centering-container uni-centering-container_column'>
            <div className="content-container">
                <header> 
                    <div className='uni-centering-container' style={{justifyContent:'flex-start', paddingBottom:'3px'}}>
                        <span className='reset-all' title='Resets cards sequence to default' onClick={() => resetAll()}>Reset all</span>
                    </div>
                    <div className="controls-panel">
                        <div><input type="checkbox" checked={selectedCardsOnlyFilter} onChange={() => toggleSelectedCardsOnlyFilter()}/> Selected only</div>
                        
                        <div style={{display:'flex', flexDirection:'row', alignItems: 'center', justifyContent:'center'}}>
                            <button className='controls-panel__button' onClick={ () => resetSearchResult()}>Reset search results</button>
                            <form className='controls-panel__form' onSubmit={(e) => search(e)}>
                                <input className='controls-panel__text-input' type="text" name="search" style={{marginRight: '3px'}}/>
                                <button className='controls-panel__button'>Find</button>
                            </form>
                        </div>
                    </div>
                </header>
                <main>                    
                    <CardsListContainer useCardsSearchedOrSelected={selectedCardsOnlyFilter || isSearchResult || false} length={cardsListLength}/>
                </main>
            </div>
        </div>
    );
}
