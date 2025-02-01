"use client";

import React, { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { Portal } from "@/components/atoms/layout/Portal";

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
}

type ReactElementWithProps = React.ReactElement<{
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}>;

export const DropdownMenu = ({ children, trigger }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 192, // 192px is the width of the menu (w-48)
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        updatePosition();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("scroll", handleScroll, true);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  const wrapWithClickHandler = (element: ReactElementWithProps) => {
    return React.cloneElement(element, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        if (element.props.onClick) {
          element.props.onClick(e);
        }
        setIsOpen(false);
      },
    });
  };

  // Wrap children with click handlers that close the dropdown
  const wrappedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const element = child as ReactElementWithProps;

    // If it's a Fragment, map over its children
    if (element.type === React.Fragment) {
      const fragmentChildren = React.Children.map(
        element.props.children,
        (fragmentChild) => {
          if (!React.isValidElement(fragmentChild)) {
            return fragmentChild;
          }
          return wrapWithClickHandler(fragmentChild as ReactElementWithProps);
        }
      );
      return fragmentChildren;
    }

    // If it's a regular element with onClick prop
    if ("onClick" in element.props) {
      return wrapWithClickHandler(element);
    }

    return element;
  });

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleClick}
        className="p-2 hover:bg-bg-700 rounded-lg"
      >
        {trigger || <MoreVertical size={20} className="text-neutral-400" />}
      </button>

      {isOpen && (
        <Portal>
          <div
            ref={menuRef}
            className="fixed w-48 bg-bg-800 rounded-lg shadow-lg border border-bg-700 py-1 z-[100]"
            style={{ top: position.top, left: position.left }}
            onClick={(e) => e.stopPropagation()}
          >
            {wrappedChildren}
          </div>
        </Portal>
      )}
    </>
  );
};
