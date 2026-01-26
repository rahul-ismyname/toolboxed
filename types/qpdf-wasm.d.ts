declare module 'qpdf-wasm' {
    interface QPDFModule {
        FS: {
            writeFile(path: string, data: Uint8Array): void;
            readFile(path: string): Uint8Array;
        };
        callMain(args: string[]): number;
    }

    export default function init(options?: {
        locateFile?: (path: string) => string;
    }): Promise<QPDFModule>;
}
