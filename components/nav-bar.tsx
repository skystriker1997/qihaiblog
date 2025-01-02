import Link from 'next/link';
import Image from "next/image";

export function NavigationBar() {
    return (
        <nav className="py-2 px-2 w-full lg:max-w-[50%] mx-auto bg-gray-200">
            <div className="flex flex-row justify-between items-center py-2 px-2">
                <Link href="/" className="text-[#1a2a3a] text-2xl">
                    岐海鄉民
                </Link>

                <div className="flex flex-row justify-between items-center gap-4">
                    <Link href="mailto:mayland9797@gmail.com">
                        <Image
                            src="gmail.svg"
                            alt="Gmail"
                            width={32}
                            height={32}
                            className="inline"
                        />
                    </Link>
                    <Link href="https://github.com/skystriker1997/qihaiblog.git">
                        <Image
                            src="github.svg"
                            alt="Github"
                            width={32}
                            height={32}
                            className="inline"
                        />
                    </Link>
                </div>
            </div>
        </nav>
    );
}