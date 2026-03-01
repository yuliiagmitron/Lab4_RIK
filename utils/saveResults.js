export function saveResults(answers) {
  const lines = answers.map((item, index) => {
    const num = index + 1;
    const answer = Array.isArray(item.answer)
      ? item.answer.join(', ')
      : item.answer;
    return `${num}. ${item.question}\nВідповідь: ${answer}`;
  });

  const text = 'РЕЗУЛЬТАТИ ОПИТУВАННЯ\n' +
    '========================\n\n' +
    lines.join('\n\n') +
    '\n';

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'survey_results.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
