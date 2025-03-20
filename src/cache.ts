import fs from 'fs-extra';

export class Cache {
    private cacheFilePath: string;
    private cache: Map<string, {
        success: boolean;
        error?: string;
    }> = new Map();

    constructor(cacheFilePath: string) {
        this.cacheFilePath = cacheFilePath;
    }

    public add(filePath: string, success: boolean, error?: string) {    
        this.cache.set(filePath, {
            success,
            error
        });
    }

    public get(filePath: string) {
        return this.cache.get(filePath);
    }

    public save() {
        const object = Object.fromEntries(this.cache);

        fs.writeJSONSync(this.cacheFilePath, object, {
            spaces: 2,
            EOL: '\n'
        });
    }

    public load() {
        if(!fs.existsSync(this.cacheFilePath)) {
            return;
        }

        const object = fs.readJSONSync(this.cacheFilePath);
        this.cache = new Map(Object.entries(object));
    }
}