import * as vscode from 'vscode';

export interface HistoryConfig {
    enabled: boolean;
    maxItems: number;
    autoSuggest: boolean;
    triggerCharacters: string[];
}

export class Configuration {
    private static instance: Configuration;
    private config: vscode.WorkspaceConfiguration;

    private constructor() {
        this.config = vscode.workspace.getConfiguration('shellsage');
    }

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            Configuration.instance = new Configuration();
        }
        return Configuration.instance;
    }

    public getHistoryConfig(): HistoryConfig {
        return {
            enabled: this.config.get<boolean>('suggestions.enabled', true),
            maxItems: this.config.get<number>('suggestions.maxItems', 5),
            autoSuggest: this.config.get<boolean>('suggestions.autoSuggest', true),
            triggerCharacters: this.config.get<string[]>('suggestions.triggerCharacters', ['-', '.', '/'])
        };
    }

    public getRecommendationPatterns(): any[] {
        return this.config.get<any[]>('recommendations.patterns', []);
    }

    public getMaxRecommendations(): number {
        return this.config.get<number>('recommendations.maxItems', 5);
    }
}
