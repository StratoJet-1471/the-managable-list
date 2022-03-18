import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchInfo = createAsyncThunk(
    'fetchInfo',
    async function(_, {rejectWithValue}) {
        const sourceUrl = "https://jsonplaceholder.typicode.com/posts";
        const fetch_options = {
          method: 'GET',
        };   

        try {
            const response = await fetch(sourceUrl, fetch_options);

            if(response.ok) return await response.json();
            else throw new Error("BAD RESPONSE STATUS: " + response.status)

        } catch(err) {
            return rejectWithValue(err.message);
        }
    }
);


const cardsSlice = createSlice({ 
    name: 'cards',
    initialState: {
        cards: {}, //После загрузки данных карт свойства будут выглядеть так: "идентификаторКарты":{selected: true/false, content: "..."}
        cardsSequence: [], //["идентификаторКарты-1", "идентификаторКарты-2", ...] в последовательности, в которой карты показываются на экране сверху вниз.
        cardsSearchedOrSelected: [], //Аналог cardsSequence для списка карт, полученного в результате поиска или применения фильтра "только выделенные".
        fetchInfoStatus: null, //"pending", "fulfilled", "rejected"
    },
    reducers: {
        selectCard: (state, action) => { 
            const cardId = String(action.payload);
            state.cards[cardId].selected = true; 
        },
        deselectCard: (state, action) => { 
            const cardId = String(action.payload);
            state.cards[cardId].selected = false; 
        },
        updateAllInfoAboutSelectedCards: (state, action) => {//action.payload - массив объектов вида {id: идентификаторКарты, selected: true/false}.
            for (let infoObj of action.payload) {
                state.cards[infoObj.id].selected = infoObj.selected;
            }
        },
        updateCardsSequence: (state, action) => {
            state.cardsSequence = action.payload;
        },
        updateCardsSearchedOrSelected: (state, action) => {
            state.cardsSearchedOrSelected = action.payload
        },
        resetCardsStateToDefault: (state) => {
            for (let cardId in state.cards) {
                state.cards[cardId].selected = false;
            }
            state.cardsSequence = Object.keys(state.cards);
        }
    },

    extraReducers: {
        [fetchInfo.pending]: (state) => {
            state.fetchInfoStatus = "pending";
        },
        [fetchInfo.fulfilled]: (state, action) => {            
            state.fetchInfoStatus = "fulfilled";

            for (let obj of action.payload) {
                state.cards[String(obj.id)] = {selected: false, content: obj.body};
            }

            state.cardsSequence = Object.keys(state.cards);
        },
        [fetchInfo.rejected]: (state) => {
            state.fetchInfoStatus = "rejected";
        },
    }
});
export const {selectCard, deselectCard, updateAllInfoAboutSelectedCards, updateCardsSequence, updateCardsSearchedOrSelected, resetCardsStateToDefault} = cardsSlice.actions;
export const cardsReducer = cardsSlice.reducer;