<script lang="ts">
    import { fade } from 'svelte/transition';
    import type { Word } from '../types/vocabulary';
    import { Check, X } from 'lucide-svelte';
    
    export let word: Word;
    export let onAnswer: (isCorrect: boolean) => void;
    export let knownWords = 0;
    export let missedWords = 0;
    
    let isFlipped = false;
    let hasAnswered = false;
    let selfAssessment: boolean | null = null;

    function handleFlip() {
        if (!hasAnswered) {
            isFlipped = !isFlipped;
        }
    }

    function handleAnswer(correct: boolean) {
        if (!hasAnswered) {
            hasAnswered = true;
            selfAssessment = correct;
            onAnswer(correct);
        }
    }

    // Reset card state when word changes
    $: if (word) {
        isFlipped = false;
        hasAnswered = false;
        selfAssessment = null;
    }
</script>

<div 
    class="word-card {isFlipped ? 'flipped' : ''} {hasAnswered ? 'answered' : ''}"
    on:click={handleFlip}
    transition:fade
>
    <div class="stats-display">
        <!-- <span class="known">{knownWords}</span>
        <span class="separator">/</span>
        <span class="missed">{missedWords}</span> -->
    </div>

    <div class="card-inner">
        <div class="card-front">
            <h2>{word.word}</h2>
            <p class="type-label">{word.type}</p>
        </div>
        <div class="card-back">
            <div class="assessment-buttons">
                <button 
                    class="assessment-button correct"
                    on:click|stopPropagation={() => handleAnswer(true)}
                >
                    <Check size={24} />
                    I knew this
                </button>
                <button 
                    class="assessment-button incorrect"
                    on:click|stopPropagation={() => handleAnswer(false)}
                >
                    <X size={24} />
                    Still learning
                </button>
            </div>
        </div>
    </div>

    {#if !isFlipped}
        <div class="flip-hint">Click to flip</div>
    {/if}
</div>

<style lang="scss">
    .word-card {
        perspective: 1000px;
        width: 300px;
        height: 300px;
        cursor: pointer;
        margin: 0 auto;
        position: relative;
    }

    .stats-display {
        position: absolute;
        top: -30px;
        width: 100%;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 500;
        z-index: 10;

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

    .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.2s;
    }

    .flipped .card-inner {
        transform: rotateY(180deg);
    }

    .card-front,
    .card-back {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }

    .card-back {
        transform: rotateY(180deg);
    }
    h2 {
        font-size: 2.5rem;
        margin: 0;
        text-align: center;
        color: #1a1a1a;
    }

    .type-label {
        margin-top: 1rem;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        text-transform: capitalize;
        font-size: 0.9rem;

        .verb & {
            background-color: #e0f2fe;
            color: #0369a1;
        }
        
        .adjective & {
            background-color: #fef3c7;
            color: #92400e;
        }
        
        .noun & {
            background-color: #dcfce7;
            color: #166534;
        }
    }

    .assessment-buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }

    .assessment-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
            transform: translateY(-2px);
        }

        &.correct {
            background-color: #dcfce7;
            color: #166534;
        }

        &.incorrect {
            background-color: #fee2e2;
            color: #991b1b;
        }
    }

    .result {
        font-size: 1.5rem;
        font-weight: 500;
        padding: 1rem;
        border-radius: 6px;
        text-align: center;

        &.correct {
            background-color: #dcfce7;
            color: #166534;
        }

        &.incorrect {
            background-color: #fee2e2;
            color: #991b1b;
        }
    }

    .flip-hint {
        position: absolute;
        bottom: -30px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 0.9rem;
        color: #666;
        opacity: 0.7;
    }
</style>