import type { Character } from '../types';

export function convertToCsv(characters: Character[]): string {
  const headers = ['Name', 'Status', 'Species', 'Gender', 'Origin', 'Location', 'Image'];
  
  const rows = characters.map((char) => [
    char.name,
    char.status,
    char.species,
    char.gender,
    char.origin.name,
    char.location.name,
    char.image,
  ]);

  const csvContent = [
    headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map((row) => row.map((val) => `"${(val || '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return csvContent;
}

export function downloadCsv(characters: Character[]): void {
  if (characters.length === 0) return;

  const csv = convertToCsv(characters);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', `${characters.length}_items.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
