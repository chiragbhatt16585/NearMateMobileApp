import React from 'react';
import { View, Text, StyleSheet, useColorScheme, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import Header from '../components/Header';
import type { ProviderProfile } from './ProviderProfileScreen';

type ChatMessage = {
  id: string;
  from: 'me' | 'provider';
  text: string;
  ts: number;
};

type ChatScreenProps = {
  provider: ProviderProfile;
  onBack: () => void;
};

export default function ChatScreen({ provider, onBack }: ChatScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = React.useMemo(
    () => ({
      background: isDarkMode ? '#0B0D0F' : '#FFFFFF',
      surface: isDarkMode ? '#0F1215' : '#FBFCFD',
      textPrimary: isDarkMode ? '#E7E9EA' : '#0F1419',
      textMuted: isDarkMode ? '#8A9199' : '#687076',
      border: isDarkMode ? '#1C2228' : '#ECEEF0',
      bubbleMe: isDarkMode ? '#1E293B' : '#111111',
      bubbleMeText: '#FFFFFF',
      bubbleOther: isDarkMode ? '#0F1215' : '#F3F4F6',
      bubbleOtherText: isDarkMode ? '#E7E9EA' : '#0F1419',
      sendBg: '#111111',
      sendText: '#FFFFFF',
    }),
    [isDarkMode]
  );

  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: 'm1', from: 'provider', text: `Hi, I'm ${provider.name}. How can I help you?`, ts: Date.now() - 1000 * 60 * 60 },
    { id: 'm2', from: 'me', text: 'Hello! I need help with a service.', ts: Date.now() - 1000 * 60 * 50 },
  ]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const mine: ChatMessage = { id: 'm-' + Date.now(), from: 'me', text, ts: Date.now() };
    setMessages(prev => [...prev, mine]);
    setInput('');
    // Simulate provider reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: 'r-' + Date.now(), from: 'provider', text: 'Got it! I will confirm shortly.', ts: Date.now() }]);
    }, 700);
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.from === 'me';
    return (
      <View style={[styles.row, { justifyContent: isMe ? 'flex-end' : 'flex-start' }]}> 
        <View style={[styles.bubble, isMe ? { backgroundColor: colors.bubbleMe } : { backgroundColor: colors.bubbleOther, borderWidth: 1, borderColor: colors.border }]}> 
          <Text style={[styles.msgText, { color: isMe ? colors.bubbleMeText : colors.bubbleOtherText }]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Header title={`Chat · ${provider.name}`} onBack={onBack} />
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}> 
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
        <View style={[styles.composer, { borderTopColor: colors.border }]}> 
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { color: colors.textPrimary }]}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Pressable style={[styles.sendBtn, { backgroundColor: colors.sendBg }]} onPress={send}> 
            <Text style={[styles.sendText, { color: colors.sendText }]}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 8 },
  row: { width: '100%', flexDirection: 'row' },
  bubble: { maxWidth: '78%', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 12 },
  msgText: { fontSize: 14 },
  composer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, padding: 10, gap: 8 },
  input: { flex: 1, fontSize: 14 },
  sendBtn: { height: 36, paddingHorizontal: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sendText: { fontSize: 13, fontWeight: '700' },
});


