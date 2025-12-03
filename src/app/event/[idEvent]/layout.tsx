import { BackButton } from '@src/components/common/Buttons';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='max-w-7xl mx-auto'>
            <BackButton />
            {children} 
        </div>
    );
}