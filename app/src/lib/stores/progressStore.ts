import { writable } from 'svelte/store';
import type { Progress, GameResult } from '../types/progress';

// Initialize with default values
const defaultProgress: Progress = {
    totalWordsLearned: 0,
    successRate: 0,
    streak: {
        current: 0,
        lastPlayed: new Date().toISOString().split('T')[0]
    },
    timeStudied: 0,
    gameHistory: [],
    masteredWords: new Set()
};

function createProgressStore() {
    const { subscribe, set, update } = writable<Progress>(defaultProgress);

    // Load progress from localStorage on initialization
    if (typeof window !== 'undefined') {
        const savedProgress = localStorage.getItem('vocabularyProgress');
        if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            // Convert masteredWords back to Set
            parsed.masteredWords = new Set(parsed.masteredWords);
            set(parsed);
        }
    }

    return {
        subscribe,
        addGameResult: (result: GameResult) => update(progress => {
            // Calculate new stats
            progress.gameHistory = [...progress.gameHistory, result];
            
            // Update success rate
            const totalGames = progress.gameHistory.length;
            const totalSuccess = progress.gameHistory.reduce(
                (acc, game) => acc + (game.score / game.totalQuestions), 
                0
            );
            progress.successRate = (totalSuccess / totalGames) * 100;

            // Update streak
            const today = new Date().toISOString().split('T')[0];
            const lastPlayed = progress.streak.lastPlayed;
            
            if (lastPlayed === today) {
                // Already played today, streak continues
            } else if (new Date(lastPlayed).getTime() === new Date(today).getTime() - 86400000) {
                // Played yesterday, streak continues
                progress.streak.current += 1;
            } else {
                // Streak broken
                progress.streak.current = 1;
            }
            progress.streak.lastPlayed = today;

            // Update words learned
            result.wordsPlayed.forEach(word => {
                if (result.score / result.totalQuestions >= 0.8) { // Consider word mastered if success rate is 80% or higher
                    progress.masteredWords.add(word);
                }
            });
            progress.totalWordsLearned = progress.masteredWords.size;

            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('vocabularyProgress', JSON.stringify({
                    ...progress,
                    masteredWords: Array.from(progress.masteredWords)
                }));
            }

            return progress;
        }),
        addStudyTime: (minutes: number) => update(progress => {
            progress.timeStudied += minutes;
            return progress;
        }),
        reset: () => {
            set(defaultProgress);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('vocabularyProgress');
            }
        }
    };
}

export const progressStore = createProgressStore();