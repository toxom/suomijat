<script lang="ts">
    import { onMount } from 'svelte';

    export let text: string;
    export let minSpeed: number = 2;
    export let maxSpeed: number = 10;

    let displayText = '';
    let index = 0;
    let showCursor = true;

    function getRandomSpeed() {
        return Math.floor(Math.random() * (maxSpeed - minSpeed + 2)) + minSpeed;
    }

    function typeNextCharacter() {
        if (index < text.length) {
            displayText += text[index];
            index++;
            
            const delay = text[index - 1] === ' ' ? getRandomSpeed() / 1 : getRandomSpeed();
            setTimeout(typeNextCharacter, delay);
        }
    }

    onMount(() => {
        typeNextCharacter();

        const cursorInterval = setInterval(() => {
            showCursor = !showCursor;
        }, 100);

        return () => clearInterval(cursorInterval);
    });
</script>

<p>{displayText}<span class:blink={showCursor}>|</span></p>

<style>
    p {
        display: flex;
        line-height: 1.5;
        text-align: justify;
        font-size: 1.2rem;
        color: #fff;
        margin-top: 2rem;
        font-size: 24px;
        white-space: pre-wrap;
        transition: transform 1.3s cubic-bezier(0.075, 0.82, 0.165, 1);

    }

    p:hover {
        transform: scale(1.05) translateX(5px) translatey(5px) rotate(3deg);          

    }

    .blink {
        opacity: 0;
        transition: opacity 0.1s;
    }
</style>