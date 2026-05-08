'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
export default function VisualEditorBridge() {
  const searchParams = useSearchParams();
  const isEditorMode = searchParams.get('editor') === 'true';
  useEffect(() => {
    if (!isEditorMode) return;
    const handleElementClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Find the closest editable parent or check if target is editable
      // We look for elements with text content or specific data attributes
      const editableElement = target.closest('[data-editable-id]') || 
                             (target.tagName === 'H1' || target.tagName === 'H2' || 
                              target.tagName === 'H3' || target.tagName === 'P' || 
                              target.tagName === 'SPAN' || target.tagName === 'BUTTON' ||
                              target.tagName === 'A' || target.tagName === 'LI' ||
                              target.tagName === 'IMG' ? target : null);
      if (editableElement) {
        e.preventDefault();
        e.stopPropagation();
        // Highlight the element visually
        const allEditables = document.querySelectorAll('.editor-highlight');
        allEditables.forEach(el => el.classList.remove('editor-highlight'));
        (editableElement as HTMLElement).classList.add('editor-highlight');
        // Extract content
        const content = editableElement.tagName === 'IMG' 
          ? (editableElement as HTMLImageElement).src 
          : (editableElement as HTMLElement).innerText;
        // Send message to parent (The Admin Dashboard Iframe)
        window.parent.postMessage({
          type: 'ELEMENT_SELECTED',
          element: {
            id: editableElement.getAttribute('data-editable-id') || Math.random().toString(36).substr(2, 9),
            type: editableElement.tagName === 'IMG' ? 'image' : 'text',
            content: content,
            section: editableElement.closest('section')?.id || 'General',
            key: (editableElement as HTMLElement).getAttribute('data-editable-key') || (editableElement as HTMLElement).innerText.slice(0, 20)
          }
        }, '*');
      }
    };
    // Add styles for highlighting
    const style = document.createElement('style');
    style.id = 'editor-styles';
    style.innerHTML = `
      .editor-highlight {
        outline: 3px solid #8b5cf6 !important;
        outline-offset: 4px !important;
        position: relative !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
      }
      .editor-highlight::after {
        content: 'EDIT';
        position: absolute;
        top: -25px;
        right: 0;
        background: #8b5cf6;
        color: white;
        font-size: 10px;
        font-weight: 900;
        padding: 2px 8px;
        border-radius: 4px;
        pointer-events: none;
      }
      [data-editor-mode="true"] *:hover {
        outline: 1px dashed rgba(139, 92, 246, 0.4);
        outline-offset: 2px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
    document.body.setAttribute('data-editor-mode', 'true');
    document.addEventListener('click', handleElementClick, true);
    // Add a floating indicator
    const indicator = document.createElement('div');
    indicator.id = 'editor-indicator';
    indicator.innerHTML = '⚡ AZLAAN LIVE EDITOR ACTIVE';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #8b5cf6;
      color: white;
      padding: 8px 16px;
      border-radius: 99px;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.1em;
      z-index: 999999;
      box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.4);
      pointer-events: none;
    `;
    document.body.appendChild(indicator);
    return () => {
      document.removeEventListener('click', handleElementClick, true);
      const styleEl = document.getElementById('editor-styles');
      if (styleEl) styleEl.remove();
      const indicatorEl = document.getElementById('editor-indicator');
      if (indicatorEl) indicatorEl.remove();
      document.body.removeAttribute('data-editor-mode');
    };
  }, [isEditorMode]);
  return null;
}
