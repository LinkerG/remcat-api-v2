export function convertToMilliseconds(time) {
    if (time === "DNS" || time === "DNF") {
        // Se devuelve un numero demasiado grande para que la función no lo clasifique
        return Number.MAX_SAFE_INTEGER;
    }

    const [minutes, seconds, milliseconds] = time.split(':').map(Number);
    return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
}

export function sortResults(results) {
    const validResults = results.filter(result => result.isValid && result.time !== "DNS" && result.time !== "DNF");
    const dnsOrInvalidResults = results.filter(result => !result.isValid || result.time === "DNS" || result.time === "DNF");

    validResults.sort((a, b) => {
        const timeA = convertToMilliseconds(a.time);
        const timeB = convertToMilliseconds(b.time);
        return timeA - timeB;
    });

    return [...validResults, ...dnsOrInvalidResults];
}