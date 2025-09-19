import {
  client,
  DATABASE_ID,
  databases,
  HABITS_TABLE_NAME,
  RealTimeResponse,
} from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { Habit } from '@/types/database.type';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Query } from 'react-native-appwrite';
import { Button, Surface, Text } from 'react-native-paper';

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = `databases.${DATABASE_ID}.collections.${HABITS_TABLE_NAME}.documents`;
    const habitsSubscription = client.subscribe(
      channel,
      (response: RealTimeResponse) => {
        if (
          response.events.includes(
            'databases.*.collections.*.documents.*.create'
          )
        ) {
          fetchHabits();
        } else if (
          response.events.includes(
            'databases.*.collections.*.documents.*.update'
          )
        ) {
          fetchHabits();
        } else if (
          response.events.includes(
            'databases.*.collections.*.documents.*.delete'
          )
        ) {
          fetchHabits();
        }
      }
    );

    fetchHabits();

    return () => {
      habitsSubscription();
    };
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_TABLE_NAME,
        [Query.equal('user_id', user?.$id ?? '')]
      );
      console.log(response);
      setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant='headlineSmall' style={styles.title}>
          Today&apos;s Habits
        </Text>
        <Button mode='contained' icon='plus' onPress={() => {}}>
          Add Habit
        </Button>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {habits?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No habits found. Add a habit to get started!
            </Text>
          </View>
        ) : (
          habits!.map((habit) => (
            <Surface key={habit.$id} style={styles.card} elevation={0}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{habit.title}</Text>
                <Text style={styles.cardDescription}>{habit.description}</Text>
                <View style={styles.cardFooter}>
                  <View style={styles.streakBadge}>
                    <MaterialCommunityIcons
                      name='fire'
                      size={18}
                      color='#FF9800'
                    />
                    <Text style={styles.streakText}>
                      {habit.streak_count} day streak
                    </Text>
                  </View>
                  <View style={styles.frequencyBadge}>
                    <Text style={styles.frequencyText}>
                      {habit.frequency.charAt(0).toUpperCase() +
                        habit.frequency.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </Surface>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: '#F7F2FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#22223b',
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: '#6C6C80',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    marginLeft: 6,
    color: '#FF9800',
    fontWeight: 'bold',
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: '#EDE7F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  frequencyText: {
    color: '#7C4DFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666666',
  },
});
