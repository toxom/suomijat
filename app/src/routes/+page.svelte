<script lang="ts">
    import { fly, fade, slide, scale } from 'svelte/transition';
    import { cubicIn, cubicOut } from 'svelte/easing';
    import { Calculator, Bell, MapPin, CircleX, ChartPie, LogIn, User, LogOut, MessageCircle, Filter, FilterX, BarChart, Settings, Info, ToggleLeft, ToggleRight, Maximize2, Minimize2 } from 'lucide-svelte';
    import Vocabulary from '$lib/components/Vocabulary.svelte';
	import VocabularyGame from '$lib/components/VocabularyGame.svelte';
    import Progress from '$lib/components/Progress.svelte';
    import Information from '$lib/components/Information.svelte';
    import Test from '$lib/components/Test.svelte';
    import { drag } from '$lib/actions/drag';

    
    let selectedCountry: string | null = null;
    let hoveredButton: string | null = null;

    let activeLink = '/'; 
    let overlayState = {
        vocabulary: { active: true, expanded: false },
        game: { active: true, expanded: false },
        progress: { active: true, expanded: false },
        info: { active: true, expanded: false },
        test: { active: true, expanded: false }
    };

    let allToggled = true;

    function handleMouseEnter(buttonName: string) {
        hoveredButton = buttonName;
    }

    function handleMouseLeave() {
        hoveredButton = null;
    }


    function handleOverlayClick(name: keyof typeof overlayState, e: Event) {
        if (!overlayState[name].expanded) {
            toggleExpand(name);
        }
    }

    function handleDragEnd(name: keyof typeof overlayState) {
        if (overlayState[name].expanded) {
            overlayState[name].expanded = false;
            overlayState = { ...overlayState };
        }
    }

    function handleBackdropClick(name: keyof typeof overlayState) {
        if (overlayState[name].expanded) {
            overlayState[name].expanded = false;
            overlayState = { ...overlayState };
        }
    }

    function toggleOverlay(overlayName: keyof typeof overlayState) {
        overlayState[overlayName].active = !overlayState[overlayName].active;
        if (!overlayState[overlayName].active) {
            overlayState[overlayName].expanded = false;
        }
        overlayState = { ...overlayState };
        activeLink = overlayName;
        updateAllToggledState();
    }

    function toggleExpand(overlayName: keyof typeof overlayState) {
        overlayState[overlayName].expanded = !overlayState[overlayName].expanded;
        overlayState = { ...overlayState };
    }

    function toggleAll() {
        allToggled = !allToggled;
        Object.keys(overlayState).forEach(key => {
            overlayState[key].active = allToggled;
            if (!allToggled) {
                overlayState[key].expanded = false;
            }
        });
        overlayState = { ...overlayState };
    }

    function updateAllToggledState() {
        allToggled = Object.values(overlayState).every(value => value.active === true);
    }


    function getCustomTransition(name: string) {
        switch (name) {
            case 'filxer':
                return { x:-200, y: 250, duration: 400, easing: cubicOut };
            case 'game':
                return { y: -250, duration: 400, easing: cubicOut };
            case 'progress':
                return { x: 250, y: -250, duration: 400, easing: cubicOut };
            case 'info':
                return { x: -250, duration: 400, easing: cubicOut };
            case 'test':
                return { x: 250, y: 250, duration: 400, easing: cubicOut };
            default:
                return { y: 250, duration: 300 };
        }
    }
</script>

<div class="map-container">


    <div class="bottom-buttons">
        <button 
            class="toggle-button toggle-all-button" 
            class:active={allToggled}
            on:click={toggleAll}
            on:mouseenter={() => handleMouseEnter('toggleAll')}
            on:mouseleave={handleMouseLeave}
        >
            {#if allToggled}
                <ToggleRight size={20} />
            {:else}
                <ToggleLeft size={20} />
            {/if}
            <span class="button-text" class:visible={hoveredButton === 'toggleAll' || allToggled}>
                {allToggled ? 'Hide All' : 'Show All'}
            </span>
        </button>
        {#each Object.entries(overlayState) as [name, state]}
            <button 
                class="toggle-button" 
                class:active={state.active}
                on:click={() => toggleOverlay(name)}
                on:mouseenter={() => handleMouseEnter(name)}
                on:mouseleave={handleMouseLeave}
            >
                {#if name === 'vocabulary'}
                    {#if state.active}
                        <FilterX size={20} />
                    {:else}
                        <Filter size={20} />
                    {/if}
                {:else if name === 'game'}
                    <BarChart size={20} />
                {:else if name === 'progress'}
                    <Settings size={20} />
                {:else if name === 'info'}
                    <Info size={20} />
                {:else if name === 'test'}
                    <ChartPie size={20} />
                {/if}
                <span class="button-text" class:visible={hoveredButton === name || state.active}>
                    {state.active ? `Hide ${name}` : name}
                </span>
            </button>
        {/each}
    </div>
</div>

{#each Object.entries(overlayState) as [name, state]}
    {#if state.active}
        {#if state.expanded}
            <div 
                class="backdrop"
                on:click={() => handleBackdropClick(name)}
                transition:fade={{ duration: 200 }}
            />
        {/if}
        <div 
            class="overlay {name}-overlay" 
            class:expanded={state.expanded}
            transition:fly={getCustomTransition(name)}
            on:click={() => !state.expanded && toggleExpand(name)}
            use:drag={{
                onDragEnd: () => handleDragEnd(name)
            }}
        >
            {#if name === 'vocabulary'}
                <h2>Finnish Vocabulary</h2>
                <Vocabulary/>
            {:else if name === 'game'}
                <VocabularyGame />
            {:else if name === 'progress'}
                <h2>Progress</h2>
                <Progress />
            {:else if name === 'info'}
                <h2>About Finnish Learning</h2>
                <Information />
            {:else if name === 'test'}
                <h2>Vocabulary Test</h2>
                <Test />
            {/if}
            <button class="close-button" on:click={(e) => { e.stopPropagation(); toggleOverlay(name); }}>
                <CircleX size={20} />
            </button>
            <button class="expand-button" on:click={(e) => { e.stopPropagation(); toggleExpand(name); }}>
                {#if state.expanded}
                    <Minimize2 size={20} />
                {:else}
                    <Maximize2 size={20} />
                {/if}
            </button>
        </div>
    {/if}
{/each}
<style>
    .map-container {
        position: fixed;
        bottom: 0;
        width: 98%;
        height: auto;
        background-color: rgb(0, 0, 0);
    }

    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1999;
    }

    .overlay {
        position: fixed;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        background-color: rgb(31, 31, 31);
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        margin: 1rem;
        color: rgb(255, 255, 255);
        /* z-index: 10; */
        transition: all 0.3s ease;
        cursor: pointer;
        user-select: none;
    }

    .overlay.expanded {
        width: 98% !important;
        height: 90% !important;
        top: 3% !important;
        left: auto !important;
        right: auto !important;
        bottom: 500px !important;
        z-index: 2000;
        cursor: default;
    }

    .vocabulary-overlay {
        bottom: 7%;
        width: 25%;
        height: auto;
        border: 3px solid green;
    }

    .info-overlay {
        width: 25%;
        height: 15%;
        top: 60px;
        border: 3px solid green;

    }

    .test-overlay {
        bottom: 7%;
        right: 1%;
        width: 68%;
        height: 57%;
        border: 3px solid green;

    }

    .game-overlay {
        top: 60px;
        right: 1%;
        width: 23%;
        height: 25.5%;
        border: 3px solid green;

    }

    .progress-overlay {
        left: 29%;
        top: 60px;
        width: 42%;
        height: 25.5%;
        border: 3px solid green;

    }

    .bottom-buttons {
        display: flex;
        flex-direction: row;
        position: fixed;
        justify-content: center;
        width: 100%;
        bottom: 0.5rem;
        left: 30px;
        gap: 1rem;
        z-index: 20;
        user-select: none;
    }

    .toggle-button {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 60px;
        height: 60px;
        border: 1px solid #333;
        border-radius: 20px;
        background-color: rgb(255, 255, 255);
        padding: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        overflow: hidden;
        font-size: 16px;
    }

    .toggle-button:hover,
    .toggle-button.active {
        width: auto;
        padding-right: 1rem;
        width: 160px;
    }

    .toggle-all-button {
        background-color: #4CAF50;
        color: white;
    }

    .toggle-all-button.active {
        background-color: #f44336;
    }

    .button-text {
        white-space: nowrap;
        opacity: 0;
        max-width: 0;
        transition: opacity 0.3s ease, max-width 0.3s ease;
    }

    .button-text.visible {
        opacity: 1;
        max-width: 200px;
    }

    .close-button, .expand-button {
        position: absolute;
        color: #ffffff;
        border-radius: 50%;
        top: 10px;
        background-color: transparent;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .close-button {
        right: 10px;

        &:hover {
            color: red;
        }
    }

    .expand-button {
        right: 40px;

        &:hover {
            color: rgb(0, 255, 119);
        }
    }


    /* .close-button {
        position: absolute;
        color: red;
        border-radius: 50%;
        top: 10px;
        right: 10px;
        background-color: transparent;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    } */

    .side-nav {
        position: absolute;
        top: 0;
        right: -40px; 
        width: 40%;
        height: 100%;
        color: white;
        transition: right 0.3s ease-in-out;
        padding: 20px;
        box-sizing: border-box;
        background: linear-gradient(
            90deg,
            rgba(117, 118, 114, 0.9) 0%,
            rgba(0, 0, 0, 0.85) 5%,
            rgba(117, 118, 114, 0.8) 10%,
            rgba(117, 118, 114, 0.75) 15%,
            rgba(117, 118, 114, 0.7) 20%,
            rgba(0, 0, 0, 0.65) 25%,
            rgba(117, 118, 114, 0.6) 30%,
            rgba(0, 0, 0, 0.55) 35%,
            rgba(0, 0, 0, 0.5) 40%,
            rgba(117, 118, 114, 0.45) 45%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.35) 55%,
            rgba(117, 118, 114, 0.3) 60%,
            rgba(117, 118, 114, 0.25) 65%,
            rgba(117, 118, 114, 0.2) 70%,
            rgba(117, 118, 114, 0.15) 75%,
            rgba(0, 0, 0, 0.1) 80%,
            rgba(1, 1, 1, 0.05) 85%,
            rgba(117, 118, 114, 0) 100%
        );
        backdrop-filter: blur(10px);
        animation: pulsate 1.5s infinite alternate;
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
        font-size: 40px;
        z-index: 5;
    }

    .side-nav.open {
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }



    .flag-container {
        margin-top: 20px;
        text-align: center;
        /* position: absolute; */
        top: 20px;
        z-index: 10000;
    }

    .country-flag {
        max-width: 100%;
        height: auto;
        border: 1px solid #ffffff;
    }

    .country-code {
        font-size: 0.6em;
        color: #cccccc;
    }

    p {
        font-size: 20px;
    }


    
</style>