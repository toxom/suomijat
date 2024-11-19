import { writable } from 'svelte/store';
import { pb } from '$lib/pocketbase';
import type { BusinessAccount, User } from '$lib/types/accounts';

function createBusinessStore() {
    const { subscribe, set, update } = writable<BusinessAccount | null>(null);

    return {
        subscribe,
        set,
        update,
        async fetch(userId: string) {
            try {
                const account = await pb.collection('business_accounts').getFirstListItem(`user="${userId}"`);
                set(account as BusinessAccount);
            } catch (error) {
                console.error('Error fetching business account:', error);
                set(null);
            }
        },
        async create(userId: string) {
            try {
                const newAccount: Partial<BusinessAccount> = {
                    user: userId,
                    name: '',
                    business_email: '',
                    business_type: 'sole proprietorship',
                    industry: 'other',
                    // ... add other default fields as necessary
                };
                const created = await pb.collection('business_accounts').create(newAccount);
                set(created as BusinessAccount);
            } catch (error: any) {
                console.error('Error creating business account:', error?.data?.message || error.message || error);
                set(null);
            }
        },
        async save(account: BusinessAccount) {
            try {
                const updated = await pb.collection('business_accounts').update<BusinessAccount>(account.id, account);
                set(updated);
            } catch (error) {
                console.error('Error updating business account:', error);
            }
        }
    };
}

export const businessStore = createBusinessStore();