class streetDataContainer{
    description: string = "";
    streetName: string = "";
    price: string = "";
    created_on: Date | null = null;
    properties: string = "";
    images: HTMLImageElement[] = [];
    county: string = "";
    scrapeVersion: string = "";
}

export default streetDataContainer;