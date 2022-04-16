import xml2js from "xml2js"

export default async function parseStringAsync(xml: string): Promise<any> {
    return xml2js.parseStringPromise(xml, {
        valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans],
        attrValueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans],
        firstCharLowerCase: true,
        trim: true,
    })
} 