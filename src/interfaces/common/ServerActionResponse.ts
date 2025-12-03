export interface ServerActionResponse<T> {
    success: boolean;
    type: "error" | "success" | "warning";
    message: string;
    data?: T;
}