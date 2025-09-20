import {
  client,
  DATABASE_ID,
  databases,
  HABIT_COMPLETIONS_TABLE_NAME,
  HABITS_TABLE_NAME,
  RealTimeResponse,
} from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { Habit, HabitCompletion } from '@/types/database.type';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Query } from 'react-native-appwrite';
import { Card, Text } from 'react-native-paper';

export default function StreaksScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>([]);

  const { user } = useAuth();

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_TABLE_NAME,
        [Query.equal('user_id', user?.$id ?? ''), Query.orderDesc('created_at')]
      );

      setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompletions = async () => {
    try {
      if (!user) return;

      const response = await databases.listDocuments(
        DATABASE_ID,
        HABIT_COMPLETIONS_TABLE_NAME,
        [Query.equal('user_id', user?.$id ?? '')]
      );

      setCompletedHabits(response.documents as HabitCompletion[]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_TABLE_NAME}.documents`;
    const habitCompletionsChannel = `databases.${DATABASE_ID}.collections.${HABIT_COMPLETIONS_TABLE_NAME}.documents`;

    const habitsSubscription = client.subscribe(
      habitsChannel,
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

    const habitCompletionsSubscription = client.subscribe(
      habitCompletionsChannel,
      (response: RealTimeResponse) => {
        if (
          response.events.includes(
            'databases.*.collections.*.documents.*.create'
          )
        ) {
          fetchCompletions();
        }
      }
    );

    fetchHabits();
    fetchCompletions();

    return () => {
      habitsSubscription();
      habitCompletionsSubscription();
    };
  }, [user]);

  interface StreakData {
    streak: number;
    bestStreak: number;
    total: number;
  }

  const getStreakData = (habitId: string): StreakData => {
    const habitCompletions = completedHabits
      .filter((hc) => hc.habit_id === habitId)
      .sort(
        (a, b) =>
          new Date(a.completed_at).getTime() -
          new Date(b.completed_at).getTime()
      );

    if (habitCompletions.length === 0) {
      return {
        streak: 0,
        bestStreak: 0,
        total: 0,
      };
    }

    let streak = 0;
    let bestStreak = 0;
    let total = habitCompletions.length;

    let lastDate: Date | null = null;
    let currentStreak = 0;

    habitCompletions.forEach((completion) => {
      const completionDate = new Date(completion.completed_at);
      if (lastDate) {
        const diff =
          (completionDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);

        if (diff <= 1) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      if (currentStreak > bestStreak) bestStreak = currentStreak;
      streak = currentStreak;
      lastDate = completionDate;
    });

    return { streak, bestStreak, total };
  };

  const habitStreaks = habits.map((habit) => {
    const { streak, bestStreak, total } = getStreakData(habit.$id);
    return { habit, bestStreak, streak, total };
  });

  const rankedHabits = [...habitStreaks].sort(
    (a, b) => b.bestStreak - a.bestStreak
  );

  const badgeStyles = [styles.badge1, styles.badge2, styles.badge3];

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant='headlineSmall'>
        Habit Streaks
      </Text>

      {rankedHabits.length > 0 && (
        <View style={styles.rankingContainer}>
          <Text style={styles.rankingTitle}>🏅 Top Streaks</Text>
          {rankedHabits.slice(0, 3).map((item, key) => {
            return (
              <View key={item.habit.$id} style={styles.rankingRow}>
                <View style={[styles.rankingBadge, badgeStyles[key]]}>
                  <Text style={styles.rankingBadgeText}>{key + 1}</Text>
                </View>
                <Text style={styles.rankingHabit}>{item.habit.title}</Text>
                <Text style={styles.rankingStreak}>{item.bestStreak}</Text>
              </View>
            );
          })}
        </View>
      )}

      {habits.length === 0 ? (
        <View>
          <Text>No habits found. Add a habit to get started!</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {rankedHabits.map(({ habit, bestStreak, streak, total }, key) => (
            <Card
              key={habit.$id}
              style={[styles.card, key === 0 && styles.firstCard]}
            >
              <Card.Content>
                <Text style={styles.habitTitle}>{habit.title}</Text>
                <Text style={styles.habitDescription}>{habit.description}</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statBadge}>
                    <Text style={styles.statBadgeText}>🔥 {streak}</Text>
                    <Text style={styles.statBadgeLabel}>Current</Text>
                  </View>
                  <View style={styles.statBadgeGold}>
                    <Text style={styles.statBadgeText}>🏆 {bestStreak}</Text>
                    <Text style={styles.statBadgeLabel}>Best</Text>
                  </View>
                  <View style={styles.statBadgeGreen}>
                    <Text style={styles.statBadgeText}>✅ {total}</Text>
                    <Text style={styles.statBadgeLabel}>Total</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  firstCard: {
    borderWidth: 2,
    borderColor: '#7C4DFF',
  },
  habitTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  habitDescription: {
    color: '#6C6C80',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  statBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 70,
  },
  statBadgeGold: {
    backgroundColor: '#FFFDE7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 70,
  },
  statBadgeGreen: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 70,
  },
  statBadgeText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#22223B',
  },
  statBadgeLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
    fontWeight: '500',
  },
  rankingContainer: {
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  rankingTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#7C4DFF',
    letterSpacing: 0.5,
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  rankingBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#E0E0E0',
  },
  badge1: {
    backgroundColor: '#FFD700',
  },
  badge2: {
    backgroundColor: '#C0C0C0',
  },
  badge3: {
    backgroundColor: '#CD7F32',
  },
  rankingBadgeText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 15,
  },
  rankingHabit: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  rankingStreak: {
    fontSize: 14,
    color: '#7C4DFF',
    fontWeight: 'bold',
  },
});
