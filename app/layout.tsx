import '@/app/globals.css';
import { NavigationBar } from '@/components/nav-bar';


export const metadata = {
    title: '岐海乡民的空间',
    description: '这是一个个人博客，分享我的思考与创作。',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="zh">
            <body>
                <NavigationBar />
                <main className="mt-8 mx-auto w-full lg:max-w-[50%] lg:px-0 px-4">{children}</main>
            </body>
        </html>
    );
}
