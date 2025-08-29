import React from 'react';

const WHATSAPP_NUMBER = '919944264799';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

const WhatsAppPopup: React.FC = () => {     
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open WhatsApp Chat"
        className="relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        style={{ boxShadow: '0 0 16px 4px #22c55e, 0 0 32px 8px #22c55e55' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={32}
          height={32}
          viewBox="0 0 32 32"
          fill="currentColor"
          className="text-white"
        >
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.65.87 5.1 2.36 7.1L4 29l7.18-2.31C13.1 27.37 14.52 27.7 16 27.7c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22.7c-1.32 0-2.6-.26-3.8-.76l-.27-.11-4.26 1.37 1.37-4.26-.11-.27C6.26 17.6 6 16.32 6 15c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.67 1.12 2.86c.14.18 1.93 2.95 4.68 4.02.65.28 1.16.45 1.56.58.65.21 1.24.18 1.7.11.52-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z" />
        </svg>
        <span className="absolute inset-0 rounded-full animate-pulse bg-green-400 opacity-30 z-[-1]" />
      </a>
    </div>
  );
};

export default WhatsAppPopup;
