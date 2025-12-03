export const getThemeTypeEvent = (typeEvent: string): string => {
    switch (typeEvent) {
        case "CONFERENCIA":
            return "bg-blue-500 text-white";
        case "TALLER":
            return "bg-green-500 text-white";
        case "EXPOSICION":
            return "bg-yellow-500 text-white";
        case "CONCIERTO":
            return "bg-purple-500 text-white";
        case "OBRA_DE_TEATRO":
            return "bg-red-500 text-white";
        case "PROYECCION":
            return "bg-pink-500 text-white";
        case "FERIA":
            return "bg-orange-500 text-white";
        default:
            return "bg-green-500 text-white";
    }
}