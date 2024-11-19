<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import WordCard from '$lib/components/WordCard.svelte';
    import type { Word } from '../types/vocabulary';
    import rawVocabularyData from '../data/vocabulary/FI.json';

    const vocabularyData = rawVocabularyData as { words: Word[] };
    
    let currentWordIndex = 0;
    let words: Word[] = [];
    let score = 0;
    let totalAnswered = 0;
    let isGameComplete = false;

    onMount(() => {
        // Shuffle words and take a subset for the game
        words = [...vocabularyData.words]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10); // Show 10 words per game
    });

    function handleAnswer(isCorrect: boolean) {
        if (isCorrect) score++;
        totalAnswered++;
        
        // Wait for animation before moving to next word
        setTimeout(() => {
            if (currentWordIndex < words.length - 1) {
                currentWordIndex++;
            } else {
                isGameComplete = true;
            }
        }, 1500);
    }

    function restartGame() {
        words = [...vocabularyData.words]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        currentWordIndex = 0;
        score = 0;
        totalAnswered = 0;
        isGameComplete = false;
    }
</script>

<div class="test-section">
    <div class="test-options">
        <button class="test-type-button">
            <span>Quick Test (10 words)</span>
            <span class="time">5 min</span>
        </button>
        <button class="test-type-button">
            <span>Full Test (30 words)</span>
            <span class="time">15 min</span>
        </button>
        <button class="test-type-button">
            <span>Custom Test</span>
            <span class="time">Variable</span>
        </button>
    </div>
    <p class="test-info">Select a test type to begin. Tests help evaluate your vocabulary knowledge.</p>
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
        color: #1a1a1a;
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
            color: #666;
            margin-bottom: 2rem;
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

