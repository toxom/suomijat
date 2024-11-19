<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import WordCard from '$lib/components/WordCard.svelte';
    import type { Word } from '../types/vocabulary';
    import type { GameResult } from '../types/progress';
    import { progressStore } from '../stores/progressStore';
    import rawVocabularyData from '../data/vocabulary/FI.json';

    const vocabularyData = rawVocabularyData as { words: Word[] };
    
    let currentWordIndex = 0;
    let words: Word[] = [];
    let knownWords = 0;
    let missedWords = 0;
    let totalAnswered = 0;
    let isGameComplete = false;
    let startTime: number;

    onMount(() => {
        startTime = Date.now();
        words = [...vocabularyData.words]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
    });

    function handleAnswer(isCorrect: boolean) {
        if (isCorrect) {
            knownWords++;
        } else {
            missedWords++;
        }
        totalAnswered++;
        
        setTimeout(() => {
            if (currentWordIndex < words.length - 1) {
                currentWordIndex++;
            } else {
                completeGame();
            }
        }, 500); // Reduced from 1500 to make game faster
    }

    function completeGame() {
        isGameComplete = true;
        
        // Calculate study time in minutes
        const endTime = Date.now();
        const studyTimeMinutes = Math.round((endTime - startTime) / 60000);
        
        // Create game result
        const gameResult: GameResult = {
            date: new Date().toISOString(),
            score: knownWords,
            totalQuestions: words.length,
            wordsPlayed: words.map(w => w.word)
        };

        // Update progress store
        progressStore.addGameResult(gameResult);
        progressStore.addStudyTime(studyTimeMinutes);
    }

    function restartGame() {
        startTime = Date.now();
        words = [...vocabularyData.words]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        currentWordIndex = 0;
        knownWords = 0;
        missedWords = 0;
        totalAnswered = 0;
        isGameComplete = false;
    }
</script>

<div class="game-container">
    {#if words.length > 0 && !isGameComplete}
        <div class="progress">
            Word {currentWordIndex + 1} of {words.length}
            <div class="progress-bar">
                <div 
                    class="progress-fill"
                    style="width: {((currentWordIndex + 1) / words.length) * 100}%"
                />
            </div>
        </div>

        <div class="score">
            <span class="known">{knownWords}</span>
            <span class="separator">/</span>
            <span class="missed">{missedWords}</span>
        </div>

        <WordCard 
            word={words[currentWordIndex]}
            {knownWords}
            {missedWords}
            onAnswer={handleAnswer}
        />
    {:else if isGameComplete}
        <div class="game-complete" transition:fade>
            <h2>Game Complete!</h2>
            <p class="final-score">
                <span class="known">{knownWords}</span> known / 
                <span class="missed">{missedWords}</span> missed
            </p>
            <button class="restart-button" on:click={restartGame}>
                Play Again
            </button>
        </div>
    {/if}
</div>

<style lang="scss">
    .game-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: auto;
        height: auto;
        margin: 0 auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }

    .progress {
        text-align: center;
        color: #666;
    }

    .progress-bar {
        margin-top: 0.5rem;
        height: 4px;
        background-color: #e5e7eb;
        border-radius: 2px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background-color: #3b82f6;
        transition: width 0.3s ease;
    }

    .score {
        text-align: center;
        font-size: 1.2rem;
        font-weight: 500;
        margin-bottom: 1rem;

        .known {
            color: #166534;
        }

        .separator {
            margin: 0 0.5rem;
            color: #666;
        }

        .missed {
            color: #991b1b;
        }
    }

    .game-complete {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

        h2 {
            font-size: 2rem;
            color: #1a1a1a;
            margin: 0 0 1rem 0;
        }

        .final-score {
            font-size: 1.5rem;
            margin-bottom: 2rem;

            .known {
                color: #166534;
                font-weight: 500;
            }

            .missed {
                color: #991b1b;
                font-weight: 500;
            }
        }
    }

    .restart-button {
        background-color: #3b82f6;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background-color: #2563eb;
        }
    }
</style>