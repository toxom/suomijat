// stores/gameStore.ts
import { writable, derived } from 'svelte/store';
import type { GameState, Word } from '../types/game';

function createGameStore() {
    const initialState: GameState = {
        currentWordIndex: 0,
        score: 0,
        words: [],
        answers: new Map(),
        isGameComplete: false
    };

    const { subscribe, set, update } = writable<GameState>(initialState);

    return {
        subscribe,
        initializeGame: (words: Word[]) => {
            const shuffledWords = [...words].sort(() => Math.random() - 0.5);
            set({ ...initialState, words: shuffledWords });
        },
        submitAnswer: (wordId: string, isCorrect: boolean) => {
            update(state => {
                const newAnswers = new Map(state.answers);
                newAnswers.set(wordId, isCorrect);
                
                return {
                    ...state,
                    score: isCorrect ? state.score + 1 : state.score,
                    currentWordIndex: state.currentWordIndex + 1,
                    answers: newAnswers,
                    isGameComplete: state.currentWordIndex + 1 >= state.words.length
                };
            });
        },
        reset: () => set(initialState)
    };
}

export const gameStore = createGameStore();
export const currentWord = derived(gameStore, $game => 
    $game.words[$game.currentWordIndex]
);
export const progress = derived(gameStore, $game => ({
    current: $game.currentWordIndex + 1,
    total: $game.words.length,
    percentage: (($game.currentWordIndex + 1) / $game.words.length) * 100
}));