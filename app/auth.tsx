import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';

export default function AuthScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        setError(error);
        return;
      }
    } else {
      const error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }

      router.replace('/');
    }
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant='headlineMedium'>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>
        <TextInput
          label='Email'
          placeholder='example@email.com'
          autoCapitalize='none'
          keyboardType='email-address'
          mode='outlined'
          style={styles.input}
          onChangeText={setEmail}
        />
        <TextInput
          label='Password'
          autoCapitalize='none'
          secureTextEntry
          style={styles.input}
          mode='outlined'
          onChangeText={setPassword}
        />
        <Button mode='contained' onPress={handleAuth} style={styles.button}>
          {isSignUp ? 'Sign Up' : 'Log In'}
        </Button>
        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
        <Button
          mode='text'
          onPress={handleSwitchMode}
          style={styles.switchModeButton}
        >
          {isSignUp
            ? 'Already have an account? Log In'
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
});
