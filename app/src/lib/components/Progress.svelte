<script lang="ts">
    import { progressStore } from '../stores/progressStore';
    import { fade } from 'svelte/transition';

    // Format time studied
    $: timeStudiedFormatted = (() => {
        const hours = Math.floor($progressStore.timeStudied / 60);
        const minutes = $progressStore.timeStudied % 60;
        return `${hours}.${minutes} hrs`;
    })();

    // Format success rate
    $: successRate = Math.round($progressStore.successRate);
</script>

<div class="progress-container">
    <div class="progress-content">
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Words Learned</h3>
                <div class="stat-value">{$progressStore.totalWordsLearned}</div>
            </div>
            <div class="stat-card">
                <h3>Success Rate</h3>
                <div class="stat-value">{successRate}%</div>
            </div>
            <div class="stat-card">
                <h3>Study Streak</h3>
                <div class="stat-value">{$progressStore.streak.current} days</div>
            </div>
            <div class="stat-card">
                <h3>Time Studied</h3>
                <div class="stat-value">{timeStudiedFormatted}</div>
            </div>
        </div>
        <div class="progress-chart">
            <p>Learning progress chart will be displayed here</p>
            <!-- Add some dummy content to demonstrate scrolling -->
            {#each Array(10) as _, i}
                <div class="chart-placeholder">
                    Future chart data section {i + 1}
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .progress-container {
        position: relative;
        height: 100%; // Take full height of parent
        width: 100%;
        overflow: hidden; // Hide overflow at container level
    }

    .progress-content {
        height: 100%;
        overflow-y: auto; // Enable vertical scrolling
        padding: 1rem;
        
        /* Scrollbar styling for webkit browsers */
        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            
            &:hover {
                background: rgba(255, 255, 255, 0.4);
            }
        }
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
        text-align: center;

        h3 {
            font-size: 1rem;
            color: #e5e7eb;
            margin: 0 0 0.5rem 0;
        }

        .stat-value {
            font-size: 1.5rem;
            font-weight: 600;
            color: white;
        }
    }

    .progress-chart {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
        
        p {
            margin: 0;
            color: #e5e7eb;
            text-align: center;
        }
    }

    /* Demo content for scrolling */
    .chart-placeholder {
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        color: #e5e7eb;
        text-align: center;
    }
</style>