import { connect } from 'react-redux';
import {updateCardsSequence, updateCardsSearchedOrSelected, fetchInfo, resetCardsStateToDefault} from '../react-redux-store/cardsSlice';

import Main from './Main';

const mapStateToProps = state => {
    return {
        cards: state.cards,
        cardsSequence: state.cardsSequence,
        fetchInfoStatus: state.fetchInfoStatus
    };
};

const mapDispatchToProps = (dispatch) => {
    return {        
        updateCardsSearchedOrSelected: newObtainedSequence => dispatch(updateCardsSearchedOrSelected(newObtainedSequence)),
        resetCardsStateToDefault: () => dispatch(resetCardsStateToDefault()),
        fetchInfo: () => dispatch(fetchInfo())
    };
};

const MainContainer = connect(mapStateToProps, mapDispatchToProps) (Main);

export default MainContainer;