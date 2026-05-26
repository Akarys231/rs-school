import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { convertToCsv, downloadCsv } from './downloadCsv';
import type { Character } from '../types';

const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Rick "The C-137" Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'img1.png',
    episode: [],
    url: '',
    created: '',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'img2.png',
    episode: [],
    url: '',
    created: '',
  },
];

describe('downloadCsv utilities', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('convertToCsv formats character array to standard escaped CSV string', () => {
    const csv = convertToCsv(mockCharacters);
    const lines = csv.split('\n');

    expect(lines[0]).toBe('"Name","Status","Species","Gender","Origin","Location","Image"');
    expect(lines[1]).toBe('"Rick ""The C-137"" Sanchez","Alive","Human","Male","Earth","Earth","img1.png"');
    expect(lines[2]).toBe('"Morty Smith","Alive","Human","Male","Earth","Earth","img2.png"');
  });

  it('downloadCsv creates temporary link and triggers download', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    downloadCsv(mockCharacters);

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('downloadCsv returns immediately and does nothing if characters list is empty', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    downloadCsv([]);
    expect(appendSpy).not.toHaveBeenCalled();
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});
