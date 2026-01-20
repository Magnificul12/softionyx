import { useEffect } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    const cursorDot = document.querySelector('.custom-cursor-dot') as HTMLElement;

    const moveCursor = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
      }
      if (cursorDot) {
        cursorDot.style.left = e.clientX - 2 + 'px';
        cursorDot.style.top = e.clientY - 2 + 'px';
      }
    };

    const handleMouseEnter = () => {
      cursor?.classList.add('hover');
    };

    const handleMouseLeave = () => {
      cursor?.classList.remove('hover');
    };

    document.addEventListener('mousemove', moveCursor);

    // Only add custom cursor on desktop
    let interactiveElements: NodeListOf<Element> | null = null;
    if (window.innerWidth >= 1024) {
      interactiveElements = document.querySelectorAll('a, button, .service-card, .nav-list a');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    }

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      if (interactiveElements) {
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      }
    };
  }, []);

  return (
    <>
      <div className="custom-cursor"></div>
      <div className="custom-cursor-dot"></div>
    </>
  );
}

