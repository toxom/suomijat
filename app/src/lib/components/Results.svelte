<script lang="ts">
    import type { Word } from '$lib/types/game';
    
    export let score: number;
    export let total: number;
    export let answers: Map<string, boolean>;
    export let words: Word[];
    
    $: percentage = Math.round((score / total) * 100);
</script>

<div class="result-container">
    <h2>Game Complete!</h2>
    <div class="score">
        Score: {score}/{total} ({percentage}%)
    </div>
    
    <div class="answers-review">
        {#each words as word}
            <div class="answer-item {answers.get(word.id) ? 'correct' : 'incorrect'}">
                <span>{word.word}</span>
                <span>{word.translation}</span>
            </div>
        {/each}
    </div>
</div>