import { pb } from '$lib/pocketbase';
import type { BusinessAccount } from '$lib/types/accounts';
import { businessStore } from '$lib/stores/businessStore';

export class BusinessClient {
    subscribe(run: (value: BusinessAccount | null) => void) {
        return businessStore.subscribe(run);
    }

    async fetch(userId: string): Promise<void> {
        await businessStore.fetch(userId);
    }

    async create(userId: string): Promise<void> {
        await businessStore.create(userId);
    }

    async save(account: BusinessAccount): Promise<void> {
        await businessStore.save(account);
    }
    async updateField<K extends keyof BusinessAccount>(field: K, value: BusinessAccount[K]): Promise<void> {
        businessStore.update(account => {
            if (account) {
                account[field] = value;
            }
            return account;
        });
    
        const currentAccount = this.getCurrentAccount();
        if (currentAccount) {
            await this.save(currentAccount);
        }
    }

    getCurrentAccount(): BusinessAccount | null {
        let currentAccount: BusinessAccount | null = null;
        businessStore.subscribe(value => {
            currentAccount = value;
        })();
        return currentAccount;
    }

    setLanguages(languagesString: string): void {
        const languages = languagesString.split(',').map(lang => lang.trim());
        this.updateField('languages', languages);
    }

    async handleLogoUpload(file: File): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('business_logo', file);
            const account = this.getCurrentAccount();
            if (account) {
                const updated = await pb.collection('business_accounts').update(account.id, formData);
                businessStore.update(account => {
                    if (account) {
                        account.business_logo = updated.business_logo;
                    }
                    return account;
                });
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
        }
    }

    async logout(): Promise<void> {
        try {
            await pb.authStore.clear();
            businessStore.set(null);
        } catch (err) {
            console.error('Logout error:', err);
        }
    }
}

export const businessClient = new BusinessClient();