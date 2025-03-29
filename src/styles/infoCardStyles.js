import { StyleSheet } from 'react-native';

const infoCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA', // daha açık arka plan
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  header: {
    backgroundColor: '#A8DADC',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A8DADC',
  },
  activeHeader: {
    backgroundColor: '#CDEAC0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'flex-start',
  },
  card: {
    backgroundColor: '#F1FAEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#A8DADC',
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
