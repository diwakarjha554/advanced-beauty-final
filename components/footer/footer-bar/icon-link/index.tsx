import Link from 'next/link';
import { headers } from 'next/headers';
import { IconType } from 'react-icons';

interface IconLinkProps {
    icon: IconType;
    activeIcon: IconType;
    href: string;
    text?: string;
}

const IconLink = async ({ icon: Icon, activeIcon: ActiveIcon, href, text }: IconLinkProps) => {
    const headersList = await headers();
    const pathname = headersList.get('x-invoke-path') || '';
    const isActive = pathname === href || (href === '/' && pathname === '');

    const IconComponent = isActive ? ActiveIcon : Icon;

    return (
        <Link href={href} className="flex flex-col justify-center items-center">
            <IconComponent size={26} className={isActive ? 'text-[#D9C1A3]' : 'text-[#a3a3a3] hover:text-[#D9C1A3]'} />
            <p
                className={`text-[10px] ${
                    isActive ? 'text-[#D9C1A3] font-semibold' : 'text-[#a3a3a3] hover:text-[#D9C1A3]'
                }`}
            >
                {text}
            </p>
        </Link>
    );
};

export default IconLink;