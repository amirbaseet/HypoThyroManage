// src/styles/infoCardStyles.js

import { StyleSheet } from 'react-native';

const infoCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF9F6',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
    marginBottom: 15,
  },
  header: {
    backgroundColor: '#B08968',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#B08968',
  },
    activeHeader: {
    backgroundColor: '#BDA06F',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FAF9F6',
    textAlign: 'flex-start',
  },
  card: {
    backgroundColor: '#EAE7DC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#C6A477',
    elevation: 4,
  },
  contentText: {
    fontSize: 15,
    color: '#444',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
});

export default infoCardStyles;
