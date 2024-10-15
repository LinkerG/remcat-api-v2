import { Result } from "src/result/schemas/result.schema";

export function convertToMilliseconds(time: string): number {
    if (time === "DNS" || time === "DNF") {
        // Se devuelve un número demasiado grande para que la función no lo clasifique
        return Number.MAX_SAFE_INTEGER;
    }

    const [minutes, seconds, milliseconds] = time.split(':').map(Number);
    return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
}

export function sortResults(results: Result[]): Result[] {
    const validResults = results.filter(result => result.isValid && result.time !== "DNS" && result.time !== "DNF");
    const dnsOrInvalidResults = results.filter(result => !result.isValid || result.time === "DNS" || result.time === "DNF");

    // Primero agrupamos por grupo y luego ordenamos por tiempo dentro de cada grupo
    validResults.sort((a, b) => {
        // Compara por el grupo (ascendente)
        if (a.group !== b.group) {
            return a.group - b.group;
        }

        // Si están en el mismo grupo, ordenar por tiempo
        const timeA = convertToMilliseconds(a.time);
        const timeB = convertToMilliseconds(b.time);
        return timeA - timeB;
    });

    // Los resultados DNS o DNF se colocan al final, sin importar el grupo
    return [...validResults, ...dnsOrInvalidResults];
}
