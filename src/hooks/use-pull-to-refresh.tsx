import { useState } from 'react';
import { RefreshControl } from 'react-native';

import { Colors } from '@/constants/theme';
import * as api from '@/services/api';

/** A RefreshControl to pass as `refreshControl` on any list or ScrollView. */
export function usePullToRefresh() {
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await api.refresh();
    } finally {
      setRefreshing(false);
    }
  }

  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />;
}
