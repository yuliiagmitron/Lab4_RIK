import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export async function saveResults(answers) {
  const lines = answers.map((item, index) => {
    const num = index + 1;
    const answer = Array.isArray(item.answer)
      ? item.answer.join(', ')
      : item.answer;
    return `${num}. ${item.question}\nВідповідь: ${answer}`;
  });

  const text =
    'РЕЗУЛЬТАТИ ОПИТУВАННЯ\n' +
    '========================\n\n' +
    lines.join('\n\n') +
    '\n';

  if (Platform.OS === 'web') {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'survey_results.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    const fileUri = FileSystem.documentDirectory + 'survey_results.txt';
    await FileSystem.writeAsStringAsync(fileUri, text, {
      encoding: 'utf8',
    });
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/plain',
      dialogTitle: 'Зберегти або надіслати результати',
    });
  }
}
