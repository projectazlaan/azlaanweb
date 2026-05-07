'use client';

import { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import gjsForms from 'grapesjs-plugin-forms';
import gjsCustomCode from 'grapesjs-custom-code';
// @ts-ignore
import gjsTouch from 'grapesjs-touch';
import gjsPostcss from 'grapesjs-parser-postcss';

const LIVE_SITE_URL = 'http://localhost:3001';

export default function StudioEditorFull() {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current || editorInstanceRef.current) return;

    const editor = grapesjs.init({
      container: editorRef.current!,
      height: '100vh',
      width: 'auto',
      storageManager: false,

      // ✅ KEY: Load the live site directly into the canvas iframe
      canvas: {
        styles: [],
        scripts: [],
        frameContent: `
          <!DOCTYPE html>
          <html>
            <head>
              <base href="${LIVE_SITE_URL}/" target="_blank">
              <style>
                * { box-sizing: border-box; }
                [data-gjs-type] { outline: none; }
              </style>
            </head>
            <body>
              <iframe 
                id="live-site-frame"
                src="${LIVE_SITE_URL}"
                style="width:100%; height:100vh; border:none; display:block;"
                sandbox="allow-same-origin allow-scripts allow-forms"
              ></iframe>
            </body>
          </html>
        `,
      },

      // Load components from the live site
      components: `<iframe 
        id="live-site-frame"
        src="${LIVE_SITE_URL}"
        style="width:100%; height:100vh; border:none; display:block;"
      ></iframe>`,

      plugins: [
        gjsPresetWebpage,
        gjsBlocksBasic,
        gjsForms,
        gjsCustomCode,
        gjsTouch,
        gjsPostcss,
      ],
      pluginsOpts: {
        [gjsPresetWebpage as any]: {},
        [gjsBlocksBasic as any]: { flexGrid: true },
        [gjsForms as any]: {},
        [gjsCustomCode as any]: {},
        [gjsTouch as any]: {},
        [gjsPostcss as any]: {},
      },
    });

    editorInstanceRef.current = editor;

    // Auto-save
    editor.on('storage:store', () => {
      const dataToSave = {
        html: editor.getHtml(),
        css: editor.getCss(),
      };
      fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
    });

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-[#1a1a1a] overflow-hidden">
      <div ref={editorRef} />
    </div>
  );
}
