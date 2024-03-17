// Define the Item interface
export interface Item {
    id: number;
    name: string;
    quantity: number;
    maxQuantity: number; // New property representing the maximum quantity limit for the item
}

// Define the Inventory class
export default class Inventory {
    private items: Item[];
    private equippedItems: Item[];

    constructor() {
        // Initialize an empty array to store items
        this.items = [];
        this.equippedItems = [];
    }

    // Method to remove all items from inventory and equippedItems
    clear(): void {
        this.items = [];
        this.equippedItems = [];
    }

    // Method to add an item to the inventory
    addItem(item: Item): void {
        const existingItem = this.items.find(existingItem => existingItem.id === item.id && existingItem.name === item.name);
        if (existingItem) {
            // If an item with the same ID and name already exists, update its quantity
            const totalQuantity = existingItem.quantity + item.quantity;
            existingItem.quantity = Math.min(totalQuantity, existingItem.maxQuantity); // Ensure quantity doesn't exceed maxQuantity
        } else {
            // Otherwise, add the new item to the inventory
            this.items.push(item);
        }
    }

    // Method to remove an item from the inventory
    removeItem(itemId: number): void {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    // Method to remove a specific quantity of an item from the inventory
    removeQuantity(itemId: number, quantityToRemove: number): void {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            const currentItem = this.items[itemIndex];
            const newQuantity = currentItem.quantity - quantityToRemove;
            if (newQuantity <= 0) {
                // If the new quantity becomes zero or negative, remove the item from the inventory
                this.items.splice(itemIndex, 1);
            } else {
                // Otherwise, update the quantity of the item
                currentItem.quantity = newQuantity;
            }
        }
    }

    // Method to get all items in the inventory
    getItems(): Item[] {
        return this.items;
    }

    // Method to get the quantity of a specific item in the inventory
    getItemQuantity(itemId: number): number {
        const item = this.items.find(item => item.id === itemId);
        return item ? item.quantity : 0;
    }

    // Method to equip an item
    equipItem(itemId: number): void {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            const item = this.items[itemIndex];
            // Logic to equip the item
            // For example, move it from items array to equippedItems array
            this.equippedItems.push(item);
            this.items.splice(itemIndex, 1);
        }
    }

    // Method to unequip an item
    unequipItem(itemId: number): void {
        const itemIndex = this.equippedItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            const item = this.equippedItems[itemIndex];
            // Logic to unequip the item
            // For example, move it from equippedItems array to items array
            this.items.push(item);
            this.equippedItems.splice(itemIndex, 1);
        }
    }

    // Add any other methods as needed
}
