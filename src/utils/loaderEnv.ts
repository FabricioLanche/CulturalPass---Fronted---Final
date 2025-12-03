

type EnvKeys = 'BACKEND_URL' | 'NODE_ENV';

type EnvValues = {
    [K in EnvKeys]: string;
}

const envValues: EnvValues = {
    NODE_ENV: 'development',
    BACKEND_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
}

export default function loaderEnv(key: EnvKeys): string {
    return envValues[key] || ''
}
