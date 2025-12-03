export const themeBuilder = (status: "success" | "error" | "info") => {
    switch (status) {
        case "success":
            return "from-green-600/80 to-emerald-700/80";
        case "error":
            return "from-red-600/80 to-rose-700/80";
        case "info":
            return "from-yellow-600/80 to-orange-700/80";
        default:
            return "from-blue-600/80 to-sky-700/80";
    }
}