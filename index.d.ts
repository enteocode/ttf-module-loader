declare module "ttf-module-loader"
{
    export interface TTFModuleOptions
    {
        // Output file pattern
        output: string,

        // Should WebFonts generated for older systems (IE6+, Legacy iOS)
        legacy: boolean
    }
}
