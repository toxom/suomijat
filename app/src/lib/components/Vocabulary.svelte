<script lang="ts">
    import { Search } from 'lucide-svelte';
    import type { Word, WordType, VocabularyData } from '../types/vocabulary';
    import rawVocabularyData from '../data/vocabulary/FI.json';

    // Type assertion to ensure the imported data matches our types
    const vocabularyData = rawVocabularyData as VocabularyData;
    
    let words: Word[] = vocabularyData.words;
    let filteredWords: Word[] = words;
    let selectedType: string = 'all';
    let searchTerm: string = '';

    function filterWords() {
        filteredWords = words.filter(word => {
            const matchesType = selectedType === 'all' || word.type === selectedType;
            const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesType && matchesSearch;
        });
    }

    $: {
        if (searchTerm || selectedType) {
            filterWords();
        }
    }
</script>

<div class="vocabulary-container">
    <div class="controls">
        <div class="search-box">
            <Search size={20} />
            <input 
                type="text" 
                bind:value={searchTerm} 
                placeholder="Search words..."
            />
        </div>

        <select bind:value={selectedType}>
            <option value="all">All Types</option>
            <option value="verb">Verbs</option>
            <option value="adjective">Adjectives</option>
            <option value="noun">Nouns</option>
        </select>
    </div>

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Word</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                {#each filteredWords as word}
                    <tr>
                        <td class="word-cell">{word.word}</td>
                        <td class="type-cell {word.type}">{word.type}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style lang="scss">
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        color: #333;
    }

    .vocabulary-container {
        display: flex;
        flex-direction: column;
        height: 64vh;
        width: 100%;
        margin: 0 auto;
    }

    .controls {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 0.5rem;
    }

    .search-box {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        flex: 1;
        background-color: white;

        input {
            border: none;
            outline: none;
            width: 100%;
            font-size: 1rem;
            color: #333;
        }
    }

    select {
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-size: 1rem;
        background-color: white;
        color: #333;
    }

    .table-container {
        flex: 1;
        overflow-y: auto;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: white;

        table {
            width: 100%;
            border-collapse: collapse;
            
            th, td {
                padding: 0.75rem 1rem;
                text-align: left;
                border-bottom: 1px solid #eee;
            }

            th {
                position: sticky;
                top: 0;
                background-color: #f5f5f5;
                color: #333;
                font-weight: 600;
            }
        }
    }

    .word-cell {
        color: #333;
        font-weight: 500;
    }

    .type-cell {
        text-transform: capitalize;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        width: 1%;
        white-space: nowrap;
        
        &.verb {
            background-color: #e0f2fe;
            color: #0369a1;
        }
        
        &.adjective {
            background-color: #fef3c7;
            color: #92400e;
        }
        
        &.noun {
            background-color: #dcfce7;
            color: #166534;
        }
    }

    /* Scrollbar styling */
    .table-container {
        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        &::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    }
</style>