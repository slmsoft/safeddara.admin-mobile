import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { BottomNavigation } from './BottomNavigation';
import { ContactsScreen } from './ContactsScreen';
import { CallsScreen } from './CallsScreen';
import { ChatsScreen } from './ChatsScreen';
import { SettingsScreen } from './SettingsScreen';

type TabType = 'contacts' | 'calls' | 'chats' | 'settings';

export function WelcomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('chats');

  // Примеры бейджей с уведомлениями
  const badges = {
    contacts: 0,
    calls: 2,
    chats: 19,
    settings: 0,
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: 'linear-gradient(90deg, #8EA3FE 29.81%, #71BCF0 70.19%)',
      }}
    >
      {/* Screen Content with AnimatePresence */}
      <AnimatePresence mode="wait">
        {activeTab === 'contacts' && <ContactsScreen key="contacts" />}
        {activeTab === 'calls' && <CallsScreen key="calls" />}
        {activeTab === 'chats' && <ChatsScreen key="chats" />}
        {activeTab === 'settings' && <SettingsScreen key="settings" />}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badges={badges}
      />
    </div>
  );
}
