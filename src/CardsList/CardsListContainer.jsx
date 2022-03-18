import { connect } from 'react-redux';
import {updateAllInfoAboutSelectedCards, updateCardsSequence, updateCardsSearchedOrSelected} from '../react-redux-store/cardsSlice';


import CardsList from './CardsList';

const mapStateToProps = state => {
    return {
        cards: state.cards,
        cardsSequence: state.cardsSequence,
        cardsSearchedOrSelected: state.cardsSearchedOrSelected
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateAllInfoAboutSelectedCards: infoObjects => dispatch(updateAllInfoAboutSelectedCards(infoObjects)),
        updateCardsSequence: newCardsSequence => dispatch(updateCardsSequence(newCardsSequence)),
        updateCardsSearchedOrSelected: newObtainedSequence => dispatch(updateCardsSearchedOrSelected(newObtainedSequence)),        
    };
};

const CardsListContainer = connect(mapStateToProps, mapDispatchToProps) (CardsList);

export default CardsListContainer;