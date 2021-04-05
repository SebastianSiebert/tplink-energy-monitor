import * as React from 'react';
import { NavButton, NavButtonProps } from './nav-button/nav-button';

export type NavBarItem = NavButtonProps;

type NavBarProps = {
    className: string;
    items: NavBarItem[];
    mainButtonClass: string;
};

export const NavBar: React.FC<NavBarProps> = (props: NavBarProps) => (
    <ul className={props.className}>
        {props.items.map((item) => (
            <NavButton
                key={item.linkText}
                url={item.url}
                icon={item.icon}
                className={item.className}
                mainButtonClass={props.mainButtonClass}
                linkText={item.linkText}
                isActive={item.isActive}
                isMobileButton={item.isMobileButton}
            />
        ))}
    </ul>
);
