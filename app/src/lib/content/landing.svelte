<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { Book, Brain, Globe2, Languages, MessageCircle } from 'lucide-svelte';

    let isVisible = false;

    const features = [
        {
            icon: Book,
            title: 'Comprehensive Vocabulary',
            description: 'Learn essential Finnish words and phrases through our curated content'
        },
        {
            icon: Brain,
            title: 'Smart Learning',
            description: 'Adaptive system that learns from your progress and adjusts accordingly'
        },
        {
            icon: MessageCircle,
            title: 'Interactive Practice',
            description: 'Engage with interactive exercises and real-world scenarios'
        },
        {
            icon: Languages,
            title: 'Grammar Focus',
            description: 'Master Finnish grammar through structured lessons and examples'
        }
    ];

    // Show content after a small delay for smooth entry
    setTimeout(() => {
        isVisible = true;
    }, 100);
</script>

<div class="landing-container" transition:fade={{ duration: 300 }}>
    {#if isVisible}
        <div class="hero-section" transition:fly={{ y: 50, duration: 500 }}>
            <h1>Learn Finnish</h1>
            <p class="subtitle">Master the Finnish language through interactive learning</p>
        </div>

        <div class="features-grid">
            {#each features as feature, i}
                <div 
                    class="feature-card"
                    transition:fly={{ 
                        y: 50,
                        duration: 500,
                        delay: 200 + i * 100
                    }}
                >
                    <div class="icon-wrapper">
                        <svelte:component this={feature.icon} size={24} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                </div>
            {/each}
        </div>

        <div class="start-section" transition:fly={{ y: 50, duration: 500, delay: 600 }}>
            <h2>Ready to begin your Finnish journey?</h2>
            <p>Select any window below to start learning</p>
            <div class="arrow-indicator">↓</div>
        </div>
    {/if}
</div>

<style lang="scss">
    .landing-container {
        height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(31, 31, 31, 0.8) 100%
        );
        overflow-y: auto;
    }

    .hero-section {
        text-align: center;
        margin-bottom: 4rem;

        h1 {
            font-size: 4rem;
            font-weight: 700;
            margin: 0;
            background: linear-gradient(45deg, #4CAF50, #81C784);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .subtitle {
            font-size: 1.5rem;
            color: #e0e0e0;
            margin: 1rem 0 0 0;
            opacity: 0.9;
        }
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        width: 100%;
        max-width: 1200px;
        margin-bottom: 4rem;
    }

    .feature-card {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        transition: transform 0.3s ease, background 0.3s ease;

        &:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.1);
        }

        .icon-wrapper {
            background: rgba(76, 175, 80, 0.1);
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem auto;
            color: #4CAF50;
        }

        h3 {
            font-size: 1.5rem;
            margin: 0 0 1rem 0;
            color: #4CAF50;
        }

        p {
            font-size: 1rem;
            color: #e0e0e0;
            margin: 0;
            line-height: 1.5;
        }
    }

    .start-section {
        text-align: center;
        margin-top: 2rem;

        h2 {
            font-size: 2rem;
            color: #4CAF50;
            margin: 0 0 1rem 0;
        }

        p {
            font-size: 1.2rem;
            color: #e0e0e0;
            margin: 0;
        }

        .arrow-indicator {
            font-size: 2rem;
            color: #4CAF50;
            margin-top: 1rem;
            animation: bounce 2s infinite;
        }
    }

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }

    @media (max-width: 768px) {
        .hero-section {
            h1 {
                font-size: 3rem;
            }
            .subtitle {
                font-size: 1.2rem;
            }
        }

        .feature-card {
            padding: 1.5rem;
        }

        .start-section {
            h2 {
                font-size: 1.5rem;
            }
            p {
                font-size: 1rem;
            }
        }
    }
</style>