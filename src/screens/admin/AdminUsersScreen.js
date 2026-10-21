import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import useAdminData from "../../hooks/useAdminData";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "new", label: "New" },
];

function isWithinDays(dateish, days) {
  if (!dateish) return false;
  const diff = Date.now() - new Date(dateish).getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}

export default function AdminUsersScreen() {
  const { users, loading, error, refresh } = useAdminData();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    let list = users;

    if (filter === "active") list = list.filter((u) => isWithinDays(u.lastActive, 7));
    if (filter === "new") list = list.filter((u) => isWithinDays(u.joined, 7));

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          (u.parentEmail ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, filter, query]);

  if (loading && users.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <ActivityIndicator color={COLORS.adminAccent} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Users</Text>
        <Text style={styles.subtitle}>
          {users.length} learner{users.length === 1 ? "" : "s"} across the platform
        </Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search by child or parent email..."
        placeholderTextColor={COLORS.textMuted}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        ListEmptyComponent={
          <EmptyState
            emoji="🔍"
            title={users.length === 0 ? "No learners yet" : "No matches"}
            subtitle={
              users.length === 0
                ? "Accounts will appear here once families sign up."
                : "Try a different search or filter."
            }
          />
        }
        renderItem={({ item }) => (
          <View style={[styles.userCard, SHADOW.soft]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>
                {item.name} <Text style={styles.userAge}>• Age {item.age}</Text>
              </Text>
              <Text style={styles.userMeta} numberOfLines={1}>
                {item.parentEmail}
              </Text>
              <Text style={styles.userStats}>
                ⭐ {item.points} pts · 📚 {item.lessons} lessons
                {item.lastActive ? ` · last active ${item.lastActive}` : ""}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.adminBg },
  center: { alignItems: "center", justifyContent: "center" },
  headerWrap: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  title: { fontSize: FONT.h1 - 6, fontWeight: "800", color: COLORS.adminPrimary },
  subtitle: { fontSize: FONT.small, color: COLORS.textMuted, marginTop: 2 },
  search: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT.small,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterRow: { flexDirection: "row", paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.white,
    marginRight: SPACING.sm,
  },
  filterChipActive: { backgroundColor: COLORS.adminAccent },
  filterText: { fontWeight: "700", color: COLORS.textMuted, fontSize: FONT.small },
  filterTextActive: { color: COLORS.white },
  errorBanner: {
    color: COLORS.danger,
    fontSize: FONT.small,
    fontWeight: "700",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  list: { padding: SPACING.lg, paddingTop: SPACING.xs, flexGrow: 1 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.adminBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  avatarText: { fontSize: 22 },
  userName: { fontSize: FONT.body, fontWeight: "700", color: COLORS.textDark },
  userAge: { fontSize: FONT.small, fontWeight: "600", color: COLORS.textMuted },
  userMeta: { fontSize: FONT.tiny, color: COLORS.textMuted, marginTop: 2 },
  userStats: { fontSize: FONT.tiny, color: COLORS.adminAccent, marginTop: 4, fontWeight: "700" },
});
