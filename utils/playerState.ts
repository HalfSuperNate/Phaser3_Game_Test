import Inventory, { Item } from './inventory';

interface PlayerPosition {
    position: {x: number, y: number};
    facingDirection: string;
    map: string;
    //tiles: string;
}

interface PlayerStats {
    health: number;
    attack: number;
    defense: number;
}

interface GameProgression {
    completedQuests: number;
    currentLevel: number;
    // Add more properties as needed
}

class PlayerState extends Inventory {
    private playerPosition: PlayerPosition;
    private stats: PlayerStats;
    private progression: GameProgression;

    constructor() {
        super();
        this.playerPosition = { position: {x: 0, y:0}, facingDirection: 'down', map: 'testmap' };
        this.stats = { health: 100, attack: 10, defense: 5 };
        this.progression = { completedQuests: 0, currentLevel: 1 };
    }

    // Methods to update player position
    updatePlayerPosition(newPlayerPosition: Partial<PlayerPosition>): void {
        this.playerPosition = { ...this.playerPosition, ...newPlayerPosition };
    }

    // Methods to update player stats
    updateStats(newStats: Partial<PlayerStats>): void {
        this.stats = { ...this.stats, ...newStats };
    }

    // Methods to track game progression
    updateProgression(newProgression: Partial<GameProgression>): void {
        this.progression = { ...this.progression, ...newProgression };
    }

    // Override methods from Inventory class if needed

    // Example method to equip an item
    equipItem(itemId: number): void {
        // Your implementation here, accessing both stats and items
    }

    // Example method to unequip an item
    unequipItem(itemId: number): void {
        // Your implementation here, accessing both stats and items
    }

    setItems(items: Item[]): void {
        // Clear all existing items
        this.clear();

        // Add new items
        items.forEach(item => {
            this.addItem(item);
        });
    }

    static async loadFromJSON(uri: string): Promise<PlayerState> {
        try {
            // Fetch JSON data from the URI
            const response = await fetch(uri);
            const jsonData = await response.json();

            // Extract player state data from JSON
            const playerPosition: PlayerPosition = jsonData.playerPosition;
            const stats: PlayerStats = jsonData.stats;
            const progression: GameProgression = jsonData.progression;
            const inventory: Item[] = jsonData.inventory; // Assuming inventory data is present in JSON

            // Create a new PlayerState object and set its properties
            const playerState = new PlayerState();
            playerState.playerPosition = playerPosition;
            playerState.stats = stats;
            playerState.progression = progression;
            playerState.setItems(inventory); // Assuming a method to set inventory items exists

            return playerState;
        } catch (error) {
            console.error('Error loading player state from JSON:', error);
            throw error;
        }
    }

    // Add more methods as needed
}
