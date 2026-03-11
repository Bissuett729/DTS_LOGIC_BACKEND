/**
 * Convierte una cadena a Title Case (primera letra de cada palabra mayúscula)
 * @param str String a convertir
 * @returns String en Title Case
 * @example toTitleCase('miguel bissuett') → 'Miguel Bissuett'
 * @example toTitleCase('john doe smith') → 'John Doe Smith'
 */
export function toTitleCase(str: string): string {
    if (!str) return str;
    
    return str
        .split(/\s+/) // Divide por espacios en blanco (uno o más)
        .map(word => {
            if (word.length === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
}
